describe("Test should load our courses from course.json into course management, check to see if parent's student is enrolled in a course, then view instructor account", () => {
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
                        // console.log(x)
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
                    .first()
                    .should("have.text", AllCourses[0].title);
                cy.get("[data-cy=course-list-instructor-name]")
                    .first()
                    .children()
                    .last()
                    .should("have.text", `${AllCourses[0].instructor.user.firstName} ${AllCourses[0].instructor.user.lastName}`)
                    .should("have.css", "color", "rgb(40, 171, 213)");
                cy.get("[data-cy=course-list-chip]")
                    .last()
                    .should("have.text", "PAST")
                    .should("have.css", "background-color", "rgb(189, 189, 189)");
        });
    });

    it("Will click on the first course, taking the parent to the course information page", () => {
        before(() => {
            cy.fixture("announcements.json").then(({ announcements }) => {
                cy.mockGraphQL({
                    "getAnnouncements": {
                        "response": {
                            "data": announcements,
                        },
                        "test": (x) => {
                            console.log(x)
                            // expect(id).equals(parent.user.id.toString(), "Check ID passed");
                        },
                    },
                });
            });
            cy.fixture("courses.json").then(({ MathCourse }) => {

            })
        });
    });

});