Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Inventory Unit Shipping', () => {
  it('passed', () => {
    cy.intercept('GET', '**/inventory/stocks*').as('stockListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('GET', '**/inventory/taxes').as('taxesListCall')
    cy.intercept('GET', '**/inventory/sales-orders').as('salesOrderCreateCall')
    cy.intercept('POST', '**/inventory/shippings').as('shippingCreateCall')
    cy.intercept('GET', '**/inventory/shippings/*').as('shippingDetailCall')
    cy.intercept('POST', '**/inventory/post-shippings/*').as('postToAccountingCall')

    cy.Login(Cypress.env('EMAIL_UNIT_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_sales_order').click({ force: true })
      cy.get('#submenu_shipping').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    const additionalVal = Math.floor(Math.random() * 900) + 100
    //ADD DATA
    cy.get('#btn_add').click()
    cy.wait('@stockListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@companyContactListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@taxesListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@salesOrderCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.get('#input_no_sales_order').find('option').eq(0).invoke('val').then((value) => {
      cy.get('#input_no_sales_order').select(value)
    })
    cy.get('#input_customer').should('be.disabled')
    cy.get('#input_shipping_point').should('be.disabled')
    cy.get('#input_ship_via').type('JNE')
    cy.get('#input_shipping_date').type('2024-01-25')
    cy.get('#input_shipping_number').type(`ship-${additionalVal}`)
    cy.get('#input_part_0').should('be.disabled')
    cy.get('#input_description_0').should('be.disabled')
    cy.get('#input_quantity_0').should('be.visible')
    cy.get('#input_unit_0').should('be.disabled')
    cy.get('#input_cogs_0').should('be.disabled')
    cy.get('#input_price_0').should('be.disabled')
    cy.get('#input_discount_0').should('be.disabled')
    cy.get('#button_save').click({ force: true })
    cy.wait('@shippingCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
    })
    //DETAIL
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_detail_0').click()
    cy.wait('@stockListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@taxesListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@salesOrderCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@shippingDetailCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.get('#input_no_sales_order').should('be.disabled')
    cy.get('#input_customer').should('be.disabled')
    cy.get('#input_shipping_point').should('be.disabled')
    cy.get('#input_ship_via').should('be.disabled')
    cy.get('#input_shipping_date').should('be.disabled')
    cy.get('#input_shipping_number').should('be.disabled')
    cy.get('#input_part_0').should('be.disabled')
    cy.get('#input_description_0').should('be.disabled')
    cy.get('#input_quantity_0').should('be.visible')
    cy.get('#input_unit_0').should('be.disabled')
    cy.get('#input_cogs_0').should('be.disabled')
    cy.get('#input_price_0').should('be.disabled')
    cy.get('#input_discount_0').should('be.disabled')
    cy.get('#button_cancel').should('be.visible')
    cy.get('#button_cancel').click({ force: true })
    //POST TO ACCOUNTING
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_post_to_accounting_0').click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.get('.swal2-popup').should('be.visible')
  })
})