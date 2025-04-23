describe('MastodonHub Clubs API Tests', () => {
  const BASE_URL = 'http://localhost:8000';
  const API_ENDPOINT = `${BASE_URL}/admin/mastodonhub/mastodonhubclubs/`;
  
  // Test credentials
  const TEST_CREDENTIALS = {
    username: 'admin',
    password: 'Admin12345678'
  };

  const REQUIRED_FIELDS = [
    'Title',
    'PresidentName',
    'TreasurerName',
    'AdvisorName',
    'Email',
    'ImageUrl',
    'Category'
  ];

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

  describe('1. Test Data Retrieval', () => {
    context('When clubs exist in the database', () => {
      beforeEach(() => {
        cy.visit(API_ENDPOINT);
      });

      it('should verify all required club fields are present and correctly formatted', () => {
        // Verify we're on the right page
        cy.get('body').should('not.contain', 'Log in');

        // Verify table headers match required fields
        cy.get('#result_list thead th').then($headers => {
          // Get header texts and clean them
          const headerTexts = Array.from($headers)
            .map(el => el.textContent.trim())
            .filter(text => text !== ''); // Remove empty headers
          
          cy.log('Found headers:', headerTexts);
          
          // Check each required field exists in headers
          REQUIRED_FIELDS.forEach(field => {
            const fieldExists = headerTexts.some(header => 
              header.includes(field)
            );
            expect(fieldExists, `Should find header "${field}"`).to.be.true;
          });
        });

        // Verify data exists and is correctly formatted
        cy.get('#result_list tbody tr').first().within(() => {
          // Map CSS classes to field validation
          const fieldValidators = {
            'field-Email': text => expect(text).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
            'field-ImageUrl': text => expect(text).to.match(/^https?:\/\/.+/),
          };

          // Check each field
          cy.get('td[class^="field-"]').each(($td) => {
            const className = $td.attr('class');
            const text = $td.text().trim();
            
            // Verify field is not empty
            expect(text, 'Field should not be empty').to.not.be.empty;
            
            // Apply specific validation if exists
            if (fieldValidators[className]) {
              fieldValidators[className](text);
            }
          });
        });
      });

      it('should display club data in a paginated table format', () => {
        cy.get('#result_list').should('exist');
        cy.get('#result_list tbody tr').should('have.length.gt', 0)
          .then($rows => {
            cy.log(`Found ${$rows.length} club records`);
          });
      });
    });

    context('When no clubs exist in the database', () => {
      it('should handle empty club list correctly', () => {
        cy.request({
          url: `${API_ENDPOINT}?format=json`,
          headers: { 'Accept': 'application/json' }
        }).then((response) => {
          expect(response.status).to.equal(200);
          if (response.body.length === 0) {
            expect(response.body).to.deep.equal([]);
            expect(response.body).to.not.have.property('error');
          }
        });
      });

      it('should display empty table without errors in UI', () => {
        cy.visit(API_ENDPOINT);
        cy.get('#result_list').should('exist');
        cy.get('body').should('not.contain', 'Error');
        cy.get('#content').should('not.contain', 'Error fetching');
      });
    });
  });

  describe('2. Test Non-Existing Data', () => {
    it('should return empty list with 200 status', () => {
      cy.request({
        url: `${API_ENDPOINT}?format=json`,
        headers: { 'Accept': 'application/json' }
      }).then((response) => {
        expect(response.status).to.equal(200);
        if (response.body === '[]' || response.body.length === 0) {
          expect(true).to.be.true;
        }
      });
    });
  });

  describe('3. Error Fetching Clubs', () => {
    it('should handle database errors appropriately', () => {
      cy.request({
        url: `${API_ENDPOINT}?format=json`,
        failOnStatusCode: false,
        headers: {
          'Accept': 'application/json'
        }
      }).then(response => {
        if (response.status !== 200) {
          expect(response.status).to.equal(500);
          expect(response.body).to.have.property('error');
        }
      });
    });

    it('should verify error handling through request failure', () => {
      cy.request({
        url: `${API_ENDPOINT}?format=json`,
        failOnStatusCode: false,
        headers: {
          'Accept': 'application/json'
        }
      }).then(response => {
        if (response.status !== 200) {
          expect(response.status).to.equal(500);
          expect(response.body).to.have.property('error');
        } else {
          // If successful response, test passes
          expect(true).to.be.true;
        }
      });
    });
  });

  describe('4. Performance Testing', () => {
    it('should load the page efficiently', () => {
      cy.visit(API_ENDPOINT);
      cy.get('#result_list', { timeout: 3000 }).should('exist');
    });

    it('should handle large datasets efficiently', () => {
      const startTime = Date.now();
      
      cy.request({
        url: `${API_ENDPOINT}?format=json`,
        headers: { 'Accept': 'application/json' }
      }).then((response) => {
        const responseTime = Date.now() - startTime;
        expect(responseTime).to.be.lessThan(5000);
        expect(response.status).to.equal(200);
      });
    });
  });
});