describe("Fills out form", () => {
    before(() => {
        cy.fixture("users.json").then(({ receptionist }) => {
            cy.mockGraphQL({
                "CreateAdmin": {
                    "response": {
                        "data": {
                            "createAdmin": {
                                "created": false,
                            },
                        },
                    },
                    "test": (variables) => {
                        Object.entries(variables).forEach(([key, value]) => {
                            if (!["phoneNumber", "id", "user", "password"].includes(key)) {
                                expect(receptionist[key] || receptionist?.user[key]).equals(value);
                            }
                        });
                    },
                },
                "GetAdmin": {
                    "response": {
                        "data": {
                            "admin": {
                                ...receptionist,
                                "password": null,
                            },
                        },
                    },
                    "test": ({ userID }) => {
                        expect(userID).equals(receptionist.user.id.toString(), "Check ID passed");
                    },
                },
            });
            cy.visitAuthenticated(`/form/admin/${receptionist.user.id}`);
        });
    });

    it("Loads data properly for first form", () => {
        cy.fixture("users.json").then(({ receptionist }) => {
            cy.get("[data-cy=login-firstName-input]")
                .should("have.value", receptionist.user.firstName);
            cy.get("[data-cy=login-lastName-input]")
                .should("have.value", receptionist.user.lastName);
            cy.get("[data-cy=login-email-input]")
                .should("have.value", receptionist.user.email);
            cy.get("[data-cy=login-nextButton]")
                .should("be.disabled");
        });
    });

    it("Can enter data properly for first form", () => {
        cy.fixture("users.json").then(({ receptionist }) => {
            cy.get("[data-cy=login-firstName-input]")
                .clear()
            cy.get("[data-cy=login-firstName-input]")
                .fastType("0");
            cy.get("[data-cy=login-nextButton]")
                .should("be.disabled");
            cy.get("[data-cy=login-firstName-input]")
                .clear();
            cy.get("[data-cy=login-firstName-input]")
                .fastType(receptionist.user.firstName);
            cy.get("[data-cy=login-nextButton]")
                .should("be.disabled");
            cy.get("[data-cy=login-password-input]")
                .should("be.empty")
                .fastType(0)
                .clear()
                .fastType("test1234")
                .should("have.value", "test1234");
            cy.get("[data-cy=login-nextButton")
                .should("be.enabled")
                .click();
        });
    });

    it("Loads data properly for second form", () => {
        cy.fixture("users.json").then(({ receptionist }) => {
            cy.get("[data-cy=user-adminType-select]")
                .siblings()
                .should("have.value", receptionist.adminType);
            cy.get("[data-cy=user-address-input]")
                .should("have.value", receptionist.address);
            cy.get("[data-cy=user-phoneNumber-input]")
                .should("have.value", receptionist.phoneNumber);
            cy.get("[data-cy=submitButton]")
                .should("be.enabled");
        });
    });

    it("Can enter data properly for second form", () => {
        cy.fixture("users.json").then(({ receptionist }) => {
            cy.get("[data-cy=user-phoneNumber-input]")
                .clear()
                .should("be.empty")
                .fastType(0);
            cy.get("[data-cy=submitButton]")
                .should("be.disabled");
            cy.get("[data-cy=user-phoneNumber-input")
                .clear()
                .fastType(receptionist.phoneNumber)
                .should("have.value", receptionist.phoneNumber);
            cy.get("[data-cy=submitButton]")
                .should("be.enabled");
        });
    });

    it("Properly submits", () => {
        cy.fixture("users.json").then(({ receptionist }) => {
            cy.get("[data-cy=submitButton]").click();
            cy.contains("submitted");
            cy.contains(receptionist.phoneNumber);
        });
    });
});