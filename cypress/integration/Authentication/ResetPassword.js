const EMAIL = 'maggie@summit.com';

describe('Forgot Password', () => {
    before(() => {
        cy.visit('/resetpassword');
    });

    it('Can return to the login page', () => {
        cy.get('[data-cy=return]').click();
        cy.url().should('be', '/login');
        cy.visit('/resetpassword');
    });

    it('Fills out password and submits', () => {
        cy.get('[data-cy=passwordField]').fastType(EMAIL);
        cy.get('[data-cy=reset]').click();
    });

    it('Returns to login page', () => {
        cy.get('[data-cy=return]').click();
        cy.url().should('be', '/login');
    });
});
