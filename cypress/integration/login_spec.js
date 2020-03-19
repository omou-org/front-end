/* 
Arrange - setup inital app state
    - vist a web page
    - query for an element 
Act - take action 
    - interact with that element
Assert - make an assertion 
    - Make assertion on web page
  */
describe("Login", () => {
    it("Login Failed", () => {
        cy.server()
        cy.route({
            method: 'POST',
            url: '/auth_token',
            response: '{ "detail": "Method \"GET\" not allowed."}',
            status: 400
        })

        // cy.visit('http://localhost:3000/')
        // cy.get('.email').type("asd")
        // cy.get('.password').type('asda2')
        // cy.get('[type="checkbox"]').click();
        // cy.get('[type="submit"]').click();
        // cy.contains('Invalid')

    })


    it("Login", () => {

        cy.visit('http://localhost:3000/')
        cy.get('.email').type("c@lvin.com")
        cy.get('.password').type('password')
        cy.get('[type="checkbox"]').click();
        cy.get('[type="submit"]').click();
        cy.contains('Scheduler')
    })


    // it('Creates a new category', () => {
    //     let word = "Science 2"
    //     cy.contains('Admin').click()
    //     cy.contains('Manage').click()
    //     cy.contains('COURSE CATEGORIES').click()
    //     cy.get('.MuiInputBase-root-209 > .MuiInputBase-input-219').type(word)
    //     cy.get('.MuiPrivateTextarea-root-475 > .MuiInputBase-input-219').type(`This is a ${word} class`)
    //     cy.contains('Add Category').click()
    //     cy.wait(500)
    //     cy.contains(word)

    // })

    it("Type a note in Students Profile", () => {
        cy.contains('Accounts').click()
        cy.contains('STUDENT').click()
        cy.contains('Jesus Christ').click()
        cy.contains('Past Course(s)').click()
        cy.contains('Parent Contact').click()
        cy.contains('Notes').click()
        cy.contains('Add Note').click()
        cy.get('#standard-name').type("dude wtf")
        cy.get('.note-body').type("YO CAN YOU ACTUALLY BELIEVE THIS WORKS")

    })

    // it("Logout", function () {
    //     cy.get('.logout-icon').click();
    //     cy.contains("sign in")

    // })

})

