describe('Z:99Logout-spec', () => {
    it('Logout', function () {
        cy.visitAuthenticated('/');
        cy.get('.logout-icon').click();
        cy.contains('SIGN IN');
    });
});
