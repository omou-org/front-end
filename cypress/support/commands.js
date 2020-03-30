/** *
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

/** *
 * @description: Finds a react-select dropdown when given the element and text to type
 * @param {string} element This is the react-select element you want to test
 * @param {string} text If you want to type anything inside the react-select
 * @return: finds the text and selects it
 */
Cypress.Commands.add("findDropdown", (element, text) => {
    cy.get(element).type(text || "");
    cy.focused().type("{downarrow}{enter}", {force: true});
});

/**
 * @description Types the specified text a bit faster than the default
 * @param {String} text Text to type
 */
Cypress.Commands.add(
    "fastType",
    {
        prevSubject: true,
    },
    (subject, text) =>
        cy.get(subject).type(text, {
            delay: 0,
        })
);

/***
 * @description: After the user as logged in, this will go to the registration tab and set the registering parent
 * @param {string} parentName : This is the name of the parent you want to search for
 * @return: this will set the registering parent
 */

Cypress.Commands.add("setRegisteringParent", (parentName) => {
    cy.visit("/registration");
    cy.get("[data-cy=parent-btn]").click();
    cy.get(".select-parent-search__control").type(parentName);
    cy.focused().type("{downarrow}{enter}", {force: true});
    cy.get("[data-cy=set-parent-btn]").click();
});

/***
 * @description: This will exit out of the current registering parent
 */

Cypress.Commands.add("exitRegisteringParent", () => {
    cy.visit("/registration");
    cy.get("[data-cy=parent-btn]").click();
    cy.get("[data-cy=exit-parent-btn]").click();
});