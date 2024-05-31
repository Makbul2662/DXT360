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

Cypress.Commands.add('Login', (email, password) => {
  // cy.visit('/login')
  // cy.ignoreConsoleError()
  // cy.wait(500).get('#input_email_login').type(email)
  // cy.wait(500).get('#input_password_login').type(password)
  // cy.wait(500).get('#btn_submit').click()
  // cy.wait(1500).get('.swal2-popup').then(($toast) => {
  //   if ($toast.hasClass('swal2-icon-error')) {
  //     cy.get('#input_email_login').clear()
  //     cy.get('#input_email_login').type(email)
  //     cy.get('#input_password_login').clear()
  //     cy.get('#input_password_login').type(password)
  //     cy.get('#btn_submit').click()
  //   }
  // })
  let redirectUrl = 'http://staging-inventory-accounting.simkokar.com'
  cy.visit('/login')
  cy.url().should('include', '/login')

  cy.intercept('POST', '**/authentication/login').as('loginCall')

  cy.get('#input_email_login').should('be.visible')
  cy.get('#input_password_login').should('be.visible')

  cy.get('#input_email_login').type(email)
  cy.get('#input_password_login').type(password)
  cy.get('#btn_submit').click()
  cy.wait('@loginCall').then(({ response }) => {
    expect(response.statusCode).to.eq(200)
  })
  // cy.url().should('include', redirectUrl)
})

Cypress.Commands.add('ignoreConsoleError', () => {
  cy.tab()
})
