const removeDashes = (phoneNumber) => phoneNumber.replace(/-/ug, "");

describe("Fills out form", () => {
    before(() => {
        cy.visit("registration/form/student");
        cy.login();
    });

    it("Loads page properly", () => {
        cy.get("[data-cy=nextButton]").should("be.disabled");
    });

    it("Fills out required student fields", () => {
        cy.fixture("users.json").then(({student}) => {
            cy.get("[data-cy=student-first_name-input]")
                .fastType(student.first_name);
            cy.get("[data-cy=student-last_name-input]")
                .fastType(student.last_name);
            cy.get("[data-cy=nextButton]").should("not.be.disabled");
        });
    });

    it("Errors on invalid input", () => {
        cy.get("[data-cy=student-grade-input]").fastType("a");
        cy.get("[data-cy=nextButton]").should("be.disabled");
        cy.get("[data-cy=student-grade-input]").clear();
    });

    it("Fills out optional student fields", () => {
        cy.fixture("users.json").then(({student}) => {
            cy.get("[data-cy=student-gender-select]").click();
            cy.get(`[data-value=${student.gender}]`).click();
            cy.get("[data-cy=student-grade-input]").fastType(student.grade);
            cy.get("[data-cy=student-birthday-input]")
                .fastType(student.birth_date);
            cy.get("[data-cy=student-school-input]").fastType(student.school);
            cy.get("[data-cy=student-phone_number-input")
                .fastType(student.phone_number);
            cy.get("[data-cy=nextButton]").should("not.be.disabled");
        });
    });

    it("Goes to next section", () => {
        cy.get("[data-cy=nextButton]").click();
        cy.get("[data-cy=submitButton]").should("be.disabled");
    });

    it("Can go back", () => {
        cy.get("[data-cy=backButton]").click();
        cy.get("[data-cy=nextButton]").click();
    });

    it("Fills out required parent fields", () => {
        cy.fixture("users.json").then(({parent}) => {
            cy.get("[data-cy=parent-first_name-input]")
                .fastType(parent.first_name);
            cy.get("[data-cy=parent-last_name-input]")
                .fastType(parent.last_name);
            cy.get("[data-cy=parent-relationship-select]").click();
            cy.get(`[data-value=${parent.relationship}]`).click();
            cy.get("[data-cy=parent-email-input]").fastType(parent.email);
            cy.get("[data-cy=parent-phone_number-input]")
                .fastType(parent.phone_number);
            cy.get("[data-cy=submitButton]").should("not.be.disabled");
        });
    });

    it("Fills out optional parent fields", () => {
        cy.fixture("users.json").then(({parent}) => {
            cy.get("[data-cy=parent-gender-select]").click();
            cy.get(`[data-value=${parent.gender}]`).click();
            cy.get("[data-cy=parent-birthday-input]")
                .fastType(parent.birth_date);
            cy.get("[data-cy=parent-address-input]").fastType(parent.address);
            cy.get("[data-cy=parent-city-input]").fastType(parent.city);
            cy.get("[data-cy=parent-state]").fastType(parent.state);
            cy.get(`[data-cy="parent.state-${parent.state}"]`).click();
            cy.get("[data-cy=parent-zipcode-input]").fastType(parent.zipcode);
            cy.get("[data-cy=submitButton]").should("not.be.disabled");
        });
    });

    it("Submits form", () => {
        cy.fixture("users.json").then(({student, parent}) => {
            cy.server({"force404": true});
            cy.route({
                "method": "POST",
                "response": {
                    "user": {
                        "id": student.id,
                        "email": "",
                        "first_name": student.first_name,
                        "last_name": student.las_name,
                    },
                    "user_uuid": null,
                    "gender": student.gender,
                    "birth_date": student.birth_date,
                    "address": parent.address,
                    "city": parent.city,
                    "phone_number": student.phone_number.replace("-", ""),
                    "state": parent.state,
                    "zipcode": parent.zipcode,
                    "grade": student.grade,
                    "school": student.school,
                    "primary_parent": parent.id,
                    "secondary_parent": null,
                    "enrollment_id_list": [],
                    "account_type": "student",
                },
                "status": 200,
                "url": "/account/student/",
                "responseType": "application/json",
            });
            cy.route({
                "method": "POST",
                "response": {
                    "user": {
                        "id": student.id,
                        "email": "",
                        "first_name": student.first_name,
                        "last_name": student.las_name,
                    },
                    "user_uuid": null,
                    "gender": student.gender,
                    "birth_date": student.birth_date,
                    "address": parent.address,
                    "city": parent.city,
                    "phone_number": removeDashes(student.phone_number),
                    "state": parent.state,
                    "zipcode": parent.zipcode,
                    "grade": 10,
                    "school": "Standup HS",
                    "primary_parent": parent.id,
                    "secondary_parent": null,
                    "enrollment_id_list": [],
                    "account_type": "student",
                },
                "status": 200,
                "url": "/account/parent/",
                "responseType": "application/json",
            });
            cy.get("[data-cy=submitButton]").click();
            cy.get("[data-cy=submittedContainer]");
        });
    });
});
