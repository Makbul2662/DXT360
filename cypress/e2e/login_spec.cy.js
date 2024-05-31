
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Login', () => {
  it('passed', () => {
    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD'))
  })
})