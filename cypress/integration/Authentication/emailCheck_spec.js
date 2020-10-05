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
        cy.get("[data-cy=nextButton]").should("contain", "SIGN IN");
        cy.get("[data-cy=createAccountButton]").should("contain", "CREATE")
    });
    it("checks invalid user", () => {
        cy.get("[data-cy=emailField]").fastType(fakeDetails.email).should("have.value", fakeDetails.email);
        cy.get("[data-cy=nextButton]").click();
        cy.get(".MuiFormHelperText-root").should("contain", "Sorry, we couldn't find a user for that email")
    });
    it("checks valid user", () => {
        cy.get("[data-cy=emailField]").clear();
        cy.get("[data-cy=emailField]").fastType(userDetails.email).should("have.value", userDetails.email);
        cy.get("[data-cy=nextButton]").click();
        cy.get("[data-cy=forgotPassword]").should("contain", "Forgot Password")
        cy.get("[data-cy=passwordField]").should("exist")
    });
});