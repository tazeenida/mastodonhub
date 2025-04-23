describe('MastodonHub Events API POST Tests', () => {
    beforeEach(() => {
      // Log in to Django admin
      cy.visit('http://localhost:8000/admin/login/');
      cy.get('[name=username]').type('admin');
      cy.get('[name=password]').type('Admin12345678');
      cy.get('form').submit();
  
      // Ensure login was successful before proceeding
      cy.url().should('include', '/admin/');
    });
  
    it('should successfully create an event with valid data', () => {
      cy.visit('http://localhost:8000/admin/mastodonhub/mastodonhubevents/add/');
  
      // Fill in the event form
      cy.get('#id_Title').type('Tech Conference 2025');
      cy.get('#id_Description').type('A conference about the latest trends in technology.');
      cy.get('#id_Location').type('New York Convention Center');
      cy.get('#id_Date').type('2025-06-15');
      cy.get('#id_StartTime').type('10:00');
      cy.get('#id_EndTime').type('16:00');
      cy.get('#id_ImageUrl').type('https://example.com/event.jpg');
      cy.get('#id_Category').type('Technology');
  
      // Save the event
      cy.get('input[name="_save"]').click();
  
      // Ensure event creation success message appears
      cy.get('.success', { timeout: 10000 }).should('exist');
  
      // Verify event appears in the list
      cy.contains('Tech Conference 2025', { timeout: 10000 }).should('exist');
    });
  
    it('should return error when required fields are missing', () => {
      cy.visit('http://localhost:8000/admin/mastodonhub/mastodonhubevents/add/');
  
      // Attempt to save without filling in required fields
      cy.get('input[name="_save"]').click();
  
      // Verify validation errors
      cy.get('.errorlist').should('exist');
      cy.get('.errorlist').should('contain', 'This field is required');
    });
  });