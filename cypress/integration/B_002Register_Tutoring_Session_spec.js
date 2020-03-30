describe("B:002Register Tutoring Session", () => {
  it("Set Up", () => {
    cy.login({ email: "maggie@summit.com", password: "password" });
	  cy.setRegisteringParent("Janet M");
	  cy.get("[data-cy=register-btn]").click();
	  cy.get("[data-cy=tutoring-registration]").click();
	  // cy.findDropdown(".search-options","");
	  cy.contains("NEXT").click();
    cy.exitRegisteringParent();
  });
});
