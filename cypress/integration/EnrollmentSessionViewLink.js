describe("Link from enrollmentview to sessionview", () => {
    before(() => {
        cy.fixture("enrollment.json").then(({ enrollment, sessions}) => {
            console.log(enrollment)
            console.log(sessions)
            // console.log(unpaidSessions)
            //Needs to mock the get request from enrollment
            //Needs to grab course Id, the id of the enrollment, and the instructor/user/id
            cy.mockGraphQL({
                "EnrollmentViewQuery": {
                    "response": {
                        "data": {
                                enrollment
                            },
                            
                        },
                    "test": (variables) => {
                        Object.entries(variables).forEach(([key, value]) => {
                            // if (!["courseId", "id", "instructorId"].includes(key)) {
                                expect(key).to.equal("enrollmentId");
                                expect(value).to.equal("1");
                        
                            // }
                            //key is 'enrollment', value = '1'
                            console.log(key, value)
                        });
                    },
                },
                // "GetEnrollment": {
                //     "response": {
                //         "data": {
                //             "enrollment": {
                //                 ...enrollment,
                //             },
                //         },
                //     },
                    // "test": ({ enrollmentId, courseId, instructorId }) => {
                    //     expect(enrollmentId).equals(enrollment.id.toString(), "Check ID passed");
                    //     expect(courseId).equals(enrollment.course.id.toString(), "Check ID passed");
                    //     expect(instructorId).equals(enrollment.course.instructor.user.id.toString(), "Check ID passed");

                    // },
                // },
                "GetSessions":{
                    "response": {
                        "data": {
                            sessions,
                        }
                    }
                }
            });
            cy.visitAuthenticated(`/enrollment/${enrollment.id}/`);

        });
    });
//     it('goes to the view-session scheduler of that session', () => {
//         cy.get('[data-cy=enrollment-sessions]').first().click();
//         cy.url().should('eq', `/scheduler/view-session/1/14/5`)
//
//     });
//
//     it('loads session view data', () => {
// //matches mock
//     });
});