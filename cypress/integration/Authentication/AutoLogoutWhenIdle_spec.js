const { it } = require("date-fns/locale");

describe("Fills out form", () => {
    before(() => {
        cy.fixture("users.json").then(({admin}) => {
            cy.mockGraphQL({
                "CreateAdmin": {
                    "response": {
                        "data": {
                            "createAdmin": {
                                "created": false,
                            },
                        },
                    },
                    "test": (variables) => {
                        Object.entries(variables).forEach(([key, value]) => {
                            if (!["phoneNumber", "id", "user", "password"].includes(key)) {
                                expect(admin[key] || admin?.user[key]).equals(value);
                            }
                        });
                    },
                },
                "GetAdmin": {
                    "response": {
                        "data": {
                            // "parent": {
                                ...admin,
                                "phoneNumber": null,
                            },
                        },
                    },
                    "test": ({id}) => {
                        expect(id).equals(admin.user.id.toString(), "Check ID passed");
                    },
                },
            });
            cy.visitAuthenticated(`/form/admin/${admin.user.id}`);
        });
    
    });

    it("idles for 18 mins and clicks still here", () => {
        setTimeout(function() {console.log("waiting 18 mins...");}, 18000);
        cy.get("[data-cy=activityCheckModal]").should("be.enabled");
        cy.get("[data-cy=activityModalSubmit]").click()
        cy.get("[data-cy=hiddenTimer]").should("have.value", 0);
    };
    it("idles for 20 mins and logs out", () => {
        setTimeout(function() { console.log("waiting for 20 mins..."); }, 20000);
        cy.get("[data-cy=login-firstName-input]")
            .should("be.empty");
    })

});
