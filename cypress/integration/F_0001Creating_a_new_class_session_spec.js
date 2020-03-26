describe("F_0001", () => {
    it("create a new class sesson", () => {
        cy.login({email: "gglinoga@gmail.com", password: "password"})
        cy.contains('Registration').click();
    })
})

