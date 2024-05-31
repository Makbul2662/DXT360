Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Cash Bank Payment', () => {
  it('passed', () => {
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('GET', '**/accounting/coa*').as('coaListCall')
    cy.intercept('POST', '**/accounting/ap-payment').as('createPaymentCall')
    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('li > #sidebar_system').should('be.visible')
      cy.get('#sidebar_cash_bank').click({ force: true })
      cy.get('#sidebar_payment').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //ADD DATA
    cy.get('#btn_add').click()
    cy.wait(2000).get('#input_customer_type').select('Company')
    cy.wait('@companyContactListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('.multiselect__select').click({ force: true, multiple: true })
      cy.wait(2000).get('#input_customer-0').click()
    })
    cy.wait(2000).get('#input_notes').type('notes')
    cy.get('#input_date').type('2024-01-22')
    cy.get('#input_source').type('source 1 test')
    cy.wait('@coaListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_account').select('101.01.401 - KAS WASERDA PUSAT')
    })
    cy.get('#input_payment_type').select('Default')
    cy.get('#input_memo_0').type('memo 1')
    cy.get('#input_received_0').clear()
    cy.get('#input_received_0').type('10000')
    cy.get('#input_check_0').click({ force: true })
    cy.get('#btn_submit').click()
    cy.wait('@createPaymentCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
    })

  })
})