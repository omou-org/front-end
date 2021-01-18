describe('Fills out form with mock data of students from our user.json file, view our form to see if the data is inputed properly, edit our form with edited data, and submits our form', () => {
    before(() => {
        cy.fixture('users.json').then(
            ({ original_student_data, accountType, updated_student_data }) => {
                cy.mockGraphQL({
                    AddStudent: {
                        response: {
                            data: {
                                createStudent: {
                                    created: false,
                                },
                            },
                        },
                        test: (variables) => {
                            Object.entries(variables).forEach(
                                ([key, value]) => {
                                    if (
                                        ![
                                            'phoneNumber',
                                            'id',
                                            'user',
                                            'primaryParent',
                                            'school',
                                        ].includes(key)
                                    ) {
                                        expect(
                                            updated_student_data[key] ||
                                                updated_student_data?.user[key]
                                        ).equals(value);
                                    }
                                }
                            );
                        },
                    },
                    GET_USER_TYPE: {
                        response: {
                            data: {
                                userInfo: accountType,
                            },
                        },
                        test: ({ id }) => {
                            expect(id).equals(
                                original_student_data.user.id.toString(),
                                'Check ID passed'
                            );
                        },
                    },
                    GetInfo: {
                        response: {
                            data: {
                                student: original_student_data,
                            },
                        },
                        test: ({ id }) => {
                            expect(id).equals(
                                original_student_data.user.id.toString(),
                                'Check ID passed'
                            );
                        },
                    },
                });
                cy.visitAuthenticated(
                    `/form/student/${original_student_data.user.id}`
                );
            }
        );
    });

    it('Loads existing student account into student information form section for student', () => {
        cy.fixture('users.json').then(({ original_student_data }) => {
            cy.get('[data-cy=student-firstName-input]').should(
                'have.value',
                original_student_data.user.firstName
            );
            cy.get('[data-cy=student-address-input]').should(
                'have.value',
                original_student_data.address
            );
            cy.get('[data-cy=student-phoneNumber-input]')
                .should(
                    'have.value',
                    original_student_data.phoneNumber.replace(
                        /(\d{3})(\d{3})(\d{4})/,
                        '($1) $2-$3'
                    )
                )
                .click()
                .type('1');
            cy.get('[data-cy=submitButton]').should('be.enabled');
        });
    });

    it('Edit student data in Student Information section of the form', () => {
        cy.fixture('users.json').then(({ updated_student_data }) => {
            cy.get('[data-cy=student-address-input]')
                .clear()
                .fastType(updated_student_data.address);
            cy.get('[data-cy=student-city-input]')
                .clear()
                .fastType(updated_student_data.city);
            cy.get('[data-cy=submitButton]').should('be.enabled');
        });
    });

    it('Submits the student form and displays the results page', () => {
        cy.fixture('users.json').then(({ updated_student_data }) => {
            cy.get('[data-cy=submitButton]').click();
            cy.contains('submitted');
            cy.contains(updated_student_data.city);
        });
    });
});
