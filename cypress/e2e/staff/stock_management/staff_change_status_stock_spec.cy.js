Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Inventory Change Status Stock', () => {
  it('passed', () => {
    cy.intercept('GET', '**/inventory/stocks/histories*').as('stockHistoryListCall')
    cy.intercept('GET', '**/inventory/stocks*').as('stockListCall')
    cy.intercept('POST', '**/inventory/stocks/histories').as('stockHistoryCreateCall')

    cy.Login(Cypress.env('EMAIL_STAFF_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_inventory').click({ force: true })
      cy.get('.dropdown').should('be.visible')
      cy.get('#sidebar_convert_stock').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //SEARCH DATA
    const additionalVal = Math.floor(Math.random() * 900) + 100
    cy.get('#input_search').type('FRESHMILK GREENFIELD')
    cy.wait('@stockHistoryListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="2"]').should('contain', 'FRESHMILK GREENFIELD')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type('oli mesin')
    cy.wait('@stockHistoryListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()
    //ADD DATA
    cy.get('#btn_add').click()
    cy.get('#input_reference').type(`REF-${additionalVal}`)
    cy.wait('@stockListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('#input_part_0').type('FM-001{enter}', { force: true })
    })

    cy.wait(1000).get('#input_description_0').should('be.disabled')
    cy.get('#input_unit_0').should('be.disabled')
    cy.get('#input_price_0').should('be.disabled')
    cy.get('#input_stock_0').should('be.disabled')
    cy.get('#input_qtyChange_0').clear()
    cy.get('#input_qtyChange_0').type('1')
    cy.get('#button_submit').should('be.visible')
    cy.get('#button_submit').click()
    cy.wait('@stockHistoryCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
    })
  })
})