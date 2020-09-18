const { it } = require("date-fns/locale");

describe("Fills out form", () => {
    before(() => {
        cy.fixture("users.json").then(({instructor}) => {
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
                            if (!["phoneNumber", "id", "user", "password"].includes(key)) {
                                expect(instructor[key] || instructor?.user[key]).equals(value);
                            }
                        });
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
        cy.fixture("users.json").then(({instructor}) => {
            cy.get("[data-cy=basicInfo-phoneNumber-input]")
                .clear()
                .fastType("0");
            cy.get("[data-cy=basicInfo-nextButton]").should("be.disabled");
            cy.get("[data-cy=basicInfo-phoneNumber-input]").clear();
            cy.get("[data-cy=basicInfo-phoneNumber-input]").fastType(instructor.phoneNumber);
            cy.get("[data-cy=basicInfo-nextButton]").should("be.enabled");
        });
    });

    // it("Properly goes to the next part of the form and checks for data to load properly on the second form", () => {
    //     cy.fixture("users.json").then(({instructor}) => {
    //         cy.get("[data-cy=basicInfo-nextButton]").click();
    //         cy.get("[data-cy=experience-subjects]")
    //             .children()
    //             .find("span")
    //             .first()
    //             .should("have.text", instructor.subjects[0].name);
    //         cy.get("[data-cy=experience-experience-input")
    //             .should("have.value", "5");
    //         cy.get("[data-cy=experience-biography-input]")
    //             .should("have.value", instructor.biography);
    //         cy.get("[data-cy=experience-language-input]")
    //             .should("have.value", instructor.language);
    //         cy.get("[data-cy=basicInfo-nextButton]").should("be.enabled");
    //     });
    // });
});
