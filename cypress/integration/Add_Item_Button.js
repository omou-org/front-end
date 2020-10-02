describe("Properly calculates height of AddItemButton component", () => {
    it('properly reads the height prop of AddItemButton component and sets it accordingly ', () => {
        cy.visit('/AddItemButtonTest');
        cy.get('.makeStyles-addNewItemStyles-3').should('have.css', 'height', '240px');
    });
});

