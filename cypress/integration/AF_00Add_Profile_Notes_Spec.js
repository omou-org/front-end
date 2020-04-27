describe("AF_00Add_Profile_Notes", () => {
    it("Login", () => {
        cy.fixture("profile").then((user) => {
            cy.login({email: user.admin.email, password: user.admin.password});
        });
    });
    it("Will go into the accounts tab and find the first instructor", () => {
        cy.get('a[href*="/accounts"]').click();
        cy.contains('INSTRUCTORS').click();
        cy.get('a[href*="/accounts/instructor/4"]').click();
        cy.contains("Notes").click();
    });
    it("Will create a note with a subject and body", () => {
        cy.get(".addNote").click();
        cy.contains("Save").should("be.disabled");
        cy.get(".textfield").type("Out of office for today");
        cy.get(".note-body").type("Daniel has some things to take care of and will not be coming in today");
        cy.contains("Save").click();
        cy.get(".noteHeader").contains("Out of office for today");
        cy.get(".body").contains("Daniel has some things to take care of and will not be coming in today");
    });
    it("Will create a note with a notification with a subject and body", () => {
        cy.get(".addNote").click();
        cy.contains("Save").should("be.disabled");
        cy.get(".textfield").type("Out of office for a couple days");
        cy.get(".note-body").type("Daniel is sick and will not be in class for the next few days");
        cy.get(".notification").click();
        cy.contains("Save").click();
        cy.get(".noteHeader").contains("Out of office for a couple days");
        cy.get(".body").contains("Daniel is sick and will not be in class for the next few days");
        cy.get("[data-cy=edit-btn]").last().click();
        cy.get("[data-cy=dialog-notification]").should('have.css', 'color', 'rgb(255, 0, 0)');
        cy.contains("Cancel").click();
    });
    it("Will display the number of important notes on the notes badge", () => {
        cy.get("[data-cy=note-tab]").last().should('have.text', '1 Notes');
    })
    it("Will delete all notes", () => {
        cy.get("[data-cy=delete-btn]").last().click();
        cy.get(".delete-button").click();
        cy.get("[data-cy=delete-btn]").first().click()
        cy.get(".delete-button").click();
    });
})