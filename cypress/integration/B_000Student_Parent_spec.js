/* global describe */
/* global it */
/* global cy */
/* global before */

const user = {
    "admin": {
        "email": "maggie@summit.com",
        "password": "password",
    },
    "receptionist": {
        "email": "test",
        "password": "test2",
    },
};

describe("Student and Parent Registration", () => {
    before(() => {
        sessionStorage.clear();
    });

    it("Goes to Student Form", () => {
        cy.login({
            "email": user.admin.email,
            "password": user.admin.password,
        });
        cy.visit("./registration/form/student/");
    });

    it("Enters student details", () => {
        // student first name
        cy.get(".MuiCollapse-wrapperInner-379 > :nth-child(1) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click()
            .type("James");
        // student last name
        cy.get(":nth-child(2) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click()
            .type("Wan");
        // gender
        cy.get(".MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiSelect-root-339 > .MuiSelect-select-340")
            .click();
        cy.get("[data-value=\"Male\"]")
            .click();
        // grade
        cy.get(":nth-child(4) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click()
            .type("11");
        // birthday
        cy.get(".student-align > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click();
        // 2002
        cy.contains("2002").click();
        cy.contains("Dec").click();
        // day view
        cy.get(".MuiTypography-h4-16").click();
        // 7
        cy.get(":nth-child(1) > :nth-child(7) > .MuiButtonBase-root-122").click();
        cy.contains("OK").click();
        // school
        cy.get(":nth-child(6) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .type("Foothill High School");
        // phone number
        cy.get(":nth-child(7) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click()
            .type("9257310499");
        // NEXT
        cy.get(".MuiGrid-direction-xs-row-reverse-146 > .MuiGrid-item-142 > div > .MuiButtonBase-root-122").click();
    });

    it("Enters parent details", () => {
        // parent first name
        cy.get(":nth-child(2) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click()
            .type("Paula");
        // parent last name
        cy.get(":nth-child(3) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click()
            .type("Wan");
        // relationship to student
        cy.get(":nth-child(4) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiSelect-root-339 > .MuiSelect-select-340")
            .click();
        cy.get("[data-value=\"Mother\"]")
            .click();
        // gender
        cy.get(":nth-child(5) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiSelect-root-339 > .MuiSelect-select-340")
            .click();
        cy.get("[data-value=\"Male\"]")
            .click();
        // email
        cy.get(":nth-child(6) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click()
            .type("pwan007@yahoo.com");
        // phone number
        cy.get(":nth-child(7) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click()
            .type("9253418562");
        // birthday
        cy.get(".student-align > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click();
        // 1980
        cy.get(".MuiToolbar-root-73 > .MuiTypography-subtitle1-19").click();
        cy.contains("1980").click();
        cy.contains("Mar").click();
        // day view
        cy.get(".MuiTypography-h4-16").click();
        // 13
        cy.contains("13").click();
        cy.contains("OK").click();
        // address
        cy.get(":nth-child(9) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click()
            .type("123 Main St");
        // city
        cy.get(":nth-child(10) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click()
            .type("Pleasanton");
        // State
        cy.get(":nth-child(11) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click()
            .type("CA");
        // Zipcode
        cy.get(":nth-child(12) > .MuiGrid-container-141 > .MuiFormControl-root-238 > .MuiInputBase-root-273 > .MuiInputBase-input-283")
            .click()
            .type("94566");
    });

    it("Submits the form", () => {
        cy.get("[style=\"margin-left: 2%;\"] > div > .MuiButtonBase-root-122")
            .click();
        cy.contains("successfully");
    });
});
