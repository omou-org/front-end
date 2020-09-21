describe("Fills out form", () => {
    before(() => {
        cy.fixture("users.json").then(({instructor, instructor2, inviteInstructorConfirmation}) => {
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
                                expect(instructor2[key] || instructor2?.user[key]).equals(value);
                            }
                        });
                    },
                },
                "MyMutation": {
                    "response": {
                        "data": {
                            "inviteInstructor": {
                                inviteInstructorConfirmation
                            }
                        }
                    },
                },
                "GetInstructor": {
                    "response": {
                        "data": {
                            instructor
                        },
                    },
                    "test": ({userID}) => {
                        expect(userID).equals(instructor.user.id.toString(), "Check ID passed");
                    },
                },
            });
            cy.visitAuthenticated(`/form/instructor/${instructor.user.id}`);
        });
    });

    it("Loads data properly into the first form", () => {
        cy.fixture("users.json").then(({instructor}) => {
            cy.get("[data-cy=basicInfo-firstName-input]")
                .should("have.value", instructor.user.firstName);
            cy.get("[data-cy=basicInfo-address-input]")
                .should("have.value", instructor.address);
            cy.get("[data-cy=basicInfo-phoneNumber-input]")
                .should("have.value", instructor.phoneNumber);
            cy.get("[data-cy=basicInfo-nextButton]").should("be.enabled");
        });
    });

    it("Can enter data properly into the first form", () => {
        cy.fixture("users.json").then(({instructor2}) => {
            cy.get("[data-cy=basicInfo-phoneNumber-input]")
                .clear()
                .fastType("0");
            cy.get("[data-cy=basicInfo-nextButton]").should("be.disabled");
            cy.get("[data-cy=basicInfo-phoneNumber-input]").clear();
            cy.get("[data-cy=basicInfo-phoneNumber-input]").fastType(instructor2.phoneNumber);
            cy.get("[data-cy=basicInfo-address-input]")
                .clear()
                .fastType(instructor2.address)
                .should("have.value", instructor2.address)
            cy.get("[data-cy=basicInfo-nextButton]").should("be.enabled");
        }); 
    });

    it("Properly goes to the next part of the form and checks for data to load properly on the second form", () => {
        cy.fixture("users.json").then(({instructor}) => {
            cy.get("[data-cy=basicInfo-nextButton]").click();
            cy.get("[data-cy=experience-subjects]")
                .children()
                .find("span")
                .first()
                .should("have.text", instructor.subjects[0].name);
            cy.get("[data-cy=experience-experience-input")
                .should("have.value", instructor.experience);
            cy.get("[data-cy=experience-biography-input]")
                .should("have.value", instructor.biography);
            cy.get("[data-cy=experience-language-input]")
                .should("have.value", instructor.language);
            cy.get("[data-cy=basicInfo-nextButton]").should("be.enabled");
        });
    });

    it("Can enter data properly into the second form and go back to and from the first form with all data intact", () => {
        cy.fixture("users.json").then(({instructor2}) => {
            cy.get("[data-cy=backButton]")
                .should("be.enabled")
                .click()
            cy.get("[data-cy=basicInfo-nextButton]")
                .should("be.enabled")
                .click();            
            cy.get("[data-cy=experience-experience-input")
                .clear()
                .should("be.empty")
                .fastType(instructor2.experience)
                .should("have.value", instructor2.experience)
            cy.get("[data-cy=experience-biography-input")
                .clear()
                .should("be.empty")
                .fastType(instructor2.biography)
                .should("have.value", instructor2.biography)
            cy.get("[data-cy=experience-language-input]")
                .clear()
                .should("be.empty")
                .fastType(instructor2.language)
                .should("have.value", instructor2.language)
                .parent()
                .siblings("label")
                .should("have.css", "color", "rgb(67, 181, 217)")
            cy.get("[data-cy=submitButton]")
                .should("be.enabled")
        });
    });

    it("Properly submits", () => {
        cy.fixture("users.json").then(({ instructor2 }) => {
            cy.get("[data-cy=submitButton]")
                .click()
            cy.contains("submitted");
            cy.contains(instructor2.user.firstName)
        })
    })
});
