describe("AC_00Courses_Save_Note_spec", () => {
    it("Login", () => {
        cy.fixture("profile").then(user => cy.login({email: user.admin.email, password: user.admin.password}));
    });
    it("Will go into the registrations, click on AP Computer Science, and click on notes", () => {
        cy.get('a[href*="/registration"]').click();
        cy.contains('AP Computer Science').click();
        cy.contains("Notes").click();
    });
    it("Will create a note with a subject and body", () => {
        cy.get(".addNote").click();
        cy.contains("Save").should("be.disabled");
        cy.get(".textfield").type("Problem with Stephen Colbert");
        cy.get(".note-body").type("Stephen is a good kid but he keeps making too many jokes and distracting the class, his work is declining in quality");
        cy.contains("Save").click();
        cy.get(".noteHeader").contains("Problem with Stephen Colbert");
        cy.get(".body").contains("Stephen is a good kid but he keeps making too many jokes and distracting the class, his work is declining in quality");
    });
    it("Will create a note with a notification along with a subject and body", () => {
        cy.get(".addNote").click();
        cy.contains("Save").should("be.disabled");
        cy.get(".textfield").type("Stephen's Improvement");
        cy.get(".note-body").type("He has taken things more seriously in the past few weeks and his grades have improved immensely!");
        cy.get(".notification").click();
        cy.contains("Save").click();
        cy.get(".noteHeader").contains("Stephen's Improvement");
        cy.get(".body").contains("He has taken things more seriously in the past few weeks and his grades have improved immensely!");
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
});