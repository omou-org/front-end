const { cyan } = require("@material-ui/core/colors");

describe("Only admin and instructors should be able to see the list of enrolled students", () => {
    before(() => {
        cy.fixture("courses.json").then(({ geometry }) => {

        }) 
    })
});