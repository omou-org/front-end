describe("Admin Registers an upcoming class", () => {
	before(() => {
		cy.visit("registration");
		cy.login('maggie@summit.com', 'password');
	});

	it("Loads registration page with courses", () => {
		cy.get("[data-cy=registration-heading]").contains("Registration Catalog");
		cy.get("[data-cy=classes-table]").find('tr').should(($tr) => {
			expect($tr).to.have.length.least(1);
		});
	})

	it("Sets the parent", () => {
		cy.get("[data-cy=select-parent]").click();
		cy.get("[data-cy=select-parent-input]").fastType("Janet");
		cy.get("[data-cy=parent-option]").first().click();
		cy.get("[data-cy=set-parent-action]").click();
		cy.get("[data-cy=current-parent]");
	});

	it("Quick registers a class", () => {
		cy.get("[data-cy=quick-register-class]").first().click();

	});

	it("Exits the parent", () => {
		cy.get("[data-cy=current-parent]").click();
		cy.get("[data-cy=exit-parent-action]").click();
		cy.get("[data-cy=select-parent]").contains("SET PARENT");
	});
})