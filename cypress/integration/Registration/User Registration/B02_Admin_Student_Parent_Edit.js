const token = 'token';
const userDetails = {
    email: 'maggie@summit.com',
    first_name: 'Maggie',
    id: 1,
    is_staff: true,
    last_name: 'Huang',
};

const student = {
    id: 131,
    user: {
        first_name: 'James',
        last_name: 'Wan',
    },
    gender: 'M',
    grade: 11,
    birth_date: '12-07-2002',
    school: 'Foothill High School',
    phone_number: '925-731-0499',
};

const parent = {
    first_name: 'Paula',
    last_name: 'Wan',
    relationship: 'mother',
    gender: 'F',
    email: 'pwan007@yahoo.com',
    birth_date: '03-13-1980',
    phone_number: '925-341-8562',
    address: 'Foothill High School',
    city: 'Pleasanton',
    state: 'CA',
    zipcode: '94566',
};

describe('Fills out form', () => {
    before(() => {
        cy.visit(`registration/form/student/${student.id}`);
        cy.window()
            .its('store')
            .invoke('dispatch', {
                type: 'FETCH_STUDENT_SUCCESSFUL',
                payload: {
                    // "response": {
                    data: student,
                    // },
                },
            });
        cy.login();
    });

    it('Loads page properly', () => {
        cy.get('[data-cy=nextButton]').should('be.disabled');
    });
});
