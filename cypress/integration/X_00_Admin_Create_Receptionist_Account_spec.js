describe("X_00_Admin_Create_Receptionist_Account_spec", () => {
    it("Will login and go to the admin page", () => {
        cy.fixture("profile").then((user) => {
            cy.login({email: user.admin.email, password: user.admin.password});
        });
        cy.visit("http://localhost:3000/adminportal");
    });
    it("Will click on add admin and fill out the first part of the receptionist's info", () => {
        cy.contains("Add Users").click();
        cy.contains("ADD ADMIN").click();
        cy.get("[data-cy=form-btn]").should("be.disabled");
        cy.get("[data-cy=form-btn]").click({ force: true });
        cy.get("[data-cy=form-input]").children().eq(2).should("have.text", "Email invalid").and("have.css", "color", "rgb(244, 67, 54)");
        cy.get("[data-cy=form-input]").children().eq(5).should("have.text", "First Name invalid").and("have.css", "color", "rgb(244, 67, 54)");
        cy.get("[data-cy=form-input]").children().last().should("have.text", "Last Name invalid").and("have.css", "color", "rgb(244, 67, 54)");
        cy.get("[data-cy=form-input").children().eq(1).type("AnnieEdison@gmail.com");
        cy.get("[data-cy=form-btn]").should("be.disabled");
        cy.get("[data-cy=form-input").children().eq(1).children().should("have.value", "AnnieEdison@gmail.com");
        cy.get("[data-cy=form-btn]").click({ force: true });
        cy.get("[data-cy=form-input]").children().eq(1).eq(2).should("not.have.text", "Email invalid").and("not.exist");
        cy.get("[data-cy=form-password]").type("test");
        cy.get("[data-cy=form-password]").children().eq(1).children().click();
        cy.get("[data-cy=form-password]").children().should("have.value", "test");
        cy.get("[data-cy=form-password]").children().eq(1).children().click();
        cy.get("[data-cy=form-input]").children().eq(3).type("Annie")
        cy.get("[data-cy=form-btn]").click({ force: true });
        cy.get("[data-cy=form-input]").children().eq(4).eq(2).should("not.have.text", "First Name invalid").and("not.exist");
        cy.get("[data-cy=form-input]").children().eq(3).children().should("have.value", "Annie");
        cy.get("[data-cy=form-input]").children().eq(5).type("Edison");
        cy.get("[data-cy=form-input]").children().eq(3).click();
        cy.get("[data-cy=form-input]").children().eq(5).eq(2).should("not.have.text", "Last Name invalid").and("not.exist");
        cy.get("[data-cy=form-input]").children().last().children().should("have.value", "Edison");
        cy.get("[data-cy=form-btn]").should("be.enabled");
        cy.get("[data-cy=form-btn]").click();
    });
    it("will fill out the second part of the receptionist's info", () => {
        const year = Cypress.moment().format("YYYY");
        const date = Cypress.moment().format("MMM YYYY");
        cy.get("[data-cy=form-btn]").should("be.disabled");
        cy.get("[data-cy=user-info-input]").children().eq(0).click();
        cy.contains("Receptionist").click({ force: true });
        cy.get("[data-cy=user-info-input]").children().eq(0).last().children().eq(1).should("have.text", "Receptionist");
        cy.get("[data-cy=form-btn]").should("be.enabled");
        cy.get("[data-cy=user-info-input]").children().eq(1).click();
        cy.contains("Female").click({ force: true });
        cy.get("[data-cy=user-info-input]").children().eq(1).last().children().eq(1).should("have.text", "Female");
        cy.get("[data-cy=date-picker-form]").click();
        cy.contains(date).parent().parent().parent().siblings().eq(1).children().then(ele => {
            let day20 = ele.text();
            cy.contains(day20).click();
        })
        cy.contains(year).click();
        cy.contains("1990").click();
        cy.contains("Dec").click();
        cy.contains("OK").click();
        cy.get("[data-cy=date-picker-form]").children().last().children().should("have.value", "12/20/1990")
        cy.get("[data-cy=user-info-input]").children().eq(3).type("202 Somewhere in Greendale Blvd");
        cy.get("[data-cy=user-info-input]").children().eq(3).last().children().eq(1).children().should("have.value", "202 Somewhere in Greendale Blvd");
        cy.get("[data-cy=user-info-input]").children().eq(4).type("Greendale");
        cy.get("[data-cy=user-info-input]").children().eq(4).last().children().eq(1).children().should("have.value", "Greendale");
        cy.get("[data-cy=user-info-input]").children().eq(5).type("5555555555");
        cy.get("[data-cy=user-info-input]").children().eq(5).last().children().eq(1).children().should("have.value", "5555555555");
        cy.get("[data-cy=user-info-input]").children().eq(6).click();
        cy.contains("CO").click({ force: true });
        cy.get("[data-cy=user-info-input]").children().eq(6).last().children().eq(1).should("have.text", "CO");
        cy.get("[data-cy=user-info-input]").children().eq(7).type("80022");
        cy.get("[data-cy=user-info-input]").children().eq(7).last().children().eq(1).children().should("have.value", "80022");
        // I do not want to keep deleting my table for receptionist so I had cypress hit the back button instead of the submit button. 
        // Just comment it in and comment out the back button to test submit.
        cy.get("[data-cy=back-btn]").click();
        // cy.get("[data-cy=form-btn]").click();
    });
});