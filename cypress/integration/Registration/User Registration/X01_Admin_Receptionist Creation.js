describe('Creates receptionist', () => {
    before(() => {
        cy.visitAuthenticated('form/admin');
    });

    it('Loads page properly', () => {
        cy.get('[data-cy=nextButton]').should('be.disabled');
    });

    it('Fills out login information', () => {
        cy.get('[data-cy=login-email-input]').fastType(
            'daaaaaaaaaaaaaaaaaaaaaan@gmail.com'
        );
        cy.get('[data-cy=login-password-input]').fastType('password');
        cy.get('[data-cy=login-firstName-input]').fastType('dan');
        cy.get('[data-cy=login-lastName-input]').fastType('han');
        cy.get('[data-cy=nextButton]').click();
    });

    it('Fills out user information', () => {
        cy.get('[data-cy=user-adminType-select]').click();
        cy.get('[data-value=RECEPTIONIST]').click();
        cy.get('[data-cy=user-gender-select]').click();
        cy.get('[data-value=UNSPECIFIED]').click();
        cy.get('[data-cy=user-address-input]').fastType('1273 main street');
        cy.get('[data-cy=user-birthDate-input]').fastType('01/01/2000');
        cy.get('[data-cy=user-city-input]').fastType('Oakland');
        cy.get('[data-cy=user-phoneNumber]').fastType('1234567890');
        cy.get('[data-cy=user-state]').fastType('CA');
        cy.get('[data-cy="user.state-CA"]').click();
        cy.get('[data-cy=user-zipcode-input]').fastType(94566);
    });

    // it("Submits form", () => {
    //     // stubbing graphql isn't working
    //     cy.server({"force404": true});
    //     cy.route({
    //         "method": "POST",
    //         "status": 200,
    //         "url": "/graphql",
    //         "responseType": "application/json",
    //     });
    //     cy.get("[data-cy=submitButton]").click();
    //     cy.get("Confirmation");
    // });
});
