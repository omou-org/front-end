describe("Tests Scheduler Filter if react-select throws 'options.reduce is not a function' error", () => {
    before(() => {
        cy.visit("scheduler")
        cy.login("danielhuang@blah.com", "password")
    })
    it("Should go to scheduler page", () => {
        cy.visit("scheduler")
        cy.get("[data-cy=scheduler-header-text]").contains("Scheduler")
    })
    it("Checks if you can enter your own filter", () => {
        cy.get("[data-cy=schduler-select-filter-box]").click()
        cy.get("#filter-instructor-select").type("TESTINGSTESTING").type('{enter}')
        cy.get("#filter-instructor-select").click(0, 20)
        cy.get("#filter-course-select").type("TEST2TEST2TEST2").type('{enter')
        cy.get("#filter-instructor-select").click(0, 20)
        cy.get("#filter-instructor-select").should('have.value', '')
        cy.get("#filter-instructor-select").click(0, 20)
        cy.get("#filter-course-select").should('have.value', '')
    })
})