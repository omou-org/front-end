const token = 'token';
const userDetails = {
    email: 'maggie@summit.com',
    first_name: 'Maggie',
    id: 1,
    is_staff: true,
    last_name: 'Huang',
};

describe('A:00Login_spec', () => {
    it('Loads login page', () => {
        cy.visit('');
        cy.get('[data-cy=signInButton]');
    });
});
