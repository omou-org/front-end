describe("Test loads course's class and performs an announcement creation", () => {
    before(() => {
        cy.fixture("courses.json").then(({ ScienceCourse }) => {
            const announcements = {
                "announcements": []
            };

            const parentSearch = {
                "total": 1,
                "results": [
                  {
                    "userUuid": "jOliver",
                    "user": {
                      "email": "john@oliver.com",
                      "firstName": "John",
                      "lastName": "Oliver",
                      "id": 5,
                      "__typename": "UserType"
                    },
                    "__typename": "ParentType"
                  }
                ],
                "__typename": "AccountSearchResults"
              };

            const enrollments = [
                {
                    "student": {
                      "user": {
                        "id": 1,
                        "__typename": "UserType"
                      },
                      "__typename": "StudentType"
                    },
                    "__typename": "EnrollmentType"
                  }
            ];

            const parent = {
                studentList: ["5"],
                "__typename": "ParentType"
            }

            cy.mockGraphQL({
                "CreateAnnouncement": {
                    "response": {
                        "data": {
                            "createAnnouncement": {
                                "created": false
                            }
                        }
                    },
                    "test": (variables) => {
                        Object.entries(variables).forEach(([key, value]) => {
                            console.log(value)
                            console.log(key)
                        })
                    }
                },
                "getClass": {
                    "response": {
                        "data": {
                            "course": {...ScienceCourse},
                            "accountSearch": parentSearch,
                            enrollments,
                            parent
                        }
                    },
                    "test": ({ id }) => {
                        expect(id).equals(ScienceCourse.id.toString(), "Check ID passed")
                    }
                },
                "getAnnouncement": {
                    "response": {
                        "data": announcements
                    }
                },                
            });
            cy.visitAuthenticated(`/coursemanagement/class/2`);        
        });
    });

    it("Clicks the announcement tab and clicks on new announcement", () => {
            cy.get("[data-cy=announcements]")
                .should("have.text", "Announcements")
                .click();
            cy.get("[data-cy=new-announcement-button")
                .should("have.text", "+ New Announcement")
                .click();
    });

    it("Will fill out the form with announcement data", () => {
        cy.fixture("announcements.json").then(({ announcements }) => {
            cy.get('[data-cy=text-editor-subject]')
                .should("have.value", "")
                .fastType(announcements[0].subject);
            cy.get('[data-cy=text-editor-body]')
                .click()
                .fastType(announcements[0].body)
                .type('{selectall}')
            cy.get('[data-cy=text-editor-bold]')
                .click()
            cy.get('[data-cy=text-editor-highlight]')
                .click()
        });
    });

    it("Will check to see if POST button is disabled without a body or subject", () => {
        cy.fixture("announcements.json").then(({ announcements }) => {
            cy.get('[data-cy=text-editor-subject]')
                .children()
                .clear()
                .should("have.value", "");
            cy.get('[data-cy=text-editor-post-button]')
                .should("be.disabled");
            cy.get('[data-cy=text-editor-subject]')
                .children()
                .clear()
                .fastType("1");    
            cy.get('[data-cy=text-editor-body]')
                .find('[data-text=true]')
                .clear();
            cy.get('[data-cy=text-editor-post-button]')
                .should("be.disabled");
            cy.get('[data-cy=text-editor-subject]')
                .children()
                .clear()
                .fastType(announcements[0].subject);
            cy.get('[data-cy=text-editor-body]')
                .click()
                .fastType(announcements[0].body)
                .type('{selectall}')
            cy.get('[data-cy=text-editor-bold]')
                .click()
            cy.get('[data-cy=text-editor-highlight]')
                .click()
            cy.get('[data-cy=text-editor-body]')
                .find('[data-offset-key]')
                .eq(2)
                // .should("have.css", "background-color: yellow")
            // cy.get('[data-cy=text-editor-body]')
            //     .click()
            //     .fastType(announcements[0].body)
            //     .type('{selectall}')
            // cy.get('[data-cy=text-editor-bold]')
            //     .click()
            // cy.get('[data-cy=text-editor-highlight]')
            //     .click()
        });
    });
});