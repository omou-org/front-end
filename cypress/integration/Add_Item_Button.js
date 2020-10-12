describe("Properly calculates height of AddItemButton component", () => {
    it('properly reads the height prop of AddItemButton component and sets it accordingly ', () => {
        cy.visit('/demos/AddItemButton');
        cy.get('[data-cy=AddItemButton]').should('have.css', 'height', '240px');
    });
});

