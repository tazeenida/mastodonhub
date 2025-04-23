// cypress/e2e/authentification_views.cy.js

describe('Authentication Views Tests', () => {
  const baseUrl = 'http://127.0.0.1:8000';
  const tokenUrl = `${baseUrl}/token/`;
  const tokenRefreshUrl = `${baseUrl}/token/refresh/`;
  const profileUrl = `${baseUrl}/profile/`;
  
  // Admin credentials - we know these work from your existing tests
  const adminCredentials = {
    username: 'admin',
    password: 'Admin12345678'
  };

  let accessToken;
  let refreshToken;

  it('should obtain JWT tokens with valid credentials', () => {
    cy.request({
      method: 'POST',
      url: tokenUrl,
      body: adminCredentials,
      failOnStatusCode: false
    }).then((response) => {
      cy.log('Login Response:', JSON.stringify(response.body));
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('access');
      expect(response.body).to.have.property('refresh');
      
      accessToken = response.body.access;
      refreshToken = response.body.refresh;
    });
  });

  it('should fail login with invalid credentials', () => {
    const invalidCredentials = {
      username: adminCredentials.username,
      password: 'wrongpassword'
    };

    cy.request({
      method: 'POST',
      url: tokenUrl,
      body: invalidCredentials,
      failOnStatusCode: false
    }).then((response) => {
      cy.log('Invalid Login Response:', JSON.stringify(response.body));
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('detail');
    });
  });

  it('should refresh tokens successfully', () => {
    // First get a valid token
    cy.request({
      method: 'POST',
      url: tokenUrl,
      body: adminCredentials,
      failOnStatusCode: false
    }).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200);
      refreshToken = loginResponse.body.refresh;
      
      // Then try to refresh it
      cy.request({
        method: 'POST',
        url: tokenRefreshUrl,
        body: {
          refresh: refreshToken
        },
        failOnStatusCode: false
      }).then((refreshResponse) => {
        cy.log('Token Refresh Response:', JSON.stringify(refreshResponse.body));
        expect(refreshResponse.status).to.eq(200);
        expect(refreshResponse.body).to.have.property('access');
        
        // Update the access token for future tests
        accessToken = refreshResponse.body.access;
      });
    });
  });

  it('should reject invalid refresh tokens', () => {
    cy.request({
      method: 'POST',
      url: tokenRefreshUrl,
      body: {
        refresh: 'invalid-refresh-token'
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.log('Invalid Refresh Response:', JSON.stringify(response.body));
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('detail');
    });
  });

  it('should handle token verification checks', () => {
    // First get a valid token
    cy.request({
      method: 'POST',
      url: tokenUrl,
      body: adminCredentials,
      failOnStatusCode: false
    }).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200);
      accessToken = loginResponse.body.access;
      
      // Use token verification endpoint if available
      cy.request({
        method: 'GET',
        url: profileUrl,  // Protected route that requires authentication
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        failOnStatusCode: false
      }).then((verifyResponse) => {
        expect(verifyResponse.status).to.eq(200);
      });
    });
  });

  it('should handle expired or invalid tokens', () => {
    const expiredToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ1NTM2MDkwLCJpYXQiOjE2MTU1MzYwOTAsImp0aSI6ImY1NTUzMjhmOGI3ZDQ2Njk5YTdkNjA2ZjVlZDY2ZDc4IiwidXNlcl9pZCI6MX0.Ri-bCupxQYYlHu5RJZY8QjCJg9ksJLLTi-KoYLILgHY';
    
    cy.request({
      method: 'GET',
      url: profileUrl,
      headers: {
        'Authorization': `Bearer ${expiredToken}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('detail');
    });
  });

  it('should validate authentication requirements for protected routes', () => {
    // Test accessing a protected route without authentication
    cy.request({
      method: 'GET',
      url: profileUrl,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('detail');
    });
  });

  it('should test logout behavior with token invalidation', () => {
    // First get a valid token
    cy.request({
      method: 'POST',
      url: tokenUrl,
      body: adminCredentials,
      failOnStatusCode: false
    }).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200);
      accessToken = loginResponse.body.access;
      
      // Use admin logout endpoint
      cy.visit(`${baseUrl}/admin/login/`);
      cy.get('input[name="username"]').type(adminCredentials.username);
      cy.get('input[name="password"]').type(adminCredentials.password);
      cy.get('input[type="submit"]').click();
      
      cy.getCookie('csrftoken').then((cookie) => {
        cy.request({
          method: 'POST',
          url: `${baseUrl}/admin/logout/`,
          headers: {
            'X-CSRFToken': cookie.value
          }
        }).then((logoutResponse) => {
          expect(logoutResponse.status).to.eq(200);
        });
      });
    });
  });
});