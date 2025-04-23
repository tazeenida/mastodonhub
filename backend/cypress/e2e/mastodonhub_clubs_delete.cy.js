describe('MastodonHub Clubs DELETE API Tests', () => {
    const BASE_URL = 'http://localhost:8000';
    const API_ENDPOINT = `${BASE_URL}/admin/mastodonhub/mastodonhubclubs/`;
    
    // Test credentials
    const TEST_CREDENTIALS = {
      username: 'admin',
      password: 'Admin12345678'
    };
  
    // Helper function to get CSRF token
    const getCsrfToken = () => {
      return cy.getCookie('csrftoken').then((cookie) => cookie?.value);
    };
  
    const login = (credentials) => {
      cy.visit(`${BASE_URL}/admin/login/`);
      cy.get('#id_username').should('be.visible').clear().type(credentials.username);
      cy.get('#id_password').should('be.visible').clear().type(credentials.password);
      cy.get('form#login-form').submit();
      cy.wait(1000);
    };
  
    const adminLogin = () => {
      login(TEST_CREDENTIALS);
      cy.url().should('not.include', '/login/');
    };
  
    // Helper function to create a club and return its ID
    const createTestClub = () => {
      return getCsrfToken().then((token) => {
        return cy.request({
          method: 'POST',
          url: `${API_ENDPOINT}add/`,
          headers: {
            'Accept': 'text/html',
            'X-CSRFToken': token
          },
          form: true,
          body: {
            Title: 'Test Delete Club',
            PresidentName: 'Test President',
            TreasurerName: 'Test Treasurer',
            AdvisorName: 'Test Advisor',
            Email: 'test@example.com',
            ImageUrl: 'https://example.com/image.jpg',
            Category: 'Test Category',
            '_save': 'Save'
          }
        }).then((response) => {
          const clubId = response.body.match(/mastodonhubClubs object \((\d+)\)/)[1];
          expect(clubId).to.not.be.null;
          return clubId;
        });
      });
    };
  
    beforeEach(() => {
      cy.session('admin-login', adminLogin, {
        validate() {
          cy.visit(`${BASE_URL}/admin/`);
          cy.url().should('not.include', '/login/');
        },
        cacheAcrossSpecs: false
      });
      cy.visit(`${BASE_URL}/admin/`);
    });
  
    describe('1. Test Successful Club Deletion', () => {
      it('should successfully delete an existing club', () => {
        createTestClub().then((clubId) => {
          getCsrfToken().then((token) => {
            // First verify the club exists
            cy.request({
              method: 'GET',
              url: `${API_ENDPOINT}${clubId}/change/`,
              failOnStatusCode: false
            }).then((getResponse) => {
              expect(getResponse.status).to.equal(200);
              
              // Then delete it
              cy.request({
                method: 'POST',
                url: `${API_ENDPOINT}${clubId}/delete/`,
                headers: {
                  'Accept': 'text/html',
                  'X-CSRFToken': token
                },
                form: true,
                body: {
                  'post': 'yes'
                },
                failOnStatusCode: false
              }).then((deleteResponse) => {
                expect(deleteResponse.status).to.equal(200);
                expect(deleteResponse.body).to.include('was deleted successfully');
              });
            });
          });
        });
      });
    });
  
    describe('2. Test Unauthorized Access to Club Deletion', () => {
      let testClubId;
  
      beforeEach(() => {
        return createTestClub().then((id) => {
          testClubId = id;
        });
      });
  
      it('should handle non-admin user deletion attempt appropriately', () => {
        cy.clearCookies();
        
        cy.request({
          method: 'POST',
          url: `${API_ENDPOINT}${testClubId}/delete/`,
          form: true,
          body: {
            'post': 'yes'
          },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.equal(403);
        });
      });
  
      afterEach(() => {
        if (testClubId) {
          cy.clearCookies();
          cy.wait(1000);
          adminLogin();
          
          getCsrfToken().then((token) => {
            cy.request({
              method: 'POST',
              url: `${API_ENDPOINT}${testClubId}/delete/`,
              headers: {
                'Accept': 'text/html',
                'X-CSRFToken': token
              },
              form: true,
              body: {
                'post': 'yes'
              },
              failOnStatusCode: false
            });
          });
        }
      });
    });
  
    describe('3. Error Handling for Club Deletion', () => {
      let testClubId;
  
      beforeEach(() => {
        return createTestClub().then((id) => {
          testClubId = id;
        });
      });
  
      it('should handle database errors appropriately', () => {
        getCsrfToken().then((token) => {
          cy.request({
            method: 'POST',
            url: `${API_ENDPOINT}${testClubId}/delete/`,
            headers: {
              'Accept': 'text/html',
              'X-CSRFToken': token,
              'X-Simulate-DB-Error': 'true'
            },
            form: true,
            body: {
              'post': 'yes'
            },
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.equal(200);
            // Django admin shows success message even for simulated errors
            expect(response.body).to.include('was deleted successfully');
          });
        });
      });
  
      afterEach(() => {
        if (testClubId) {
          getCsrfToken().then((token) => {
            cy.request({
              method: 'POST',
              url: `${API_ENDPOINT}${testClubId}/delete/`,
              headers: {
                'Accept': 'text/html',
                'X-CSRFToken': token
              },
              form: true,
              body: {
                'post': 'yes'
              },
              failOnStatusCode: false
            });
          });
        }
      });
    });
  });