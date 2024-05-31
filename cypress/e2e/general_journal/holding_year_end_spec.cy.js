Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Year End', () => {
  it('passed', () => {
    cy.intercept('POST', '**/accounting/year-end').as('yearEndCall')
    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_general').click({ force: true })
      cy.get('#sidebar_general_year_end').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    cy.wait(500).get('h4').should('contain', 'Closing Year')
    //CREATE DATA
    cy.get('#input_start_date').type('2023-12-01')
    cy.get('#input_end_date').type('2023-12-03')
    cy.get('#input_desc').type('year end from 2023-12-01 to 2023-12-03')
    cy.get('#button_submit').click()
    cy.wait('@yearEndCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
    })
  })
})