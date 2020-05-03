describe("add_notes_spec", () => {
    it("Login", () => {
        cy.fixture("profile").then((user) => {
            cy.login({email: user.admin.email, password: user.admin.password});
        });
        cy.visit("http://localhost:3000/accounts");
    });
    it("Will go into the accounts tab and find the first instructor", () => {
        cy.contains('INSTRUCTORS').click();
        cy.get('a[href*="/accounts/instructor/4"]').click();
        cy.contains("Notes").click();
    });
    it("Will create a note with a subject and body", () => {
        cy.get("[data-cy=add-note]").click();
        cy.contains("Save").should("be.disabled");
        cy.get("[data-cy=textfield]").type("Out of office for today");
        cy.get("[data-cy=note-body]").type("Daniel has some things to take care of and will not be coming in today");
        cy.contains("Save").click();
        cy.get("[data-cy=note-header]").contains("Out of office for today");
        cy.get("[data-cy=body]").contains("Daniel has some things to take care of and will not be coming in today");
    });
    it("Will create a note with a notification with a subject and body", () => {
        cy.get("[data-cy=add-note]").click();
        cy.contains("Save").should("be.disabled");
        cy.get("[data-cy=textfield]").type("Out of office for a couple days");
        cy.get("[data-cy=note-body]").type("Daniel is sick and will not be in class for the next few days");
        cy.get("[data-cy=dialog-notification]").click();
        cy.contains("Save").click();
        cy.get("[data-cy=note-header]").contains("Out of office for a couple days");
        cy.get("[data-cy=body]").contains("Daniel is sick and will not be in class for the next few days");
        cy.get("[data-cy=edit-btn]").last().click();
        cy.get("[data-cy=dialog-notification]").should('have.css', 'color', 'rgb(255, 0, 0)');
        cy.contains("Cancel").click();
    });
    it("Will display the number of important notes on the notes badge", () => {
        cy.get("[data-cy=note-tab]").last().should('have.text', '1 Notes');
    })
    it("Will delete all notes", () => {
        cy.get("[data-cy=delete-btn]").last().click();
        cy.get("[data-cy=delete-confirm]").click();
        cy.get("[data-cy=delete-btn]").first().click()
        cy.get("[data-cy=delete-confirm]").click();
    });
    it("Will go into the registrations after login, click on AP Computer Science, and click on notes", () => {
        cy.fixture("profile").then((user) => {
            cy.login({email: user.admin.email, password: user.admin.password});
        });
        cy.visit("http://localhost:3000/registration")
        cy.contains('AP Computer Science').click();
        cy.contains("Notes").click();
    });
    it("Will create a note with a subject and body", () => {
        cy.get("[data-cy=add-note]").click();
        cy.contains("Save").should("be.disabled");
        cy.get("[data-cy=textfield]").type("Problem with Stephen Colbert");
        cy.get("[data-cy=note-body]").type("Stephen is a good kid but he keeps making too many jokes and distracting the class, his work is declining in quality");
        cy.contains("Save").click();
        cy.get("[data-cy=note-header]").contains("Problem with Stephen Colbert");
        cy.get("[data-cy=body]").contains("Stephen is a good kid but he keeps making too many jokes and distracting the class, his work is declining in quality");
    });
    it("Will create a note with a notification along with a subject and body", () => {
        cy.get("[data-cy=add-note]").click();
        cy.contains("Save").should("be.disabled");
        cy.get("[data-cy=textfield]").type("Stephen's Improvement");
        cy.get("[data-cy=note-body]").type("He has taken things more seriously in the past few weeks and his grades have improved immensely!");
        cy.get("[data-cy=dialog-notification]").click();
        cy.contains("Save").click();
        cy.get("[data-cy=note-header]").contains("Stephen's Improvement");
        cy.get("[data-cy=body]").contains("He has taken things more seriously in the past few weeks and his grades have improved immensely!");
        cy.get("[data-cy=edit-btn]").last().click();
        cy.get("[data-cy=dialog-notification]").should('have.css', 'color', 'rgb(255, 0, 0)');
        cy.contains("Cancel").click();
    });
    it("Will check the notes tab if the notes icon has a yellow svg", () => {
        cy.get(".notificationCourse").should('exist');
    })
    it("Will delete all notes", () => {
        cy.get("[data-cy=delete-btn]").last().click();
        cy.get(".delete-button").click();
        cy.get("[data-cy=delete-btn]").first().click();
        cy.get(".delete-button").click();
    });
    it("Will check the notes tab to and show that the notes notification should not exist", () => {
        cy.get(".notificationCourse").should("not.exist");
    });
})