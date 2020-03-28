describe("Add Category", () => {
    it("Adds a category", () => {
        cy.login({ email: "maggie@summit.com", password: "password" });
        cy.contains("Admin").click();
        cy.contains("Manage Tuition").click();
        cy.contains("SET TUITION RULES").click();
        cy.get('.css-yk16xz-control').click();
        cy.contains("Chemical Engineering").click();
        cy.get(':nth-child(2) > .MuiGrid-root > .MuiFormControl-root > .MuiInputBase-root > .MuiSelect-root').click();
        cy.contains("High School").click();
        cy.get(':nth-child(3) > .MuiGrid-root > .MuiFormControl-root > .MuiInputBase-root > .MuiSelect-root').click();
        cy.contains("Tutoring").click();
        cy.get(':nth-child(4) > .MuiGrid-root > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type("120");
        cy.get('.MuiCollapse-wrapperInner > :nth-child(4) > .MuiGrid-root').click();
        cy.contains("Submit").click();
        cy.get('[style="margin: 2%; padding: 5px;"] > .MuiButtonBase-root').click();
    });
});