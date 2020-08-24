const token = "token";
const userDetails = {
  email: "maggie@summit.com",
  first_name: "Maggie",
  id: 1,
  is_staff: true,
  last_name: "Huang",
};

describe("login_spec", () => {
    it("loads login page", () => {
        cy.visit("");
        cy.get("[data-cy=email-field]").fastType("maggie@summit.com");
        cy.contains("SIGN IN").click();
        cy.get("[data-cy=password-field]").fastType("password");
        cy.contains("SIGN IN").click();
        cy.get(".MuiAvatar-root").contains("MH");
    });
    it("Displays error on failed submit" , () => {
        
    });

    it("Redirects to base URL on login", () => {

    });
})