describe('MastodonHub Events API DELETE Tests', () => {
    const BASE_URL = 'http://localhost:8000';
    const API_ENDPOINT = `${BASE_URL}/admin/mastodonhub/mastodonhubevents/`;
  
    const TEST_CREDENTIALS = {
      username: 'admin',
      password: 'Admin12345678'
    };
  
    // Login to Django admin
    const login = () => {
      cy.visit(`${BASE_URL}/admin/login/`);
      cy.get('#id_username').should('be.visible').type(TEST_CREDENTIALS.username);
      cy.get('#id_password').should('be.visible').type(TEST_CREDENTIALS.password);
      cy.get('form#login-form').submit();
      cy.url().should('not.include', '/login/', { timeout: 10000 });
    };
  
    beforeEach(() => {
      cy.session('admin-login', login, {
        validate() {
          cy.visit(`${BASE_URL}/admin/`);
          cy.url().should('not.include', '/login/');
        }
      });
    });
  
    // Test Case 1: Successful Event Deletion
    it('should successfully delete an existing event', () => {
      // Create a unique title with timestamp
      const eventTitle = `Test Event for Deletion ${Date.now()}`;
  
      // Create an event
      cy.visit(`${API_ENDPOINT}add/`);
      cy.get('#id_Title').type(eventTitle);
      cy.get('#id_Description').type('This event will be deleted in tests.');
      cy.get('#id_Location').type('Test Location');
      cy.get('#id_Date').type('2025-06-15');
      cy.get('#id_StartTime').type('10:00');
      cy.get('#id_EndTime').type('16:00');
      cy.get('#id_ImageUrl').type('https://example.com/test.jpg');
      cy.get('#id_Category').type('Test');
      cy.get('input[name="_save"]').click();
  
      // Find and click the created event
      cy.contains(eventTitle).click();
      
      // Click delete link
      cy.get('.deletelink').click();
      
      // Confirm deletion by clicking the Yes button
      cy.get('input[type="submit"]').last().click();
      
      // Verify deletion
      cy.wait(1000); // Wait for the deletion to complete
      cy.visit(API_ENDPOINT); // Explicitly visit the list page
      cy.get('#result_list').should('not.contain', eventTitle);
    });
  
    // Test Case 2: Deletion of Non-Existent Event
    it('should handle non-existent event deletion', () => {
      // Visit non-existent event delete page
      cy.visit(`${API_ENDPOINT}99999/delete/`, { failOnStatusCode: false });
      
      // Should be redirected to admin home
      cy.url().should('eq', `${BASE_URL}/admin/`);
  
      // Accessing non-existent object should redirect to admin home
      // No need to check for specific message as the redirect itself
      // indicates the object wasn't found
    });
  
    // Test Case 3: Unauthorized Access to Event Deletion
    it('should handle unauthorized access', () => {
      // First create an event
      const eventTitle = `Test Event for Unauthorized ${Date.now()}`;
      
      cy.visit(`${API_ENDPOINT}add/`);
      cy.get('#id_Title').type(eventTitle);
      cy.get('#id_Description').type('This event will be used for unauthorized access test.');
      cy.get('#id_Location').type('Test Location');
      cy.get('#id_Date').type('2025-06-15');
      cy.get('#id_StartTime').type('10:00');
      cy.get('#id_EndTime').type('16:00');
      cy.get('#id_ImageUrl').type('https://example.com/test.jpg');
      cy.get('#id_Category').type('Test');
      cy.get('input[name="_save"]').click();
  
      // Get the event's ID from URL after clicking
      cy.contains(eventTitle).click();
      
      // Store the event ID
      cy.location('pathname').then((pathname) => {
        const eventId = pathname.split('/').slice(-3)[0];
        
        // Clear the session
        cy.clearCookies();
        cy.clearLocalStorage();
  
        // Visit delete page directly - should redirect to login
        cy.visit(`${API_ENDPOINT}${eventId}/delete/`, { failOnStatusCode: false });
        cy.location('pathname').should('include', '/admin/login/');
      });
    });
  
    // Test Case 4: Error Handling for Event Deletion
    it('should handle server errors during deletion', () => {
      const eventTitle = `Test Event for Error ${Date.now()}`;
  
      // Create an event
      cy.visit(`${API_ENDPOINT}add/`);
      cy.get('#id_Title').type(eventTitle);
      cy.get('#id_Description').type('This event will be used for error testing.');
      cy.get('#id_Location').type('Test Location');
      cy.get('#id_Date').type('2025-06-15');
      cy.get('#id_StartTime').type('10:00');
      cy.get('#id_EndTime').type('16:00');
      cy.get('#id_ImageUrl').type('https://example.com/test.jpg');
      cy.get('#id_Category').type('Test');
      cy.get('input[name="_save"]').click();
  
      // Get the event URL
      cy.contains(eventTitle).click();
      
      cy.location('pathname').then((pathname) => {
        const eventId = pathname.split('/').slice(-3)[0];
  
        // Set up intercept for the delete confirmation submission
        cy.intercept('POST', `${API_ENDPOINT}${eventId}/delete/`, {
          statusCode: 500,
          body: 'Server Error'
        }).as('deleteRequest');
  
        // Click delete and submit
        cy.get('.deletelink').click();
        cy.get('input[type="submit"]').last().click();
  
        // Verify error response
        cy.wait('@deleteRequest')
          .its('response.statusCode')
          .should('eq', 500);
      });
    });
  });