describe('Fills out form', () => {
    before(() => {
        cy.fixture('users.json').then(({ parent }) => {
            cy.mockGraphQL({
                CreateParentAccount: {
                    response: {
                        data: {
                            createParent: {
                                created: false,
                            },
                        },
                    },
                    test: (variables) => {
                        Object.entries(variables).forEach(([key, value]) => {
                            if (
                                ![
                                    'phoneNumber',
                                    'id',
                                    'user',
                                    'password',
                                ].includes(key)
                            ) {
                                expect(parent[key] || parent?.user[key]).equals(
                                    value
                                );
                            }
                        });
                    },
                },
                GetParent: {
                    response: {
                        data: {
                            parent: {
                                ...parent,
                                phoneNumber: null,
                            },
                        },
                    },
                    test: ({ id }) => {
                        expect(id).equals(
                            parent.user.id.toString(),
                            'Check ID passed'
                        );
                    },
                },
            });
            cy.visitAuthenticated(`/form/parent/${parent.user.id}`);
        });
    });

    it('Loads data properly', () => {
        cy.fixture('users.json').then(({ parent }) => {
            cy.get('[data-cy=parent-firstName-input]').should(
                'have.value',
                parent.user.firstName
            );
            cy.get('[data-cy=parent-address-input]').should(
                'have.value',
                parent.address
            );
            cy.get('[data-cy=parent-phoneNumber-input]').should(
                'have.value',
                ''
            );
            cy.get('[data-cy=submitButton]').should('be.enabled');
        });
    });

    it('Can enter data properly', () => {
        cy.fixture('users.json').then(({ parent }) => {
            cy.get('[data-cy=parent-phoneNumber-input]').fastType('0');
            cy.get('[data-cy=submitButton]').should('be.disabled');
            cy.get('[data-cy=parent-phoneNumber-input]').clear();
            cy.get('[data-cy=parent-phoneNumber-input]').fastType(
                parent.phoneNumber
            );
            cy.get('[data-cy=submitButton]').should('be.enabled');
        });
    });

    it('Properly submits', () => {
        cy.fixture('users.json').then(({ parent }) => {
            cy.get('[data-cy=submitButton]').click();
            cy.contains('submitted');
            cy.contains(parent.phoneNumber);
        });
    });
});
