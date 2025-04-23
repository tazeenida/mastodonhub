describe('Admin Login and Access Control Tests', () => {
  const adminUrl = 'http://127.0.0.1:8000/admin/';
  const loginUrl = 'http://127.0.0.1:8000/admin/login/';
  const logoutUrl = 'http://127.0.0.1:8000/admin/logout/';
  const adminCredentials = {
    username: 'admin',
    password: 'Admin12345678',
  };
  const nonAdminCredentials = {
    username: 'user',
    password: 'userpass',
  };
  const invalidCredentials = {
    username: 'wronguser',
    password: 'wrongpass',
  };

  // Custom command for logging out
  Cypress.Commands.add('adminLogout', () => {
    // Get the CSRF token first
    cy.getCookie('csrftoken').then((cookie) => {
      // Make POST request to logout
      cy.request({
        method: 'POST',
        url: logoutUrl,
        headers: {
          'X-CSRFToken': cookie ? cookie.value : '',
        },
        failOnStatusCode: false
      });
    });
  });

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Login
    cy.visit(loginUrl);
    cy.get('input[name="username"]').type(adminCredentials.username);
    cy.get('input[name="password"]').type(adminCredentials.password);
    cy.get('input[type="submit"]').click();
    
    // Navigate to Mastodonhub events
    cy.contains('a', 'Mastodonhub eventss').click();
  });

  it('Allows admin user to log in and access the admin dashboard', () => {
    cy.url().should('include', adminUrl);
    cy.contains('a', 'Mastodonhub eventss').should('be.visible');
  });

  it('Shows an error for invalid credentials', () => {
    // Logout first
    cy.adminLogout();
    
    // Try invalid login
    cy.visit(loginUrl);
    cy.get('input[name="username"]').type(invalidCredentials.username);
    cy.get('input[name="password"]').type(invalidCredentials.password);
    cy.get('input[type="submit"]').click();
    
    // Should stay on login page
    cy.url().should('include', loginUrl);
  });

  it('Redirects unauthenticated users to the login page', () => {
    // Logout first
    cy.adminLogout();
    
    // Try accessing admin
    cy.visit(adminUrl);
    cy.url().should('include', loginUrl);
    cy.get('form').should('exist');
  });

  it('Denies access to non-admin users', () => {
    // Logout first
    cy.adminLogout();
    
    // Try non-admin login
    cy.visit(loginUrl);
    cy.get('input[name="username"]').type(nonAdminCredentials.username);
    cy.get('input[name="password"]').type(nonAdminCredentials.password);
    cy.get('input[type="submit"]').click();
    
    // Try accessing admin
    cy.visit(adminUrl);
    cy.url().should('include', loginUrl);
  });
});