Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Inventory Bad Stock', () => {
  it('passed', () => {
    cy.intercept('GET', '**/inventory/stocks*').as('badStockListCall')
    cy.Login(Cypress.env('EMAIL_STAFF_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_inventory').click({ force: true })
      cy.get('.dropdown').should('be.visible')
      cy.get('#sidebar_bad_stock').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    cy.get('#input_search').type('FRESHMILK GREENFIELD')
    cy.wait('@badStockListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="2"]').should('contain', 'FRESHMILK GREENFIELD')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type('oli mesin')
    cy.wait('@badStockListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()
  })
})