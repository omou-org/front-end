const EMAIL = 'maggie@summit.com';

describe('Forgot Password', () => {
    it('Loads login page', () => {
        cy.visit('');
        cy.get('[data-cy=signInButton');
    });

    it('Goes to forgot password page', () => {
        cy.get('[data-cy=forgotPassword]').click();
        cy.url().should('be', '/forgotpassword');
        cy.get('[data-cy=reset]').should('be.disabled');
    });

    it('Fills out email and submits', () => {
        cy.get('[data-cy=emailField]').fastType(EMAIL);
        cy.get('[data-cy=reset]').click();
    });

    it('Can return to login page', () => {
        cy.get('[data-cy=return]').click();
        cy.url().should('be', '/login');
    });
});
