describe("Add Category", () => {
    it("Adds a note to course", () => {
        cy.login({email: "maggie@summit.com", password: "password"});
        cy.contains("Accounts").click();
        cy.contains("STUDENTS").click();
        cy.get(
            ".MuiTableBody-root > :nth-child(1)"
        ).click();
		cy.contains("Notes").click();
		cy.contains("Add Note").click();
		cy.get('.MuiTypography-root > .MuiFormControl-root').type("a test note");
		cy.get('.MuiDialogContent-root > .MuiInputBase-root > .MuiInputBase-input').type("test note body");
		cy.get('.MuiButton-outlinedPrimary').click();

    });
});
