describe("M_01_Add_Category", () => {
	it("Login", () => {
		cy.fixture("profile").then((user) => {
			cy.login({email: user.admin.email, password: user.admin.password});
		});
	});
	it("Will go to the admins page and click on manage course", () => {
		cy.get("a[href*='/admin']").click()
		cy.contains("Manage Course").click();
		cy.contains("COURSE CATEGORIES").click();
	});
	it("Will add a new category", () => {
		cy.get("[data-cy=manage-categories-add-btn]").should("be.disabled");
		cy.get("[data-cy=manage-categories-description]").type("Introduction to Computer Science");
		cy.get("[data-cy=manage-categories-description]").contains("Introduction to Computer Science");
		cy.get("[data-cy=manage-categories-add-btn]").should("be.disabled");
		cy.get("[data-cy=manage-categories-name]").type("CS 101");
		cy.get("[data-cy=manage-categories-name]").last().children().last().children().should("have.value", "CS 101");
		cy.get("[data-cy=manage-categories-add-btn]").should("be.enabled");
		cy.get("[data-cy=manage-categories-add-btn]").click();
	})
});
