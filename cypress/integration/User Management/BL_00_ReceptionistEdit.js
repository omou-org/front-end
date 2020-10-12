describe("Editing an existing Receptionist account details", () => {
    before(() => {
        cy.fixture("users.json").then(({ original_receptionist_data, updated_receptionist_data }) => {
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
                                expect(updated_receptionist_data[key] || updated_receptionist_data?.user[key]).equals(value);
                            }
                        });
                    },
                },
                "GetAdmin": {
                    "response": {
                        "data": {
                            "admin": {
                                ...original_receptionist_data,
                                "password": null,
                            },
                        },
                    },
                    "test": ({ userID }) => {
                        expect(userID).equals(original_receptionist_data.user.id.toString(), "Check ID passed");
                    },
                },
            });
            cy.visitAuthenticated(`/form/admin/${original_receptionist_data.user.id}`);
        });
    });

    it("Loads existing receptionist account login details form section for receptionist", () => {
        cy.fixture("users.json").then(({ original_receptionist_data }) => {
            cy.get("[data-cy=login-firstName-input]")
                .should("have.value", original_receptionist_data.user.firstName);
            cy.get("[data-cy=login-lastName-input]")
                .should("have.value", original_receptionist_data.user.lastName);
            cy.get("[data-cy=login-email-input]")
                .should("have.value", original_receptionist_data.user.email);
            cy.get("[data-cy=login-nextButton]")
                .should("be.disabled");
        });
    });

    it("Edit receptionist data in Login Details section of the form", () => {
        cy.fixture("users.json").then(({ updated_receptionist_data }) => {
            cy.get("[data-cy=login-email-input]")
                .clear()
            cy.get("[data-cy=login-nextButton]")
                .should("be.disabled");
            cy.get("[data-cy=login-email-input]")
                .fastType(updated_receptionist_data.user.email);
            cy.get("[data-cy=login-nextButton]")
                .should("be.disabled");
            cy.get("[data-cy=login-password-input]")
                .should("be.empty")
                .fastType("test1234")
                .should("have.value", "test1234");
        });
    });



    it("Loads receptionist data into User Information section of receptionist editing form", () => {
        cy.fixture("users.json").then(({ original_receptionist_data }) => {
            cy.get("[data-cy=login-nextButton")
                .should("be.enabled")
                .click();
            cy.get("[data-cy=user-adminType-select]")
                .siblings()
                .should("have.value", original_receptionist_data.adminType);
            cy.get("[data-cy=user-address-input]")
                .should("have.value", original_receptionist_data.address);
            cy.get("[data-cy=user-phoneNumber-input]")
                .should("have.value", original_receptionist_data.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"))
                .click()
                .type("1");
            cy.get("[data-cy=submitButton]")
                .should("be.enabled");
        });
    });

    it("Verifies data from the user on form 1 persists if back button is clicked", () => {
        cy.fixture("users.json").then(({ updated_receptionist_data }) => {
            cy.get("[data-cy=backButton]")
                .should("be.enabled")
                .click();
            cy.get("[data-cy=login-email-input]")
                .should("have.value", updated_receptionist_data.user.email);
            cy.get("[data-cy=login-nextButton]")
                .should("be.enabled")
                .click();  
        })
    });


    it("Edit receptionist data in Login Edit section of the form", () => {
        cy.fixture("users.json").then(({ updated_receptionist_data }) => { 
            cy.get("[data-cy=user-address-input")
                .clear()
                .fastType(updated_receptionist_data.address)
                .should("have.value", updated_receptionist_data.address);
            cy.get("[data-cy=user-zipcode-input")
                .clear()
                .fastType(updated_receptionist_data.zipcode);
            cy.get("[data-cy=submitButton]")
                .should("be.enabled");
        });
    });

    it("Submits the receptionist form and displays the results page", () => {
        cy.fixture("users.json").then(({ updated_receptionist_data }) => {
            cy.get("[data-cy=submitButton]").click();
            cy.contains("submitted");
            cy.contains(updated_receptionist_data.address);
        });
    });
});