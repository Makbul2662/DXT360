Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Inventory Unit Inquiries', () => {
  it('passed', () => {
    cy.intercept('GET', '**/inventory/stocks*').as('stockListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('GET', '**/inventory/taxes').as('taxesListCall')
    cy.intercept('POST', '**/inventory/inquiries').as('inquiryCreateCall')
    cy.intercept('GET', '**/inventory/inquiries/*').as('inquiryDetailCall')

    cy.Login(Cypress.env('EMAIL_UNIT_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_sales_order').click({ force: true })
      cy.get('#submenu_inquiries').click({ force: true })
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
    cy.wait('@taxesListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.get('#input_customer_type').select('Company')
    cy.get('.multiselect__tags').should('be.visible')
    cy.get('.multiselect').click({ force: true, multiple: true })
    cy.get('.multiselect__option').eq(0).click({ force: true })
    cy.get('.multiselect__select').click({ force: true, multiple: true })
    cy.get('#input_customer-0').click({ force: true })
    cy.get('#input_shipping_point').type('Hermina Cafe')
    cy.get('#input_inquiries_date').type('2024-01-25')
    cy.get('#input_required_by').type('2024-02-25')
    cy.get('#input_part_0').type('You{enter}', { force: true })
    cy.get('#input_description_0').should('be.disabled')
    cy.get('#input_quantity_0').clear()
    cy.get('#input_quantity_0').type('1')
    cy.get('#input_unit_0').should('be.disabled')
    cy.get('#input_on_hand_0').should('be.disabled')
    cy.get('#input_cogs_0').should('be.disabled')
    cy.get('#input_price_0').should('be.disabled')
    cy.get('#input_discount_0').clear()
    cy.get('#input_discount_0').type('1')
    cy.get('#input_extend_0').should('be.disabled')
    cy.get('#input_tax_form_0').click({ force: true })
    cy.get('#input_notes').type(`notes-${additionalVal}`)
    cy.get('#input_internal_notes').type(`internal-notes-${additionalVal}`)
    cy.get('#button_save').click({ force: true })
    cy.wait('@inquiryCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    //DETAIL
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_detail_0').click()
    cy.wait('@stockListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@companyContactListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@taxesListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@inquiryDetailCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.get('#input_customer_type').should('be.disabled')
    cy.get('#input_shipping_point').should('be.disabled')
    cy.get('#input_inquiries_date').should('be.disabled')
    cy.get('#input_required_by').should('be.disabled')
    cy.get('#input_part_0').should('be.disabled')
    cy.get('#input_description_0').should('be.disabled')
    cy.get('#input_quantity_0').should('be.disabled')
    cy.get('#input_unit_0').should('be.disabled')
    cy.get('#input_on_hand_0').should('be.disabled')
    cy.get('#input_cogs_0').should('be.disabled')
    cy.get('#input_price_0').should('be.disabled')
    cy.get('#input_discount_0').should('be.disabled')
    cy.get('#input_extend_0').should('be.disabled')
    cy.get('#input_tax_form_0').should('be.disabled')
    cy.get('#input_notes').should('be.disabled')
    cy.get('#input_internal_notes').should('be.disabled')
    cy.get('#button_cancel').click({ force: true })
  })
})