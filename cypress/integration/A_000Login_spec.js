/***
Arrange - setup inital app state
    - vist a web page
    - query for an element 
Act - take action 
    - interact with that element
Assert - make an assertion 
    - Make assertion on web page
 ***/

describe("A:00Login_spec", () => {
  it("Login Failed", () => {
    cy.server();
    cy.route({
      method: "GET",
      url: "/auth_token",
      response: '{ "detail": "Method "GET" not allowed."}',
      status: 400,
    });
  });

  it("Login", () => {
    cy.visit("http://localhost:3000/");
    cy.get(".email").type("maggie@summit.com");
    cy.get(".password").type("password");
    cy.get('[type="checkbox"]').click();
    cy.get('[type="submit"]').click();
    cy.contains("Scheduler");
  });
});
