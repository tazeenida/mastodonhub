// cypress/e2e/signup.cy.js

describe('Signup and Logout API Tests', () => {
  // Configuration
  const baseUrl = Cypress.config('baseUrl') || 'http://127.0.0.1:8000';
  const tokenUrl = `${baseUrl}/token/`;
  const logoutUrl = `${baseUrl}/admin/logout/`;
  const clubsUrl = `${baseUrl}/api/mastodonhub/clubs/`;
  const adminLoginUrl = `${baseUrl}/admin/login/`;

  const credentials = {
    username: 'admin',
    password: 'Admin12345678'
  };

  // Define valid club data based on API requirements
  const validClubData = {
    Title: 'Test Club',
    PresidentName: 'John Doe',
    TreasurerName: 'Jane Smith',
    AdvisorName: 'Dr. Robert Johnson',
    Email: 'testclub@example.com',
    ImageUrl: 'https://example.com/club-image.jpg',
    Category: 'Academic'
  };

  let accessToken;

  beforeEach(() => {
    // Check API availability and get token
    cy.request({
      method: 'GET',
      url: clubsUrl,
      failOnStatusCode: false
    }).then((healthResponse) => {
      expect(healthResponse.status).to.eq(200);
      
      // Get JWT token
      cy.request({
        method: 'POST',
        url: tokenUrl,
        body: credentials,
        failOnStatusCode: false
      }).then((loginResponse) => {
        expect(loginResponse.status).to.eq(200);
        expect(loginResponse.body).to.have.property('access');
        accessToken = loginResponse.body.access;
      });
    });
  });

  it('should log validation requirements', () => {
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
      cy.log('Validation Response:', JSON.stringify(response.body, null, 2));
    });
  });

  it('should show validation errors for missing fields', () => {
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
      cy.log('Validation errors:', response.body);
    });
  });

  it('should successfully create a club with valid data', () => {
    cy.request({
      method: 'POST',
      url: clubsUrl,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: validClubData,
      failOnStatusCode: false
    }).then((response) => {
      // Log the complete response for debugging
      cy.log('Club Creation Response:', JSON.stringify(response.body, null, 2));
      
      if (response.status === 400) {
        throw new Error(`Validation failed: ${JSON.stringify(response.body)}`);
      }
      
      expect(response.status).to.be.oneOf([200, 201]);
      expect(response.body).to.have.property('Title', validClubData.Title);
      expect(response.body).to.have.property('Email', validClubData.Email);
    });
  });

  it('should follow admin logout flow', () => {
    cy.visit(adminLoginUrl);
    cy.get('input[name="username"]').type(credentials.username);
    cy.get('input[name="password"]').type(credentials.password);
    cy.get('input[type="submit"]').click();

    cy.getCookie('csrftoken').then((cookie) => {
      expect(cookie).to.exist;
      
      cy.request({
        method: 'POST',
        url: logoutUrl,
        headers: {
          'X-CSRFToken': cookie.value
        },
        failOnStatusCode: false
      }).then((logoutResponse) => {
        expect(logoutResponse.status).to.eq(200);
      });
    });
  });

  it('should handle invalid tokens for protected operations', () => {
    cy.request({
      method: 'POST',
      url: clubsUrl,
      headers: {
        'Authorization': 'Bearer invalid_token'
      },
      body: validClubData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('detail');
    });
  });

  it('should allow login after logout', () => {
    cy.visit(adminLoginUrl);
    cy.get('input[name="username"]').type(credentials.username);
    cy.get('input[name="password"]').type(credentials.password);
    cy.get('input[type="submit"]').click();

    cy.getCookie('csrftoken').then((cookie) => {
      cy.request({
        method: 'POST',
        url: logoutUrl,
        headers: {
          'X-CSRFToken': cookie.value
        },
        failOnStatusCode: false
      }).then(() => {
        cy.request({
          method: 'POST',
          url: tokenUrl,
          body: credentials,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('access');

          const newToken = response.body.access;
          cy.request({
            method: 'POST',
            url: clubsUrl,
            headers: {
              'Authorization': `Bearer ${newToken}`
            },
            body: validClubData,
            failOnStatusCode: false
          }).then((createResponse) => {
            expect(createResponse.status).to.be.oneOf([200, 201]);
            expect(createResponse.body).to.have.property('Title', validClubData.Title);
            expect(createResponse.body).to.have.property('Email', validClubData.Email);
          });
        });
      });
    });
  });
});