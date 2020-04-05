describe("Add Category", () => {
	it("Adds a category", () => {
		cy.login({email: "maggie@summit.com", password: "password"});
		cy.contains("Admin").click();
		cy.contains("Manage Course").click();
		cy.contains("COURSE CATEGORIES").click();
		cy.get(
			".MuiGrid-grid-xs-3 > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
		).type("Computer Science");
		cy.get(
			".MuiGrid-grid-xs-7 > .MuiFormControl-root > .MuiInputBase-root"
		).type("All courses related to computer science");
		cy.contains("Add Category").click();
	});
});
