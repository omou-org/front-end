describe("Fills out form with mock data of instructor from our user.json file, view our form to see if the data is inputed properly, edit our form with edited data, and submits our form", () => {
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

    it("Loads our mock data properly into the basic information form section for instructors", () => {
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

    it("Can enter data from the user properly into the first form", () => {
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

    it("Properly goes to the next experience section of the form and checks for data in stubs to load properly on the second form", () => {
        cy.fixture("users.json").then(({original_instructor_data}) => {
            cy.get("[data-cy=basicInfo-nextButton]").click();
            cy.get("[data-cy=experience-subjects]")
                .children()
                .find("span")
                .first()
                .should("have.text", original_instructor_data.subjects[0].name);
            cy.get("[data-cy=experience-experience-input")
                .should("have.value", original_instructor_data.experience);
            cy.get("[data-cy=experience-biography-input]")
                .should("have.value", original_instructor_data.biography);
            cy.get("[data-cy=experience-language-input]")
                .should("have.value", original_instructor_data.language);
            cy.get("[data-cy=basicInfo-nextButton]").should("be.enabled");
        });
    });

    it("Should verify if the data from the user on form 1 still persists if we accidently click the back button", () => {
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

    it("Can enter data properly into the second form and go back to and from the first form with all data intact", () => {
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

    it("Should verify if the data from the user on form 1 still persists if we accidently click the back button", () => {
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

    it("Should simulate a miss click on the back button", () => {
            cy.get("[data-cy=backButton]")
                .should("be.enabled")
                .click();
            cy.get("[data-cy=basicInfo-nextButton]")
                .should("be.enabled")
                .click();   
    });

    it("Should verify if the data from the user on form 1 still persists if we accidently click the back button", () => {
        cy.fixture("users.json").then(({updated_instructor_data}) => {
            cy.get("[data-cy=experience-experience-input")
                .should("have.value", updated_instructor_data.experience);
            cy.get("[data-cy=experience-biography-input")
                .should("have.value", updated_instructor_data.biography);
            cy.get("[data-cy=experience-language-input")
                .should("have.value", updated_instructor_data.language);  
        }); 
    });

    it("Properly submits the instructor form and displays the results page", () => {
        cy.fixture("users.json").then(({ updated_instructor_data }) => {
            cy.get("[data-cy=submitButton]")
                .click();
            cy.contains("submitted");
            cy.contains(updated_instructor_data.user.firstName);
        })
    })
});
