describe("Test should load our courses from course.json into course management, check to see if all courses are loaded while testing certain elements for functionality.", () => {
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
            .click();
        });
    });
});

// describe("Test should click on Science course and verify that the parent's student exists and check the name of instructor of the course", () => {
//     before(() => {
//         cy.fixture("courses.json").then(({ ScienceCourse }) => {
//             const announcements = {
//                 "announcements": []
//             };

//             const accountSearch = {
//                 "total": 1,
//                 "results": [
//                   {
//                     "userUuid": "jOliver",
//                     "user": {
//                       "email": "john@oliver.com",
//                       "firstName": "John",
//                       "lastName": "Oliver",
//                       "id": 5,
//                       "__typename": "UserType"
//                     },
//                     "__typename": "ParentType"
//                   }
//                 ],
//                 "__typename": "AccountSearchResults"
//               };

//             const enrollments = [
//                 {
//                     "student": {
//                       "user": {
//                         "id": 1,
//                         "__typename": "UserType"
//                       },
//                       "__typename": "StudentType"
//                     },
//                     "__typename": "EnrollmentType"
//                   }
//             ];

//             const parent = {
//                 studentList: ["5"],
//                 "__typename": "ParentType"
//             }
//             cy.mockGraphQL({
//                 "getClass": {
//                     "response": {
//                         "data": {
//                             "course": {...ScienceCourse},
//                             accountSearch,
//                             enrollments,
//                             parent
//                         }
//                     },
//                     "test": ({ id }) => {
//                         expect(id).equals(ScienceCourse.id.toString(), "Check ID passed")
//                     }
//                 },
//                 "getAnnouncement": {
//                     "response": {
//                         "data": announcements
//                     }
//                 }
//             });
//             cy.visitAuthenticated(`/coursemanagement/class/${ScienceCourse.id}`);
//         });
//     });

//     it("Will click on the first course, taking the parent to the course information page", () => {

//     });
// });