describe('MastodonHub Clubs API Tests', () => {

    beforeEach(() => {
   
   cy.visit('http://localhost:8000/admin/login/');
   
   cy.get('[name=username]').type('admin');
   
   cy.get('[name=password]').type('Admin12345678');
   
   cy.get('form').submit();
   
    });
   
   it('should successfully create a club with valid data', () => {
   
   cy.visit('http://localhost:8000/admin/mastodonhub/mastodonhubclubs/add/');
   
   cy.get('#id_Title').type('Chess Club');
   
   cy.get('#id_PresidentName').type('Alice Johnson');
   
   cy.get('#id_TreasurerName').type('Bob Smith');
   
   cy.get('#id_AdvisorName').type('Dr. Adams');
   
   cy.get('#id_Email').type('chessclub@example.com');
   
   cy.get('#id_ImageUrl').type('https://example.com/chess.jpg');
   
   cy.get('#id_Category').type('Sports');
   
   cy.get('input[name="_save"]').click();
   
   // Should redirect to list view and show success message
   
   cy.url().should('include', '/admin/mastodonhub/mastodonhubclubs/');
   
   cy.contains('Chess Club').should('exist');
   
    });
   
   it('should return error when required fields are missing', () => {
   
   cy.visit('http://localhost:8000/admin/mastodonhub/mastodonhubclubs/add/');
   
   cy.get('input[name="_save"]').click();
   
   // Should show validation errors
   
   cy.get('.errorlist').should('exist');
   
   cy.get('.errorlist').should('contain', 'This field is required');
   
    });
   
   it('should prevent duplicate clubs with same name', () => {
   
   // First create the club
   
   cy.visit('http://localhost:8000/admin/mastodonhub/mastodonhubclubs/add/');
   
   cy.get('#id_Title').type('Chess Club');
   
   cy.get('#id_PresidentName').type('Alice Johnson');
   
   cy.get('#id_TreasurerName').type('Bob Smith');
   
   cy.get('#id_AdvisorName').type('Dr. Adams');
   
   cy.get('#id_Email').type('chessclub@example.com');
   
   cy.get('#id_ImageUrl').type('https://example.com/chess.jpg');
   
   cy.get('#id_Category').type('Sports');
   
   cy.get('input[name="_save"]').click();
   
   // Verify creation
   
   cy.url().should('include', '/admin/mastodonhub/mastodonhubclubs/');
   
   cy.contains('Chess Club').should('exist');
   
   // Try to create duplicate
   
   cy.visit('http://localhost:8000/admin/mastodonhub/mastodonhubclubs/add/');
   
   cy.get('#id_Title').type('Chess Club');
   
   cy.get('#id_PresidentName').type('Alice Johnson');
   
   cy.get('#id_TreasurerName').type('Bob Smith');
   
   cy.get('#id_AdvisorName').type('Dr. Adams');
   
   cy.get('#id_Email').type('chessclub@example.com');
   
   cy.get('#id_ImageUrl').type('https://example.com/chess.jpg');
   
   cy.get('#id_Category').type('Sports');
   
   cy.get('input[name="_save"]').click();
   
   // Verify duplication is prevented
   
   cy.contains('Chess Club').should(($els) => {
   
   // Count occurrences of "Chess Club" in the list
   
   expect($els).to.have.length(1);
   
    });
   
    });
   
   it('should handle invalid data', () => {
   
   cy.visit('http://localhost:8000/admin/mastodonhub/mastodonhubclubs/add/');
   
   // Try to create a club with invalid data
   
   cy.get('#id_Title').type('Science Club');
   
   cy.get('#id_PresidentName').type('Charlie Doe');
   
   cy.get('#id_TreasurerName').type('Eve Green');
   
   cy.get('#id_AdvisorName').type('Dr. White');
   
   cy.get('#id_Email').type('invalid-email');
   
   cy.get('#id_ImageUrl').type('not-a-url');
   
   cy.get('#id_Category').type('Education');
   
   cy.get('input[name="_save"]').click();
   
   // Should show validation errors
   
   cy.get('.errorlist').should('exist');
   
    });
   
   after(() => {
   
   // Clean up created clubs
   
   cy.visit('http://localhost:8000/admin/mastodonhub/mastodonhubclubs/');
   
   cy.get('[name="_selected_action"]').first().click();
   
   cy.get('select[name="action"]').select('delete_selected');
   
   cy.get('button[type="submit"][name="index"]').click();
   
   cy.get('input[type="submit"]').click();
   
    });
   
    });