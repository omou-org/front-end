describe("Look up Instructor's account info", () => {
    before(() => {
        cy.fixture("courses.json").then(({ AllCourses }) => {
            cy.mockGraphQL({
                "getCourses": {
                    "response": {
                        "data": {
                            "courses": AllCourses,
                        },
                    },
                    "test": (x) => {
                        console.log(x)
                        // expect(id).equals(parent.user.id.toString(), "Check ID passed");
                    },
                },
            });
            cy.visitAuthenticated(`/coursemanagement`);
        });
    });

    it("Grabs all courses to display a list of courses in course management page and checks if all data is loaded correctly", () => {
        cy.fixture("courses.json").then(({ AllCourses }) => {
                cy.get("[data-cy=course-list-title]")
                    .eq(0)
                    .should("have.text", AllCourses[0].title);
                cy.get("[data-cy=course-list-instructor-name]")
                    .first()
                    .children()
                    .eq(1)
                    .should("have.text", `${AllCourses[0].instructor.user.firstName} ${AllCourses[0].instructor.user.lastName}`)
                    .should("have.css", "color", "rgb(40, 171, 213)");
                cy.get("[data-cy=course-list-chip]")
                    .last()
                    .should("have.text", "PAST")
                    .should("have.css", "background-color", "rgb(189, 189, 189)");  
                cy.get("[data-cy=course-list-chip]")
                    
        });
    });

    it("Will click on the first course, taking the parent to the course information page", () => {
        cy.fixture("courses.json").then(() => {
            cy.get("[data-cy=course-list]")
            .eq(1)
        });
    });
});
