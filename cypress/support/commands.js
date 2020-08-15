import * as types from "../../src/actions/actionTypes";

const token = "e2c6fe2e04f5e658d179e051096aefc419f1212f";
const DEFAULT_USER = {
    "accountType": "ADMIN",
    "email": "maggie@summit.com",
    "phoneNumber": null,
    "token": "token",
    "user": {
        "email": "maggie@summit.com",
        "firstName": "Maggie",
        "id": 1,
        "lastName": "Huang",
    },
};

export const BASE_TEST_URL = "http://localhost:8000";

const responseStub = (result) => Promise.resolve({
    "json": () => Promise.resolve(result),
    "ok": result.hasOwnProperty("ok") ? result.ok : true,
    "text": () => Promise.resolve(JSON.stringify(result)),
});

const isStub = (wrappedMethod) =>
    wrappedMethod.restore && wrappedMethod.restore.sinon;

let originalFetch;

const getFetchStub = (win, {as, callsFake}) => {
    let stub = win.fetch;
    if (!isStub(win.fetch)) {
        originalFetch = win.fetch;
        stub = cy.stub(win, "fetch");
    }
    stub.as(as).callsFake(callsFake);
};

/** *
 * @description Stubs a graphQL request and tests variables
 * @param {Object} operationMocks Contains the desired tests and responses for
 * each operation, keyed by name
*/
Cypress.Commands.add("mockGraphQL", (operationMocks) => {
    const fetchGraphQL = (path, options, ...rest) => {
        const {body} = options;
        try {
            const {operationName, variables} = JSON.parse(body);
            if (operationMocks.hasOwnProperty(operationName)) {
                const {test, response} = operationMocks[operationName];
                if (typeof test === "function") {
                    test(variables);
                }
                if (response) {
                    return responseStub(response);
                }
            }
            return originalFetch(path, options, ...rest);
        } catch (err) {
            return responseStub(err);
        }
    };

    return cy.on("window:before:load", (win) => {
        getFetchStub(win, {
            "as": "fetchGraphQL",
            "callsFake": fetchGraphQL,
        });
    });
});

/** *
 * @description Visits a URL after authenticating
 * @param {String} url URL to visit
 * @param {Object} user Optional. Credentials for the logged in user
*/
Cypress.Commands.add("visitAuthenticated", (url, user) => {
    cy.visit(url);
    cy.window().its("store")
        .invoke("dispatch", {
            "payload": {
                ...DEFAULT_USER,
                ...user,
            },
            "type": types.SET_CREDENTIALS,
        });
});

/** *
 * @description: This command helps you log into Omou to work on any other test
 * @param {Object} user: Should take in the props "email" && "password"
 * @return: Getting past login screen and into the Scheduler component
*/
Cypress.Commands.add("signUpAdminAndLogin", (userType, options = {}) => {
    // setup some basic users
    const types = {
        "admin": `
        mutation CreateOwner {
              __typename
              createAdmin(adminType: OWNER,
                user: {
                  email: "b@starkindustries.com",
                  firstName: "Tony",
                  lastName: "Stark",
                  password: "Ironman3000!"
                },
                birthDate: "1970-05-29",
                address: "10880 Malibu Point",
                city: "Point Dume",
                gender: MALE,
                phoneNumber: "1234567890",
                state: "CA",
                zipcode: "90265") {
                admin {
                  address
                  adminType
                  user {
                    email
                    firstName
                    id
                    isStaff
                    isSuperuser
                    lastName
                    username
                    password
                  }
                }
              }
            }
        `,
        "receptionist": `
        mutation CreateReceptionist {
          createAdmin(
          adminType: RECEPTIONIST,
          user: {
            email: "pepper@starkindustries.com",
            firstName: "Pepper",
            lastName: "Potts",
            password: "Ironman3000!"
            },
            phoneNumber: "1234567890",
            state: "CA") {
            admin {
              address
              adminType
              user {
                email
                firstName
                id
                lastName
                username
                password
              }
            }
          }
        }
        `,
    };

    const user = types[userType];

    cy.request({
        "url": `${BASE_TEST_URL }/graphql`,
        "method": "POST",
        "body": {"query": user},
    })
        .its("body")
        .its("data")
        .then((mutation) => {
            const newUser = mutation.createAdmin.admin;

            const newUserLogins = `
                mutation Login($password: String!, $username: String!) {
                    tokenAuth(password: $password, username: $username) {
                        token
                        payload
                    }
                }
            `;

            cy.request({
                "url": `${BASE_TEST_URL }/graphql`,
                "method": "POST",
                "body": {
                    "query": newUserLogins,
                    "variables": {
                        "username": newUser.user.username,
                        "password": "Ironman3000!",
                    },
                },
            })
                .its("body")
                .its("data")
                .then((query) => {
                    // dispatch to redux/local storage
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
        });
});

/**
 * @description: logs in given a username and password
 * @param {string} username - an email
 * @param {string} password
 * */
Cypress.Commands.add("login", (username, password) => {
    const newUserLogins = `
                mutation Login($password: String!, $username: String!) {
                    tokenAuth(password: $password, username: $username) {
                        token
                        payload
                    }
                }
            `;

    cy.request({
        "url": `${BASE_TEST_URL }/graphql`,
        "method": "POST",
        "body": {
            "query": newUserLogins,
            "variables": {
                username,
                password,
            },
        },
    })
        .its("body")
        .its("data")
        .then((query) => {
            const {token} = query.tokenAuth;
            cy.request({
                "url": `${BASE_TEST_URL }/graphql`,
                "method": "POST",
                "headers": {"Authorization": `JWT ${token}`},
                "body": {
                    "query": `
                    query GetAccountType($username: String!) {
                        userInfo(userName: $username) {
                            ... on AdminType {
                                accountType
                                user {
                                    id
                                    firstName
                                    lastName
                                    email
                                }
                                phoneNumber
                            }
                        }
                    }
                    `,
                    "variables": {username},
                },
            }).its("body")
                .its("data")
                .then((userInfo) => {
                    localStorage.setItem("token", token);
                    const {accountType, user, phoneNumber} = userInfo.userInfo;
                    // dispatch to redux/local storage
                    cy
                        .window()
                        .its("store")
                        .invoke("dispatch", {
                            "type": types.SET_CREDENTIALS,
                            "payload": {
                                token,
                                "email": username,
                                accountType,
                                user,
                                phoneNumber,
                            },
                        });
                });
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
    cy.focused().type("{downarrow}{enter}", {"force": true});
});

/**
 * @description Types the specified text a bit faster than the default
 * @param {String} text Text to type
 */
Cypress.Commands.add(
    "fastType",
    {
        "prevSubject": true,
    },
    (subject, text) => cy.get(subject).type(text, {
        "delay": 0,
    }),
);
