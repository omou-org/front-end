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

	it("Checks if registration actions don't exist without set parent", () => {
		cy.get("[data-cy=quick-register-class]").should('not.exist');
		cy.get("[data-cy=register-class]").should('not.exist');
	});

	it("Sets the parent", () => {
		cy.get("[data-cy=select-parent]").click();
		cy.get("[data-cy=select-parent-input]").fastType("Janet");
		cy.get("[data-cy=parent-option]").first().click();
		cy.get("[data-cy=set-parent-action]").click();
		cy.get("[data-cy=current-parent]").should('exist');
		cy.get("[data-cy=quick-register-class]").should('exist');
		cy.get("[data-cy=register-class]").should('exist');
		cy.get("[data-cy=shopping-cart-num-registrations]").should(($div) => {
			expect($div).contain("0");
		});
	});

	it("Registers a class through the form", () => {
		cy.get("[data-cy=register-class]").click();
		cy.get("[data-cy=student-student-select]").click();
		cy.get("[data-value=15]").click();
		cy.get("[data-cy=student-nextButton]").click();
		cy.get("[data-cy=student_info-nextButton]").click();
		cy.get("[data-cy=course-class]").click();
		cy.get('[data-cy="course.class-1"]').click();
		cy.get("[data-cy=submitButton]").click();
		cy.waitFor("[data-cy=student-card]");
		cy.waitFor("[data-cy=back-to-register]");
		cy.get("[data-cy=back-to-register]").click();
		cy.get("[data-cy=shopping-cart-num-registrations]").should(($div) => {
			expect($div).contain("1");
		});
	});

	it("Quick registers a class", () => {
		cy.get("[data-cy=quick-register-class]").first().click();
		cy.get("[data-cy=select-student-to-register]").click();
		cy.get("[data-cy=student-value]").first().click();
		cy.get("[data-cy=add-registration-to-cart]").click();
		cy.get("[data-cy=shopping-cart-num-registrations]").should(($div) => {
			expect($div).contain("2");
		});
	});

	it("Exits the parent", () => {
		cy.get("[data-cy=current-parent]").click();
		cy.get("[data-cy=exit-parent-action]").click();
		cy.get("[data-cy=select-parent]").should(($div) => {
			expect($div).contain("SET PARENT");
		});
	});
})