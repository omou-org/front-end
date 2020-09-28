describe("Sets a height of the AddItemButton component", () => {
	it("sets a height of the AddItemButtonComponent", () => {
		cy.login({email: "maggie@summit.com", password: "password"});
		cy.contains("Accounts").click();
	});
});