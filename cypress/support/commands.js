// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-plugin-tab'
import "cypress-real-events/support"
Cypress.Commands.add('ValidationTopTrends', () => {
  cy.get('.my-masonry-grid', { timeout: 10000 })
  .find('.my-masonry-grid_column > div')
  .should('be.visible')
  // .should('have.length', 20).as('Show 20 top trends')
  .then($elements => {
    const numberOfItems = $elements.length;
    // Validatite if item < 20
    if (numberOfItems < 20) {
      cy.log(`Warning: Expected 20 items but found ${numberOfItems}.`)
      expect(numberOfItems).to.be.at.least(1)
    }
    else 
    {
    // Validate item has 20 item
      expect(numberOfItems).to.be.at.least(20)
    }
    })
})


Cypress.Commands.add('ignoreConsoleError', () => {
  cy.tab()
})
