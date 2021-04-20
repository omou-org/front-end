// describe('Submit an instructor OOO', () => {
//     before(() => {
//         cy.mockGraphQL({
//             getInstructorOOO: {
//                 response: {
//                     data: {
//                         instructorOoo: [
//                             {
//                                 __typename: 'InstructorOutOfOfficeType',
//                                 id: '2',
//                                 description: 'Hello World',
//                                 endDatetime: Cypress.moment().format(),
//                                 startDatetime: Cypress.moment().format(),
//                             },
//                         ],
//                     },
//                 },
//                 test: (variable) => {
//                     console.log(variable);
//                 },
//             },

//             CreateInstructorOOO: {
//                 response: {
//                     data: {
//                         createInstructorOoo: {
//                             __typename: 'InstructorOutOfOfficeType',
//                             instructor: {
//                                 description: 'Hello World',
//                                 endDatetime: Cypress.moment().format(),
//                                 instructorId: '2',
//                                 startDatetime: Cypress.moment().format(),
//                             },
//                         },
//                     },
//                 },
//                 test: (variables) => {
//                     console.log(variables);
//                 },
//             },
//         });
//         cy.visitAuthenticated(`/availability`, {
//             accountType: 'INSTRUCTOR',
//             user: {
//                 id: 2,
//                 firstName: 'Daniel',
//                 lastName: 'huang',
//                 email: 'danielhuang@blah.com',
//             },
//         });
//     });

//     it('Goes to intructor OOO tab', () => {
//         cy.get('[data-cy=request-OOO-tab]').click();
//         cy.get('[data-cy=submit-OOO-text]').contains('Submit');
//     });

//     it('Test inputs and clear form', () => {
//         cy.get('[data-cy=start-time-picker-OOO]').type('06:30 AM');
//         cy.get('[data-cy=end-time-picker-OOO]').type('10:00 AM');
//         cy.get('[data-cy=out-all-day-checkbox]').click();
//         cy.get('[data-cy=instructor-OOO-description-input]').type(
//             'This is a test'
//         );
//         cy.get('[data-cy=clear-OOO-button]').click();
//         cy.get('[data-cy=start-time-picker-OOO]').should('have.value', '');
//         cy.get('[data-cy=end-time-picker-OOO]').should('have.value', '');
//         cy.get('[data-cy=instructor-OOO-description-input]').should(
//             'have.value',
//             ''
//         );
//     });
// });
