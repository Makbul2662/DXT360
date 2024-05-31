Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Inventory Unit Return', () => {
  it('passed', () => {
    cy.intercept('GET', '**/inventory/stocks*').as('stockListCall')
    cy.intercept('GET', '**/inventory/receive-orders').as('roListCall')
    cy.intercept('POST', '**/inventory/returns').as('returnCreateCall')
    cy.intercept('GET', '**/inventory/returns/*').as('returnDetailCall')

    cy.Login(Cypress.env('EMAIL_UNIT_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_inventory').click({ force: true })
      cy.get('#sidebar_return').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //SEARCH DATA
    // cy.wait(1000).get('#input_search').type('002')
    // cy.wait(2000).get('tbody > :nth-child(1) > [aria-colindex="2"]').should('contain', 'RET/2024-01-15/0006/00000002')
    // cy.wait(1000).get('#input_search').clear()
    // cy.wait(1000).get('#input_search').type('01000000')
    // cy.wait(1500).get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    // cy.wait(500).get('#input_search').clear()
    //ADD DATA
    const additionalVal = Math.floor(Math.random() * 900) + 100
    cy.get('#btn_add').click()
    cy.wait('@stockListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@roListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.get('#input_no_reference').type(`REF-${additionalVal}`)
    cy.get('#input_date').type('2024-01-25')
    cy.get('#input_receive_order').find('option').eq(0).invoke('val').then((value) => {
      cy.get('#input_receive_order').select(value)
    })
    cy.get('#input_reason_return').type(`reason-${additionalVal}`)
    cy.get('#input_note').type(`note-${additionalVal}`)
    cy.get('.multiselect__tags').should('be.visible')
    cy.get('#input_part_0').type('You{enter}', { force: true })
    cy.get('#input_description_0').should('be.disabled')
    cy.get('#input_unit_0').should('be.disabled')
    cy.get('#input_actual_price_0').should('be.disabled')
    cy.get('#input_quantity_0').clear()
    cy.get('#input_quantity_0').type('1')
    cy.get('#input_price_0').type('9000')
    cy.get('#button_submit').should('be.visible')
    cy.get('#button_submit').click()
    cy.wait('@returnCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
    })

    //DETAIL
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_detail_0').click()
    cy.wait('@returnDetailCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.get('#input_no_reference').should('be.disabled')
    cy.get('#input_date').should('be.disabled')
    cy.get('#input_receive_order').should('be.disabled')
    cy.get('#input_reason_return').should('be.disabled')
    cy.get('#input_note').should('be.disabled')
    cy.get('#input_description_0').should('be.disabled')
    cy.get('#input_unit_0').should('be.disabled')
    cy.get('#input_actual_price_0').should('be.disabled')
    cy.get('#input_quantity_0').should('be.disabled')
    cy.get('#input_price_0').should('be.disabled')
    cy.get('#button_back').click()
  })
})