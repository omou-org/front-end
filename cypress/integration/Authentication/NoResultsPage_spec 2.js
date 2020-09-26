describe("No Results Search Page style ", () => {
    it("Goes to the no results page from search and checks if styles are correct", () => {
        cy.visit('')
        cy.get('[data-cy=emailField]').type('maggie@summit.com');
        cy.get('[data-cy=signInButton').click();
        cy.get('[data-cy=passwordField]').type('password');
        cy.get('[data-cy=rememberMe ]').click();
        cy.get('[data-cy=signInButton]').click();
        cy.get('[data-cy=dashboard-greeting]').contains('Hello')
        cy.visit("noresults");
        cy.get('[data-cy=no-results-header]').should('have.css', 'padding-bottom', '20px');
        cy.get('[data-cy=schedulerLink]').should('have.css', 'borderBottom', '2px solid rgb(67, 181, 217)');
    });
});
