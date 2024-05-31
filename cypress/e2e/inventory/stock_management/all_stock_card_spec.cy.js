Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Inventory Stock Management Stock Card', () => {
  it('passed', () => {
    cy.intercept('GET', '**/inventory/stocks*').as('partListCall')
    cy.intercept('GET', '**/koperasi/access/outlet*').as('outletListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('GET', '**/inventory/card-stocks*').as('cardStockListCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('li > #sidebar_system').should('be.visible')
      cy.get('#sidebar_inventory').click({ force: true })
      cy.get('#sidebar_card_stock').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //FILTERING DATA
    // cy.wait('@partListCall').then(({ response }) => {
    //   expect(response.statusCode).to.eq(200)
    //   cy.get('#input_part').find('option').eq(0).invoke('val').then((val) => {
    //     cy.get('#input_part').select(val)
    //   })
    // })
    // cy.get('#btn_filter').click()
    // cy.wait('@cardStockListCall').then(({ response }) => {
    //   expect(response.statusCode).to.eq(200)
    //   cy.get('tbody > tr > [aria-colindex="4"]').should('exist')
    // })
    // cy.get('#btn_reset_filter').click()
  })
})