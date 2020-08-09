const PARENT = {
    "__typename": "ParentType",
    "user": {
        "__typename": "UserType",
        "email": "parent@omou.com",
        "firstName": "Parent",
        "lastName": "Omouer",
    },
    "relationship": "GUARDIAN",
    "gender": "UNSPECIFIED",
    "phoneNumber": null,
    "birthDate": "2000-01-01",
    "address": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipcode": "55555",
};

const ID = "2";

describe("Fills out form", () => {
    before(() => {
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
                            expect(PARENT[key] || PARENT.user[key]).equals(value);
                        }
                    });
                },
            },
            "GetParent": {
                "response": {
                    "data": {
                        "parent": PARENT,
                    },
                },
                "test": ({id}) => {
                    expect(id).equals(ID, "Check ID passed");
                },
            },
        });
        cy.visitAuthenticated(`/form/parent/${ID}`);
    });

    it("Loads data properly", () => {
        cy.get("[data-cy=parent-firstName-input]")
            .should("have.value", PARENT.user.firstName);
        cy.get("[data-cy=parent-address-input]")
            .should("have.value", PARENT.address);
        cy.get("[data-cy=parent-phoneNumber-input]").should("have.value", "");
        cy.get("[data-cy=submitButton]").should("be.enabled");
    });

    it("Can enter data properly", () => {
        cy.get("[data-cy=parent-phoneNumber-input]").fastType("123456789");
        cy.get("[data-cy=submitButton]").should("be.disabled");
        cy.get("[data-cy=parent-phoneNumber-input]").fastType("0");
        cy.get("[data-cy=submitButton]").should("be.enabled");
    });

    it("Propery submits", () => {
        cy.get("[data-cy=submitButton]").click();
        cy.contains("submitted");
        cy.contains("1234567890");
    });
});
