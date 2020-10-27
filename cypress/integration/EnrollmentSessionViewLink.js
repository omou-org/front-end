const { it } = require("date-fns/locale");

describe("Properly calculates height of AddItemButton component", () => {
    before(() => {
        cy.fixture("enrollment.json").then(({ enrollment }) => {
            //Needs to mock the get request from enrollment
            //Needs to grab course Id, the id of the enrollment, and the instructor/user/id
            cy.mockGraphQL({
                "EnrollmentViewQuery": {
                    "response": {
                        "data": {
                            enrollment
                            },
                        },
                    },
                    "test": (variables) => {
                        Object.entries(variables).forEach(([key, value]) => {
                            if (!["courseId", "id", "instructorId"].includes(key)) {
                                expect(enrollment[key] || enrollment?.user[key]).equals(value);
                            }
                        });
                    },
                },
                "GetEnrollment": {
                    "response": {
                        "data": {
                            "enrollment": {
                                ...enrollment,
                            },
                        },
                    },
                    "test": ({ enrollmentId, courseId, instructorId }) => {
                        expect(enrollmentId).equals(enrollment.id.toString(), "Check ID passed");
                        expect(courseId).equals(enrollment.course.id.toString(), "Check ID passed");
                        expect(instructorId).equals(enrollment.course.instructor.user.id.toString(), "Check ID passed");

                    },
                },
            });
            cy.visitAuthenticated(`/enrollment/${enrollmentId}`);

        });
    });
    

    it("will test stuff", () => {
        
    }
    
    it('goes to the view-session scheduler of that session', () => {

        cy.get('[data-cy=view-session-link]').click();
        cy.url().should('eq', `http://localhost:3000/scheduler/view-session/${courseId}/${enrollmentId}/${instructorId}`)

    });
});