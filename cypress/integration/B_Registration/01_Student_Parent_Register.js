const token = "token";
const userDetails = {
    "email": "maggie@summit.com",
    "first_name": "Maggie",
    "id": 1,
    "is_staff": true,
    "last_name": "Huang",
};

const student = {
    "first_name": "James",
    "last_name": "Wan",
    "gender": "M",
    "grade": 11,
    "birth_date": "12-07-2002",
    "school": "Foothill High School",
    "phone_number": "925-731-0499",
};

const parent = {
    "first_name": "Paula",
    "last_name": "Wan",
    "relationship": "mother",
    "gender": "F",
    "email": "pwan007@yahoo.com",
    "birth_date": "03-13-1980",
    "phone_number": "925-341-8562",
    "address": "Foothill High School",
    "city": "Pleasanton",
    "state": "CA",
    "zipcode": "94566",
};

describe("Fills out form", () => {
    before(() => {
        cy.visit("registration/form/student");
        cy.login();
    });

    it("Loads page properly", () => {
        cy.get("[data-cy=nextButton]").should("be.disabled");
    });

    it("Fills out required student fields", () => {
        cy.get("[data-cy=student-first_name-input]").fastType(student.first_name);
        cy.get("[data-cy=student-last_name-input]").fastType(student.last_name);
        cy.get("[data-cy=nextButton]").should("not.be.disabled");
    });

    it("Errors on invalid input", () => {
        cy.get("[data-cy=student-grade-input]").fastType("grade");
        cy.get("[data-cy=nextButton]").should("be.disabled");
        cy.get("[data-cy=student-grade-input]").clear();
    });

    it("Fills out optional student fields", () => {
        cy.get("[data-cy=student-gender-select]").click();
        cy.get(`[data-value=${student.gender}]`).click();
        cy.get("[data-cy=student-grade-input]").fastType(student.grade);
        cy.get("[data-cy=student-birth_date-input]").fastType(student.birth_date);
        cy.get("[data-cy=student-school-input]").fastType(student.school);
        cy.get("[data-cy=student-phone_number-input").fastType(student.phone_number);
        cy.get("[data-cy=nextButton]").should("not.be.disabled");
    });

    it("Goes to next section", () => {
        cy.get("[data-cy=nextButton]").click();
        cy.get("[data-cy=nextButton]").should("be.disabled");
    });

    it("Fills out required parent fields", () => {
        cy.get("[data-cy=parent-first_name-input]").fastType(parent.first_name);
        cy.get("[data-cy=parent-last_name-input]").fastType(parent.last_name);
        cy.get("[data-cy=parent-relationship-select]").click();
        cy.get(`[data-value=${parent.relationship}]`).click();
        cy.get("[data-cy=parent-email-input]").fastType(parent.email);
        cy.get("[data-cy=parent-phone_number-input]").fastType(parent.phone_number);
        cy.get("[data-cy=nextButton]").should("not.be.disabled");
    });

    it("Fills out optional parent fields", () => {
        cy.get("[data-cy=parent-gender-select]").click();
        cy.get(`[data-value=${parent.gender}]`).click();
        cy.get("[data-cy=parent-birth_date-input]").fastType(parent.birth_date);
        cy.get("[data-cy=parent-address-input]").fastType(parent.address);
        cy.get("[data-cy=parent-city-input]").fastType(parent.city);
        cy.get("[data-cy=parent-state]").fastType(parent.state);
        cy.get(`[data-cy="parent.state-${parent.state}"]`).click();
        cy.get("[data-cy=parent-zipcode-input]").fastType(parent.zipcode);
        cy.get("[data-cy=nextButton]").should("not.be.disabled");
    });
});
