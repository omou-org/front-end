describe("Fills out form", () => {
    before(() => {
        cy.visit("registration/form/admin");
        cy.login();
    });

    it("Loads page properly", () => {
        cy.get("[data-cy=nextButton]").should("be.disabled");
    });

    it("Fills out login information", () => {
        cy.get("[data-cy=login-email-input]")
            .fastType("dan@gmail.com");
        cy.get("[data-cy=login-password-input]")
            .fastType("password");
        cy.get("[data-cy=login-first_name-input]")
            .fastType("dan");
        cy.get("[data-cy=login-last_name-input]")
            .fastType("han");
        cy.get("[data-cy=nextButton]").click();
    });

    it("Fills out user information", () => {
        cy.get("[data-cy=user-admin_type-select]").click();
        cy.get("[data-value=receptionist]").click();
        cy.get("[data-cy=user-gender-select]").click();
        cy.get("[data-value=unspecified]").click();
        cy.get("[data-cy=user-address-input]").fastType("1273 main street");
        cy.get("[data-cy=user-birthday-input]").fastType("01/01/2000");
        cy.get("[data-cy=user-city-input]").fastType("Oakland");
        cy.get("[data-cy=user-phone_number]").fastType("1234567890");
        cy.get("[data-cy=user-state]").fastType("CA");
        cy.get("[data-cy=\"user.state-CA\"]").click();
        cy.get("[data-cy=user-zipcode-input]").fastType(94566);
    });

    it("Submits form", () => {
        cy.fixture("users.json").then(({student, parent}) => {
            cy.server({"force404": true});
            cy.route({
                "method": "POST",
                "status": 200,
                "response": {
                    "user": {
                        "id": 14,
                        "email": "dan@gmail.com",
                        "first_name": "dan",
                        "last_name": "han",
                        "is_staff": false
                    },
                    "user_uuid": null,
                    "admin_type": "receptionist",
                    "gender": "unspecified",
                    "birth_date": "2000-01-01",
                    "address": "1273 main street",
                    "city": "Oakland",
                    "phone_number": "1234567890",
                    "state": "CA",
                    "zipcode": "94566",
                    "account_type": "admin",
                    "updated_at": "2020-04-13T03:19:51.998009Z",
                    "created_at": "2020-04-13T03:19:51.998030Z"
                },
                "url": "/account/admin/",
                "responseType": "application/json",
            });
            cy.get("[data-cy=submitButton]").click();
        });
    });
});
