const token = "e2c6fe2e04f5e658d179e051096aefc419f1212f";
const userDetails = {
    "email": "maggie@summit.com",
    "first_name": "Maggie",
    "id": 1,
    "is_staff": true,
    "last_name": "Huang",
};

/** *
 * @description: This command helps you log into Omou to work on any other test
 * @param {Object} user: Should take in the props "email" && "password"
 * @return: Getting past login screen and into the Scheduler component
*/
Cypress.Commands.add("login", () => {
    cy.server();
    cy.route({
        "method": "POST",
        "response": {
            token,
        },
        "responseType": "application/json",
        "status": 200,
        "url": "/auth_token/",
        "withCredentials": true,
    });
    cy.route({
        "method": "GET",
        "response": userDetails,
        "responseType": "application/json",
        "status": 200,
        "url": "/account/user/",
        "withCredentials": true,
    });
    cy
        .window()
        .its("store")
        .invoke("dispatch", {
            "type": "LOGIN_SUCCESSFUL",
            "payload": {
                "response": {
                    "data": {token},
                },
                "savePassword": true,
            },
        });
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
