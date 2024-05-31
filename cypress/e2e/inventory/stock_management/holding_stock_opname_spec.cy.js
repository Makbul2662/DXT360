Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Inventory Stock Management Stock Opname', () => {
  it('passed', () => {
    cy.intercept('GET', '**/inventory/stock-opnames*').as('stockOpnameListCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_inventory').click({ force: true })
      cy.get('#sidebar_stock_opname').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //SEARCH DATA
    cy.get('#input_search').type('sto')
    cy.wait('@stockOpnameListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="2"]').should('contain', 'STO')
    })

    cy.get('#input_search').clear()
    cy.get('#input_search').type('INVSO')
    cy.wait('@stockOpnameListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()
  })
})