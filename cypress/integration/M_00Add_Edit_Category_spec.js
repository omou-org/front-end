describe("M_01_Add_Category_spec", () => {
	it("Will login and go to the admins page and click on manage course", () => {
		cy.fixture("profile").then((user) => {
			cy.login({email: user.admin.email, password: user.admin.password});
		});
		cy.visit("http://localhost:3000/adminportal")
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
	});
	it("Will edit a existing category", () => {
		cy.get("[data-cy=category-edit-btn]").first().click();
		cy.get("[data-cy=category-edit-name]").last().children().last().children().clear()
		cy.get("[data-cy=category-edit-name]").last().children().last().children().should("have.value", "");
		cy.get("[data-cy=category-edit-name]").type("English 101")
		cy.get("[data-cy=category-edit-name]").last().children().last().children().should("have.value", "English 101");
		cy.get("[data-cy=category-edit-description]").last().children().last().children().clear()
		cy.get("[data-cy=category-edit-description]").last().children().last().children().should("have.value", "");
		cy.get("[data-cy=category-edit-description]").type("Introduction to College level English");
		cy.get("[data-cy=category-edit-description]").last().children().last().children().should("have.value", "Introduction to College level English");
		cy.contains("UPDATE").click()
	})
});
