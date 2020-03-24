const user = {
  admin: {
    email: "c@lvin.com",
    password: "password",
  },
  receptionist: {
    email: "test",
    password: "test2",
  },
};

describe("Sessions Paid", () => {
  it("Pays for session", () => {
    cy.login({ email: user.admin.email, password: user.admin.password });
  });
});
