// describe('Admin creating an instructor', () => {
//     before(() => {
//         cy.visitAuthenticated('form/instructor');
//     });

//     it('Loads page properly', () => {
//         cy.get('[data-cy=nextButton]').should('be.disabled');
//     });

//     it('Fills out login and user information', () => {
//         cy.get('[data-cy=basicInfo-email-input]').fastType('casey@jones.com');
//         cy.get('[data-cy=basicInfo-firstName-input]').fastType('Casey');
//         cy.get('[data-cy=basicInfo-lastName-input]').fastType('Jones');
//         cy.get('[data-cy=basicInfo-gender-select]').click();
//         cy.get('[data-value=UNSPECIFIED]').click();
//         cy.get('[data-cy=basicInfo-address-input]').fastType(
//             '1273 main street'
//         );
//         cy.get('[data-cy=basicInfo-birthDate-input]').fastType('01/01/2000');
//         cy.get('[data-cy=basicInfo-city-input]').fastType('Oakland');
//         cy.get('[data-cy=basicInfo-phoneNumber]').fastType('1234567890');
//         cy.get('[data-cy=basicInfo-state]').fastType('CA');
//         cy.get('[data-cy="basicInfo.state-CA"]').click();
//         cy.get('[data-cy=nextButton]').click();
//     });

//     it('Fills out experience information', () => {
//         cy.get('[data-cy=experience-experience-input]').fastType(10);
//     });

//     // it("Submits form", () => {
//     //     // stubbing graphql isn't working
//     //     cy.server({"force404": true});
//     //     cy.route({
//     //         "method": "POST",
//     //         "status": 200,
//     //         "url": "/graphql",
//     //         "responseType": "application/json",
//     //     });
//     //     cy.get("[data-cy=submitButton]").click();
//     //     cy.contains("You've successfully submitted!");
//     // });
// });
