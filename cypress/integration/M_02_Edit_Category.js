describe("Add Category", () => {
	it("Adds a category", () => {
		cy.login({email: "maggie@summit.com", password: "password"});
		cy.contains("Admin").click();
		cy.contains("Manage Course").click();
		cy.contains("COURSE CATEGORIES").click();
		cy.get(
			".MuiGrid-spacing-xs-1 > :nth-child(1) > .MuiPaper-root > .MuiGrid-container > .MuiGrid-grid-xs-2 > .MuiButtonBase-root"
		).click();
		cy.get(
			".MuiGrid-spacing-xs-1 > :nth-child(1) > .MuiPaper-root > .MuiGrid-container > .MuiGrid-grid-xs-3 > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
		).clear();
		cy.get(
			".MuiGrid-spacing-xs-1 > :nth-child(1) > .MuiPaper-root > .MuiGrid-container > .MuiGrid-grid-xs-3 > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
		).type("Chemical Engineering");
		cy.get(
			".MuiGrid-spacing-xs-1 > :nth-child(1) > .MuiPaper-root > .MuiGrid-container > .MuiGrid-grid-xs-7 > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
		).clear();
		cy.get(
			".MuiGrid-spacing-xs-1 > :nth-child(1) > .MuiPaper-root > .MuiGrid-container > .MuiGrid-grid-xs-7 > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
		).type("All courses related to Chemical Engineering");
		cy.get(
			".MuiGrid-spacing-xs-1 > :nth-child(1) > .MuiPaper-root > .MuiGrid-container > .MuiGrid-grid-xs-2 > .MuiButtonBase-root"
		).click();
	});
});
