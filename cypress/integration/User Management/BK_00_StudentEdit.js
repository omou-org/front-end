describe("Fills out form with mock data of students from our user.json file, view our form to see if the data is inputed properly, edit our form with edited data, and submits our form", () => {
    before(() => {
        cy.fixture("users.json").then(({ student, accountType }) => {
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
                            if (!["phoneNumber", "id", "user", "primaryParent", "school"].includes(key)) {
                                expect(student[key] || student?.user[key]).equals(value);
                            }
                        });
                    },
                },
                "GET_USER_TYPE": {
                    "response": {
                        "data": {
                            "userInfo": accountType
                        },
                    },
                    "test": ({id}) => {
                        expect(id).equals(student.user.id.toString(), "Check ID passed");
                    }
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

    it("Loads our mock data properly into the student information form section for students", () => {
        cy.fixture("users.json").then(({ student }) => {
            cy.get("[data-cy=student-firstName-input]")
                .should("have.value", student.user.firstName);
            cy.get("[data-cy=student-address-input]")
                .should("have.value", student.address);
            cy.get("[data-cy=student-phoneNumber-input]").should("have.value", student.phoneNumber);
            cy.get("[data-cy=submitButton]").should("be.enabled");
        });
    });

    it("Can enter data from the user properly into the first form, while checking if bad info is entered the submit button should be disabled", () => {
        cy.fixture("users.json").then(({ student }) => {
            cy.get("[data-cy=student-firstName-input]").clear();
            cy.get("[data-cy=student-firstName-input]").fastType("0");
            cy.get("[data-cy=submitButton]").should("be.disabled");
            cy.get("[data-cy=student-firstName-input]").clear();
            cy.get("[data-cy=student-firstName-input]").fastType(student.user.firstName);
            cy.get("[data-cy=submitButton]").should("be.enabled");
        });
    });

    it("Properly submits the instructor form and displays the results page", () => {
        cy.fixture("users.json").then(({ student }) => {
            cy.get("[data-cy=submitButton]").click();
            cy.contains("submitted");
            cy.contains(student.user.firstName);
        });
    });
});
