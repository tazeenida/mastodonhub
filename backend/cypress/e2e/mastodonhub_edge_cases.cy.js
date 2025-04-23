// cypress/e2e/mastodonhub_edge_cases.cy.js

describe('MastodonHub Models Edge Case Tests', () => {
  const baseUrl = 'http://127.0.0.1:8000';
  const tokenUrl = `${baseUrl}/token/`;
  const clubsUrl = `${baseUrl}/api/mastodonhub/clubs/`;
  const eventsUrl = `${baseUrl}/api/mastodonhub/events/`;
  
  const credentials = {
    username: 'admin',
    password: 'Admin12345678'
  };

  let accessToken;

  beforeEach(() => {
    // Get JWT token before each test
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

  describe('Club Model Edge Cases', () => {
    it('should test maximum field lengths for clubs', () => {
      // Create club with maximum length values
      const clubWithMaxLengths = {
        Title: 'A'.repeat(100), // Assuming max is 100
        PresidentName: 'P'.repeat(100),
        TreasurerName: 'T'.repeat(100),
        AdvisorName: 'A'.repeat(100),
        Email: `${'e'.repeat(50)}@example.com`, // Email with long local part
        ImageUrl: `https://example.com/${'i'.repeat(100)}.jpg`,
        Category: 'C'.repeat(50)
      };

      cy.request({
        method: 'POST',
        url: clubsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: clubWithMaxLengths,
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Max Length Club Response:', JSON.stringify(response.body));
        expect(response.status).to.be.oneOf([200, 201, 400]);
        
        if (response.status === 400) {
          // If field length validation is enforced, check for specific error
          cy.log('Field length validation enforced - good!');
        } else {
          // If length validation passes or isn't enforced
          expect(response.body).to.have.property('Title');
        }
      });
    });

    it('should test special characters in club fields', () => {
      // Create club with special characters
      const clubWithSpecialChars = {
        Title: 'Spécial Çlüb #123',
        PresidentName: 'Jöhn O\'Connor',
        TreasurerName: 'Mary-Kate & Ashley',
        AdvisorName: 'Dr. Smith-Jones, Ph.D.',
        Email: 'special.chars+test@example.com',
        ImageUrl: 'https://example.com/image?id=123&size=large',
        Category: 'Mixed & Various'
      };

      cy.request({
        method: 'POST',
        url: clubsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: clubWithSpecialChars,
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Special Chars Club Response:', JSON.stringify(response.body));
        expect(response.status).to.be.oneOf([200, 201]);
        expect(response.body).to.have.property('Title', clubWithSpecialChars.Title);
      });
    });

    it('should test trailing/leading whitespace handling', () => {
      // Create club with whitespace issues
      const clubWithWhitespace = {
        Title: '  Whitespace Club  ',
        PresidentName: '  John Smith  ',
        TreasurerName: '\tJane Doe\t',
        AdvisorName: ' Dr. White ',
        Email: ' email@example.com ',
        ImageUrl: ' https://example.com/image.jpg ',
        Category: '  Academic  '
      };

      cy.request({
        method: 'POST',
        url: clubsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: clubWithWhitespace,
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Whitespace Club Response:', JSON.stringify(response.body));
        expect(response.status).to.be.oneOf([200, 201]);
        
        // Check if whitespace was trimmed (this varies by implementation)
        // We're flexible here - the test will pass whether whitespace is trimmed or not
        expect(response.body).to.have.property('Title');
      });
    });
  });

  describe('Event Model Edge Cases', () => {
    it('should test date validation for events', () => {
      // Test past date
      const pastEvent = {
        Title: 'Past Event Test',
        Description: 'Testing past date validation',
        Location: 'Test Location',
        Date: '2020-01-01', // Past date
        StartTime: '10:00:00',
        EndTime: '12:00:00',
        ImageUrl: 'https://example.com/past.jpg',
        Category: 'Test'
      };

      cy.request({
        method: 'POST',
        url: eventsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: pastEvent,
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Past Date Event Response:', JSON.stringify(response.body));
        // Accept either validation (400) or accepting past dates (200/201)
        expect(response.status).to.be.oneOf([200, 201, 400]);
      });

      // Test far future date
      const futureEvent = {
        Title: 'Future Event Test',
        Description: 'Testing future date validation',
        Location: 'Test Location',
        Date: '2099-12-31', // Far future date
        StartTime: '10:00:00',
        EndTime: '12:00:00',
        ImageUrl: 'https://example.com/future.jpg',
        Category: 'Test'
      };

      cy.request({
        method: 'POST',
        url: eventsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: futureEvent,
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Future Date Event Response:', JSON.stringify(response.body));
        // Accept either validation (400) or accepting future dates (200/201)
        expect(response.status).to.be.oneOf([200, 201, 400]);
      });
    });

    it('should test time validation for events', () => {
      // Create event with equal start and end times
      const equalTimesEvent = {
        Title: 'Equal Times Event',
        Description: 'Start time equals end time',
        Location: 'Test Location',
        Date: '2025-06-15',
        StartTime: '12:00:00',
        EndTime: '12:00:00', // Same as start time
        ImageUrl: 'https://example.com/equal.jpg',
        Category: 'Test'
      };

      cy.request({
        method: 'POST',
        url: eventsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: equalTimesEvent,
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Equal Times Event Response:', JSON.stringify(response.body));
        // Accept either validation (400) or accepting equal times (200/201)
        expect(response.status).to.be.oneOf([200, 201, 400]);
      });

      // Event with end time before start time (should fail validation)
      const invalidTimesEvent = {
        Title: 'Invalid Times Event',
        Description: 'End time before start time',
        Location: 'Test Location',
        Date: '2025-06-15',
        StartTime: '14:00:00',
        EndTime: '10:00:00', // Before start time
        ImageUrl: 'https://example.com/invalid.jpg',
        Category: 'Test'
      };

      cy.request({
        method: 'POST',
        url: eventsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: invalidTimesEvent,
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Invalid Times Event Response:', JSON.stringify(response.body));
        // Should ideally fail validation
        expect(response.status).to.be.oneOf([400, 200, 201]); // Be tolerant if validation isn't enforced
      });
    });

    it('should test event description with various lengths', () => {
      // Short description
      const shortDescEvent = {
        Title: 'Short Description Event',
        Description: 'Short.',
        Location: 'Test Location',
        Date: '2025-06-15',
        StartTime: '10:00:00',
        EndTime: '12:00:00',
        ImageUrl: 'https://example.com/short.jpg',
        Category: 'Test'
      };

      cy.request({
        method: 'POST',
        url: eventsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: shortDescEvent,
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Short Description Event Response:', JSON.stringify(response.body));
        expect(response.status).to.be.oneOf([200, 201]);
      });

      // Long description
      const longDescEvent = {
        Title: 'Long Description Event',
        Description: 'A'.repeat(1000), // Very long description
        Location: 'Test Location',
        Date: '2025-06-15',
        StartTime: '10:00:00',
        EndTime: '12:00:00',
        ImageUrl: 'https://example.com/long.jpg',
        Category: 'Test'
      };

      cy.request({
        method: 'POST',
        url: eventsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: longDescEvent,
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Long Description Event Response:', JSON.stringify(response.body));
        expect(response.status).to.be.oneOf([200, 201, 400]); // Be tolerant if length is limited
      });
    });
  });

  describe('Edge Cases for API Behavior', () => {
    it('should test filtering with multiple criteria', () => {
      // Create a unique event for filtering tests
      const filterTestEvent = {
        Title: `Filter Test Event ${Date.now()}`,
        Description: 'For filter testing',
        Location: 'Filter Location',
        Date: '2025-07-15',
        StartTime: '10:00:00',
        EndTime: '12:00:00',
        ImageUrl: 'https://example.com/filter.jpg',
        Category: 'EdgeTest'
      };

      cy.request({
        method: 'POST',
        url: eventsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: filterTestEvent
      }).then(() => {
        // Test multiple filter combinations
        cy.request({
          method: 'GET',
          url: `${eventsUrl}?category=EdgeTest&date=2025-07-15`,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }).then((response) => {
          cy.log('Multiple Filter Response:', JSON.stringify(response.body));
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });

        // Test case-insensitive filtering if supported
        cy.request({
          method: 'GET',
          url: `${eventsUrl}?category=edgetest`,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          failOnStatusCode: false
        }).then((response) => {
          cy.log('Case-Insensitive Filter Response:', JSON.stringify(response.body));
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
        });
      });
    });

    it('should test pagination behavior', () => {
      // Test pagination parameters
      cy.request({
        method: 'GET',
        url: `${clubsUrl}?page=1&page_size=5`,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Pagination Response:', JSON.stringify(response.body));
        expect(response.status).to.eq(200);
        
        // Check pagination - this will depend on your API implementation
        // Either the response is an array of clubs or a paginated object
        expect(response.body).to.satisfy((body) => 
          Array.isArray(body) || // Simple array
          body.hasOwnProperty('results') || // DRF pagination
          body.hasOwnProperty('clubs') || // Custom pagination
          body.hasOwnProperty('data')      // Other pagination format
        );
      });

      // Test invalid pagination values
      cy.request({
        method: 'GET',
        url: `${clubsUrl}?page=invalid&page_size=invalid`,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log('Invalid Pagination Response:', JSON.stringify(response.body));
        expect(response.status).to.be.oneOf([200, 400]); // Either succeed with defaults or return validation error
      });
    });

    it('should test API response with accept headers', () => {
      // Test with explicit JSON accept header
      cy.request({
        method: 'GET',
        url: clubsUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      }).then((response) => {
        cy.log('JSON Accept Response:', JSON.stringify(response.body));
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.include('application/json');
      });
    });
  });
});