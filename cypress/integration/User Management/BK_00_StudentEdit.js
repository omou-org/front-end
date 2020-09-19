describe("Fills out form", () => {
    before(() => {
        cy.fixture("users.json").then(({ student }) => {
            cy.mockGraphQL({
                "AddStudent": {
                    "response": {
                        "data": {
                            "createStudent": {
                                "created": false,
                            },
                        },
                    },
                    "test": (variables) => {
                        Object.entries(variables).forEach(([key, value]) => {
                            console.log(key)
                            console.log(value)
                            if (!["phoneNumber", "id", "user", "primaryParent"].includes(key)) {
                                expect(student[key] || student?.user[key]).equals(value);
                            }
                        });
                    },
                },
                "GetInfo": {
                    "response": {
                        "data": {
                            student
                        },
                    },
                    "test": ({id}) => {
                        expect(id).equals(student.user.id.toString(), "Check ID passed");
                    },
                },
            });
            cy.visitAuthenticated(`/form/student/${student.user.id}`);
        });
    });

    it("Loads data properly", () => {
        cy.fixture("users.json").then(({ student }) => {
            // cy.get("[data-cy=student-firstName-input]")
            //     .should("have.value", student.user.firstName);
            // cy.get("[data-cy=student-address-input]")
            //     .should("have.value", student.address);
            // cy.get("[data-cy=student-phoneNumber-input]").should("have.value", "");
            // cy.get("[data-cy=submitButton]").should("be.enabled");
        });
    });

    // it("Can enter data properly", () => {
    //     cy.fixture("users.json").then(({ student }) => {
    //         cy.get("[data-cy=student-phoneNumber-input]").fastType("0");
    //         cy.get("[data-cy=submitButton]").should("be.disabled");
    //         cy.get("[data-cy=student-phoneNumber-input]").clear();
    //         cy.get("[data-cy=student-phoneNumber-input]").fastType(student.phoneNumber);
    //         cy.get("[data-cy=submitButton]").should("be.enabled");
    //     });
    // });

    // it("Properly submits", () => {
    //     cy.fixture("users.json").then(({ student }) => {
    //         cy.get("[data-cy=submitButton]").click();
    //         cy.contains("submitted");
    //         cy.contains(student.phoneNumber);
    //     });
    // });
});
