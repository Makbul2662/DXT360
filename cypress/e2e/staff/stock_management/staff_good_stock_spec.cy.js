Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Inventory Good Stock', () => {
  it('passed', () => {
    cy.intercept('GET', '**/inventory/stocks*').as('GoodStockListCall')
    cy.Login(Cypress.env('EMAIL_STAFF_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_inventory').click({ force: true })
      cy.get('.dropdown').should('be.visible')
      cy.get('#sidebar_good_stock').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //SEARCH DATA
    cy.get('#input_search').type('FRESHMILK GREENFIELD')
    cy.wait('@GoodStockListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="2"]').should('contain', 'FRESHMILK GREENFIELD')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type('oli mesin')
    cy.wait('@GoodStockListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()
  })
})