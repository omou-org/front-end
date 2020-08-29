const token = "token";
const userDetails = {
    email: "maggie@summit.com",
    first_name: "Maggie",
    id: 1,
    is_staff: true,
    last_name: "Huang",
};
const fakeDetails = {
    email: "iamnotreal@summit.com",
    first_name: "fake",
    id: 2,
    is_staff: true,
    last_name: "person",
};

describe("emailCheck_spec", () => {
    it("loads email check page", () => {
        cy.visit("");
        cy.get("[data-cy=nextButton]");
        cy.get("[data-cy=createAccountButton]")
    });
    it("checks invalid user", () => {
        cy.get("[data-cy=emailField]").fastType(fakeDetails.email);
        cy.get("[data-cy=nextButton]").click();
        cy.get(".MuiFormHelperText-root").contains("Sorry, we couldn't find a user for that email")
    });
    it("checks valid user", () => {
        cy.get("[data-cy=emailField]").clear();
        cy.get("[data-cy=emailField]").fastType(userDetails.email);
        cy.get("[data-cy=nextButton]").click();
      });
});