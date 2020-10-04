describe("Fills out form", () => {
    before(() => {
        cy.fixture("users.json").then(({parent}) => {
            cy.mockGraphQL({
                "CreateParentAccount": {
                    "response": {
                        "data": {
                            "createParent": {
                                "created": false,
                            },
                        },
                    },
                    "test": (variables) => {
                        Object.entries(variables).forEach(([key, value]) => {
                            if (!["phoneNumber", "id", "user", "password"].includes(key)) {
                                expect(parent[key] || parent?.user[key]).equals(value);
                            }
                        });
                    },
                },
                "GetParent": {
                    "response": {
                        "data": {
                            "parent": {
                                ...parent,
                                "phoneNumber": null,
                            },
                        },
                    },
                    "test": ({id}) => {
                        expect(id).equals(parent.user.id.toString(), "Check ID passed");
                    },
                },
            });
            cy.visitAuthenticated(`/form/parent/${parent.user.id}`);
        });
    });

});