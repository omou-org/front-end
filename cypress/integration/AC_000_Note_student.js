describe("Add Student Note", () => {
    it("Adds a note to course", () => {
        const noteTitle = 'a cypress test note';
        cy.login({email: "maggie@summit.com", password: "password"});
        cy.contains("Accounts").click();
        cy.contains("STUDENTS").click();
        cy.get(
            ".MuiTableBody-root > :nth-child(1)"
        ).click();
		cy.contains("Notes").click();
        cy.contains("Add Note").click();
		cy.get('.MuiTypography-root > .MuiFormControl-root').type(noteTitle);
		cy.get('.MuiDialogContent-root > .MuiInputBase-root > .MuiInputBase-input').type("test note body");
        cy.get('.MuiButton-outlinedPrimary').click();

        //check alert
        cy.contains(noteTitle).parent().find('.noteHeader > .MuiSvgIcon-root').click();
        cy.should('have.css', 'color', 'rgb(255, 0, 0)');

        //uncheck alert
        cy.contains(noteTitle).parent().find('.noteHeader > .MuiSvgIcon-root').click();
        cy.should('have.css', 'color', 'rgba(0, 0, 0, 0.87)');

        //edit note
        cy.contains(noteTitle).parent().find('.actions > :nth-child(2)').click();
        cy.get('.MuiTypography-root > .MuiFormControl-root').type("testing edit");
        cy.get('.MuiDialogContent-root > .MuiInputBase-root > .MuiInputBase-input').type("testing edit note body");
        cy.get('.MuiButton-outlinedPrimary').click();
        cy.contains(noteTitle).parent().find('.noteHeader').should('contain', 'testing edit');
        cy.contains(noteTitle).parent().find('.body').should('contain', 'testing edit note body');

        cy.contains(noteTitle).parent().find('.actions > :nth-child(3)').click();
        cy.contains(noteTitle).parent().find('.actions > :nth-child(3)').should('have.css', 'color', 'rgb(67, 181, 217)');
        cy.contains(noteTitle).parent().find('.actions > :nth-child(3)').click();
        cy.contains(noteTitle).parent().find('.actions > :nth-child(3)').should('have.css', 'color', 'rgba(0, 0, 0, 0.87)');



        //delete
        cy.contains(noteTitle).parent().find('.actions > :nth-child(1)').click();
        cy.get('.delete-button').click();
    });
});