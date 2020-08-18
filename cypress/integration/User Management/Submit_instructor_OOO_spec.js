

describe('Submit an instructor OOO', () => {
    before(() => {
        cy.visit("availability");
        cy.login('danielhuang@blah.com', 'password');
    });

    it("Goes to intructor OOO tab", () => {
        cy.visit("availability");
        cy.get("[data-cy=request-OOO-tab]").click()
        cy.get("[data-cy=submit-OOO-text]").contains('Submit')
    });

    it("Test inputs and clear form", () => {
        cy.get("[data-cy=start-time-picker-OOO]").type("06:30 AM")
        cy.get("[data-cy=end-time-picker-OOO]").type("10:00 AM")
        cy.get("[data-cy=out-all-day-checkbox]").click()
        cy.get("[data-cy=instructor-OOO-description-input]").type("This is a test")
        cy.get("[data-cy=clear-OOO-button]").click()


    })



})