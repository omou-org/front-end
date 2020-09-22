describe("Fills out form with mock data of receptionist from our user.json file, view our form to see if the data is inputed properly, edit our form with edited data, and submits our form", () => {
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

    it("Loads our mock data properly into the login details form section for receptionist", () => {
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

    it("Can enter data from the user properly into the first form, while checking if bad info is entered the submit button should be disabled", () => {
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
        });
    });

    it("Properly goes to the next section of the form called User Information and checks for data in stubs to load properly on the second form", () => {
        cy.fixture("users.json").then(({ receptionist }) => {
            cy.get("[data-cy=login-nextButton")
                .should("be.enabled")
                .click();
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

    it("Should verify if the data from the user on form 1 still persists if we accidently click the back button", () => {
            cy.get("[data-cy=backButton]")
                .should("be.enabled")
                .click();
            cy.get("[data-cy=login-password-input]")
                .should("have.value", "test1234");
    });


    it("Can enter data properly into the User Information form and go back to and from the first form with all data intact", () => {
        cy.fixture("users.json").then(({ receptionist }) => {
            cy.get("[data-cy=login-nextButton]")
                .should("be.enabled")
                .click();   
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

    it("Properly submits the receptionist form and displays the results page", () => {
        cy.fixture("users.json").then(({ receptionist }) => {
            cy.get("[data-cy=submitButton]").click();
            cy.contains("submitted");
            cy.contains(receptionist.phoneNumber);
        });
    });
});