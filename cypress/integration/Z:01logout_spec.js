describe("Logs out user", () => {
    it("Logout", function () {
        cy.get('.logout-icon').click();
        cy.contains("sign in")
    })
})
