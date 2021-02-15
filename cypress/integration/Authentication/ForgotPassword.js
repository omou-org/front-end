const EMAIL = 'maggie@summit.com';

describe('Forgot Password', () => {
    it('Loads login page', () => {
        cy.visit('');
        cy.get('[data-cy=signInButton');
    });
    //
    // it("Fills out email and submits", () => {
    //     cy.get("[data-cy=emailField-input]").fastType(EMAIL);
    //     cy.get("[data-cy=signInButton]").click();
    //     cy.get("[data-cy=forgotPassword]", {timeout: 3000}).should('be.visible');
    // });
    //
    // it("Goes to forgot password page", () => {
    //     cy.get("[data-cy=forgotPassword]").click();
    //     cy.url().should("be", "/forgotpassword");
    //     cy.get("[data-cy=reset]").should("be.disabled");
    // });
    //
    //
    // it(" Can return to login page", () => {
    //     cy.get("[data-cy=return]").click();
    //     cy.url().should("be", "/login");
    // });
});
