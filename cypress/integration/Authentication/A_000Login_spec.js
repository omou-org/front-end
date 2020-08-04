const token = "token";
const userDetails = {
  email: "maggie@summit.com",
  first_name: "Maggie",
  id: 1,
  is_staff: true,
  last_name: "Huang",
};

describe("A:00Login_spec", () => {
  it("Loads login page", () => {
    cy.visit("");
    cy.get("[data-cy=signInButton");
  });

  it("Toggles Remember Me", () => {
    cy.get("[data-cy=rememberMe]").click();
    cy.get("[data-cy=rememberMe]").should("be.checked");
  });

  it("Disabled with only an email", () => {
    cy.get("[data-cy=emailField]").fastType("maggie@summit.com");
    cy.get("[data-cy=signInButton").should("be.disabled");
    cy.get("[data-cy=emailField]").clear();
  });

  it("Disabled with only a password", () => {
    cy.get("[data-cy=passwordField]").fastType("password");
    cy.get("[data-cy=signInButton").should("be.disabled");
  });

  it("Enables submit with credentials", () => {
    cy.get("[data-cy=emailField]").fastType("maggie@summit.com");
    cy.get("[data-cy=signInButton").should("not.be.disabled");
  });

  it("Displays error on failed submit", () => {
    cy.server();
    cy.route({
      method: "POST",
      response: "Invalid credentials",
      status: 401,
      url: "/auth_token/",
    });
    cy.get("[data-cy=signInButton]").click();
    cy.get("[data-cy=errorMessage]");
  });

  it("Login redirects to the base URL", () => {
    cy.server();
    cy.route({
      method: "POST",
      response: {
        token,
      },
      responseType: "application/json",
      status: 200,
      url: "/auth_token/",
      withCredentials: true,
    });
    cy.route({
      method: "GET",
      response: userDetails,
      responseType: "application/json",
      status: 200,
      url: "/account/user/",
      withCredentials: true,
    });
    cy.get("[data-cy=passwordField]").fastType("{enter}");
    cy.location().should("have.property", "pathname", "/");
  });

  it("Saves details", () => {
    cy.window()
      .its("store")
      .invoke("getState")
      .should("have.nested.property", "auth.token", "token");
    cy.window()
      .its("store")
      .invoke("getState")
      .should("have.nested.property", "auth.isAdmin", userDetails.is_staff);
    cy.getCookie("authToken").should("be", token);
  });
});
