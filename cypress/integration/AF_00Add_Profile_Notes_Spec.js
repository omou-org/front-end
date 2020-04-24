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
        cy.contains("Save").should("be.disabled")
        cy.get(".textfield").type("Out of office");
        cy.get(".note-body").type("Daniel has coronavirus and will not be in class for the new few days");
        cy.contains("Save").click();
        cy.get(".noteHeader").contains("Out of office");
        cy.get(".body").contains("Daniel has coronavirus and will not be in class for the new few days")
    });
    it("Will create a note with a notification with a subject and body", () => {
        cy.get(".addNote").click();
        cy.contains("Save").should("be.disabled")
        cy.get(".textfield").type("Out of office");
        cy.get(".note-body").type("Daniel has coronavirus and will be quarantine for a few days");
        cy.get(".notification").click();
        cy.contains("Save").click();
        cy.get(".noteHeader").contains("Out of office");
        cy.get(".body").contains("Daniel has coronavirus and will be quarantine for a few days");
        // Pseudo Code Logic
        // 
        cy.get("[data-cy=edit-btn]").last().click()
        cy.get("[data-cy=dialog-notification]").should('have.css', 'color', 'rgb(255, 0, 0)');
        // Close out of the edit dialog
    });
    it("Will display the number of important notes on the notes badge", () => {
        // Logic here
    })
    it("Will delete all notes", () => {
        // cy.get(".notes-container")
        // cy.get(".notes-container").then(note => {
        //     for (let i = 1; i < note.length; i++) {

        //     }
        // })
    });
})