describe("B:002Register Tutoring Session", () => {
  it("Set Up", () => {
    cy.login({ email: "maggie@summit.com", password: "password" });
    cy.setRegisteringParent("Janet Mann");
	  cy.exitRegisteringParent();
  });
});
