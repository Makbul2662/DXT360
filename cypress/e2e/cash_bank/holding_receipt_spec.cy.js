Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Cash Bank Receipt', () => {
  it('passed', () => {
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('GET', '**/accounting/coa*').as('coaListCall')
    cy.intercept('POST', '**/accounting/ar-payment').as('createReceiptCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_cash_bank').click({ force: true })
      cy.get('#sidebar_receipt').click({ force: true })
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
    cy.wait(2000).get('#input_notes').type('receipt notes')
    cy.wait('@coaListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_account').select('101.01.401 - KAS WASERDA PUSAT')
    })
    cy.get('#input_date').type('2024-01-22')
    cy.get('#input_source').type('source 1 test')
    cy.get('#input_currency').select('Indonesia Rupiah')
    cy.get('#input_memo_0').type('memo 1')
    cy.get('#input_received_0').clear()
    cy.get('#input_received_0').type('1000')
    cy.get('.mt-3 > :nth-child(1) > :nth-child(8)').scrollIntoView().should('be.visible')
    cy.get('.custom-control').should('be.visible')
    cy.get('#chk_isApplied_0').check({ force: true })
    cy.get('#btn_submit').should('be.visible')
    cy.get('#btn_submit').click({ force: true })
    cy.wait('@createReceiptCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
    })
  })
})