describe('Fills out category form', () => {
    before(() => {
        cy.fixture('categories.json').then(({ category }) => {
            cy.mockGraphQL({
                createCourseCategory: {
                    response: {
                        data: {
                            createCourseCategory: {
                                created: false,
                            },
                        },
                    },
                    test: (variables) => {
                        Object.entries(variables).forEach(([key, value]) => {
                            if (!['name', 'description'].includes(key)) {
                                expect(category[key] || category[key]).equals(
                                    value
                                );
                            }
                        });
                    },
                },
            });
        });
    });
});
