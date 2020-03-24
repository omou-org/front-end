// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --

/***
 * @description: This command helps you log into Omou to work on any other test
 * @param {Object} user: Should take in the props "email" && "password"
 * @return: Getting past login screen and into the Scheduler component
 */

Cypress.Commands.add("login", (user) => {
  cy.visit("http://localhost:3000/");
  cy.get(".email").type(user.email);
  cy.get(".password").type(user.password);
  cy.get('[type="checkbox"]').click();
  cy.get('[type="submit"]').click();
  cy.contains("Scheduler");
});

/***
 * @description: Finds a react-select dropdown when given the element and text to type
 * @param {string} element : This is the react-select element you want to test
 * @param {string} text  : If you want to type anything inside the react-select
 * @return: finds the text and selects it
 */

Cypress.Commands.add("findDropdown", (element, text) => {
  cy.get(element).type(text || "");
  cy.focused().type("{downarrow}{enter}", { force: true });
});

/***
 * @description: After the user as logged in, this will go to the registration tab and set the registering parent
 * @param {string} parentName : This is the name of the parent you want to search for
 * @return: this will set the registering parent
 */

Cypress.Commands.add("setRegisteringParent", (parentName) => {
  cy.contains("Registration").click();
  cy.contains("SET PARENT").click();
  cy.get(".select-parent-search__control").type(parentName);
  cy.focused().type("{downarrow}{enter}", { force: true });
  cy.get(".MuiDialogActions-root-493 > .MuiButtonBase-root-242").click();
});

/***
 * @description: This will exit out of the current registering parent
 */

Cypress.Commands.add("exitRegisteringParent", () => {
  cy.contains("Registration").click();
  cy.get(":nth-child(3) > .MuiButtonBase-root-242").click();
  cy.get(".exit-parent").click();
});

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
