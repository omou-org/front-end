describe("No Results Search Page style ", () => {
    it("Goes to the no results page from search and checks if styles are correct", () => {
        cy.visitAuthenticated("noresults");
        cy.get('[data-cy=no-results-header]').should('have.css', 'padding-bottom', '20px');
        cy.get('[data-cy=schedulerLink]').should('have.css', 'borderBottom', '2px solid rgb(67, 181, 217)');
    });
});
