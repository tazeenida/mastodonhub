// cypress/e2e/logout.cy.js

describe('Logout API Endpoint Tests', () => {
    const baseUrl = 'http://127.0.0.1:8000';
    const adminLoginUrl = `${baseUrl}/admin/login/`;
    const adminLogoutUrl = `${baseUrl}/admin/logout/`;
    const tokenUrl = `${baseUrl}/token/`;
    const clubsUrl = `${baseUrl}/api/mastodonhub/clubs/`;
    
    const credentials = {
      username: 'admin',
      password: 'Admin12345678'
    };
  
    let accessToken;
  
    beforeEach(() => {
      // Get JWT token for API access
      cy.request({
        method: 'POST',
        url: tokenUrl,
        body: credentials,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        accessToken = response.body.access;
      });
    });
  
    it('should successfully access protected endpoint with token', () => {
      cy.request({
        method: 'GET',
        url: clubsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  
    it('should handle token invalidation through admin logout', () => {
      // First verify API access
      cy.request({
        method: 'GET',
        url: clubsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        
        // Perform admin logout to invalidate session
        cy.visit(adminLoginUrl);
        cy.get('input[name="username"]').type(credentials.username);
        cy.get('input[name="password"]').type(credentials.password);
        cy.get('input[type="submit"]').click();
        
        cy.getCookie('csrftoken').then((cookie) => {
          cy.request({
            method: 'POST',
            url: adminLogoutUrl,
            headers: {
              'X-CSRFToken': cookie.value
            }
          }).then((logoutResponse) => {
            expect(logoutResponse.status).to.eq(200);
          });
        });
      });
    });
  
    it('should return 401 when using invalid token', () => {
      cy.request({
        method: 'GET',
        url: clubsUrl,
        headers: {
          'Authorization': 'Bearer invalid_token'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.have.property('detail', 'Given token not valid for any token type');
      });
    });
  
    it('should allow getting new token after previous use', () => {
      // Get new token
      cy.request({
        method: 'POST',
        url: tokenUrl,
        body: credentials,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('access');
        
        // Verify new token works
        const newToken = response.body.access;
        cy.request({
          method: 'GET',
          url: clubsUrl,
          headers: {
            'Authorization': `Bearer ${newToken}`
          },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  
    // Let's check what fields are required for club creation
    it('should show validation errors for invalid club data', () => {
      cy.request({
        method: 'POST',
        url: clubsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
        // Log the error response to see what fields are required
        cy.log('Validation errors:', response.body);
      });
    });
  });