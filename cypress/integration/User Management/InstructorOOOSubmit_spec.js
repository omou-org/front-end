let moment = require('moment');
describe("Fills out instructor OOO form", () => {
    before(() => {
        cy.mockGraphQL({
            "CreateInstructorOOO": {
                "response": {
                    "data": {
                        "createInstructorOoo": {
                            "__typename": "InstructorOutOfOfficeType",
                            instructor: {
                                "description": "Hello World",
                                "endDatetime": Cypress.moment().format(),
                                "instructorId": "6",
                                "startDatetime": Cypress.moment().format(),
                            }
                        },
                    },
                },
                "test": (variables) => {
                    console.log(variables)
                },
            },
            "instructorOoo": {
                "response": {
                    "data": {
                        "parent": {

                        },
                    },
                },
                "test": ({ id }) => {
                    console.log(id)
                },
            },
        });

        cy.visitAuthenticated(`/availability`, { "accountType": "INSTRUCTOR", "email": "danielhuang@blah.com", "token": "token", "phoneNumber": null });

    });

    it("Loads data properly", () => {
        cy.fixture("users.json").then(({ parent }) => {
            cy.get("[data-cy=parent-firstName-input]")
                .should("have.value", parent.user.firstName);
            cy.get("[data-cy=parent-address-input]")
                .should("have.value", parent.address);
            cy.get("[data-cy=parent-phoneNumber-input]").should("have.value", "");
            cy.get("[data-cy=submitButton]").should("be.enabled");
        });
    });

    it("Can enter data properly", () => {
        cy.fixture("users.json").then(({ parent }) => {
            cy.get("[data-cy=parent-phoneNumber-input]").fastType("0");
            cy.get("[data-cy=submitButton]").should("be.disabled");
            cy.get("[data-cy=parent-phoneNumber-input]").clear();
            cy.get("[data-cy=parent-phoneNumber-input]").fastType(parent.phoneNumber);
            cy.get("[data-cy=submitButton]").should("be.enabled");
        });
    });

    it("Properly submits", () => {
        cy.fixture("users.json").then(({ parent }) => {
            cy.get("[data-cy=submitButton]").click();
            cy.contains("submitted");
            cy.contains(parent.phoneNumber);
        });
    });
});
