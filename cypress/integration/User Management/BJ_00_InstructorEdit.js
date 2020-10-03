describe("As an admin, edit existing instructor account", () => {
    before(() => {
        cy.fixture("users.json").then(({original_instructor_data, updated_instructor_data, inviteInstructorConfirmationResponse}) => {
            cy.mockGraphQL({
                "CreateInstructor": {
                    "response": {
                        "data": {
                            "createInstructor": {
                                "created": false,
                            },
                        },
                    },
                    "test": (variables) => {
                        Object.entries(variables).forEach(([key, value]) => {
                            if (!["phoneNumber", "id", "user", "password", "subjects", "language"].includes(key)) {
                                expect(updated_instructor_data[key] || updated_instructor_data?.user[key]).equals(value);
                            }
                        });
                    },
                },
                "InviteInstructor": {
                    "response": {
                        "data": {
                            "inviteInstructor": {
                                inviteInstructorConfirmationResponse
                            }
                        }
                    },
                },
                "GetInstructor": {
                    "response": {
                        "data": {
                            "instructor": original_instructor_data
                        },
                    },
                    "test": ({userID}) => {
                        expect(userID).equals(original_instructor_data.user.id.toString(), "Check ID passed");
                    },
                },
            });
            cy.visitAuthenticated(`/form/instructor/${original_instructor_data.user.id}`);
        });
    });

    it("Loads instructor data into basic information section of form", () => {
        cy.fixture("users.json").then(({original_instructor_data}) => {
            cy.get("[data-cy=basicInfo-firstName-input]")
                .should("have.value", original_instructor_data.user.firstName);
            cy.get("[data-cy=basicInfo-address-input]")
                .should("have.value", original_instructor_data.address);
            cy.get("[data-cy=basicInfo-phoneNumber-input]")
                .should("have.value", original_instructor_data.phoneNumber);
            cy.get("[data-cy=basicInfo-nextButton]").should("be.enabled");
        });
    });

    it("Edit instructor data in basic information section of first form", () => {
        cy.fixture("users.json").then(({updated_instructor_data}) => {
            cy.get("[data-cy=basicInfo-phoneNumber-input]")
                .clear()
                .fastType("0");
            cy.get("[data-cy=basicInfo-nextButton]").should("be.disabled");
            cy.get("[data-cy=basicInfo-phoneNumber-input]").clear();
            cy.get("[data-cy=basicInfo-phoneNumber-input]").fastType(updated_instructor_data.phoneNumber);
            cy.get("[data-cy=basicInfo-address-input]")
                .clear()
                .fastType(updated_instructor_data.address)
                .should("have.value", updated_instructor_data.address)
            cy.get("[data-cy=basicInfo-nextButton]").should("be.enabled");
        }); 
    });

    it("Loads instructor data into next experience section of the form", () => {
        cy.fixture("users.json").then(({original_instructor_data}) => {
            cy.get("[data-cy=basicInfo-nextButton]").click();
            cy.get("[data-cy=experience-subjects]")
                .children()
                .find("span")
                .first()
                .should("have.text", original_instructor_data.subjects[0].name);
            cy.get("[data-cy=experience-experience-input]")
                .should("have.value", original_instructor_data.experience);
            cy.get("[data-cy=experience-biography-input]")
                .should("have.value", original_instructor_data.biography);
            cy.get("[data-cy=experience-language-input]")
                .should("have.value", original_instructor_data.language);
            cy.get("[data-cy=basicInfo-nextButton]").should("be.enabled");
        });
    });

    it("Verifies data from the user on form 1 persists if back button is clicked", () => {
        cy.fixture("users.json").then(({updated_instructor_data}) => {
            cy.get("[data-cy=backButton]")
                .should("be.enabled")
                .click();
            cy.get("[data-cy=basicInfo-phoneNumber-input]")
                .should("have.value", updated_instructor_data.phoneNumber);    
            cy.get("[data-cy=basicInfo-nextButton]")
                .should("be.enabled")
                .click();   
        }); 
    });

    it("Edit instructor data in next experience section of second form ", () => {
        cy.fixture("users.json").then(({updated_instructor_data}) => {
            cy.get("[data-cy=backButton]")
                .should("be.enabled")
                .click();
            cy.get("[data-cy=basicInfo-nextButton]")
                .should("be.enabled")
                .click();            
            cy.get("[data-cy=experience-experience-input")
                .clear()
                .should("be.empty")
                .fastType(updated_instructor_data.experience)
                .should("have.value", updated_instructor_data.experience);
            cy.get("[data-cy=experience-biography-input")
                .clear()
                .should("be.empty")
                .fastType(updated_instructor_data.biography)
                .should("have.value", updated_instructor_data.biography);
            cy.get("[data-cy=experience-language-input]")
                .clear()
                .should("be.empty")
                .fastType(updated_instructor_data.language)
                .should("have.value", updated_instructor_data.language)
                .parent()
                .siblings("label")
                .should("have.css", "color", "rgb(67, 181, 217)");
            cy.get("[data-cy=submitButton]")
                .should("be.enabled");
        });
    });

    it("Verifies data from the user on form 2 persists if back button is clicked", () => {
        cy.fixture("users.json").then(({updated_instructor_data}) => {
            cy.get("[data-cy=backButton]")
                .should("be.enabled")
                .click();
            cy.get("[data-cy=basicInfo-phoneNumber-input]")
                .should("have.value", updated_instructor_data.phoneNumber);    
            cy.get("[data-cy=basicInfo-nextButton]")
                .should("be.enabled")
                .click();   
            cy.get("[data-cy=experience-experience-input")
                .should("have.value", updated_instructor_data.experience);
            cy.get("[data-cy=experience-biography-input")
                .should("have.value", updated_instructor_data.biography);
            cy.get("[data-cy=experience-language-input")
                .should("have.value", updated_instructor_data.language);  
        }); 
    });

    it("Submits the instructor form and displays the results page", () => {
        cy.fixture("users.json").then(({ updated_instructor_data }) => {
            cy.get("[data-cy=submitButton]")
                .click();
            cy.contains("submitted");
            cy.contains(updated_instructor_data.user.firstName);
        })
    })
});
