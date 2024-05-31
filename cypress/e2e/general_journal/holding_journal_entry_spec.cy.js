Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Journal Entry', () => {
  it('passed', () => {
    cy.intercept('GET', '**/accounting/coa').as('coaListCall')
    cy.intercept('GET', '**/accounting/gl').as('jurnalCreateCall')
    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_general').click({ force: true })
      cy.get('#sidebar_jurnal_entry').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //ADD DATA
    cy.get('#btn_add').click()
    const additionalVal = Math.floor(Math.random() * 900) + 100
    cy.get('#input_reference').type(`ref-${additionalVal}`)
    cy.get('#input_date').type('2024-01-22')
    cy.get('#input_desc').type(`desc-${additionalVal}`)
    cy.get('#input_note').type(`note-${additionalVal}`)
    cy.wait('@coaListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_coa_0').select('104.01.101 - PIUTANG CAFE PUSAT')
    })
    cy.get('#input_debit_0').type('3000')
    cy.get('#input_source_0').type('SOURCE 1')
    cy.get('#input_memo_0').type('MEMO 1')
    cy.get('#input_coa_1').select('301.01.011 - HUTANG DAGANG CAFE PUSAT')
    cy.get('#input_credit_1').type('3000')
    cy.get('#input_source_1').type('SOURCE 2')
    cy.get('#input_memo_1').type('MEMO 2')
    cy.get('.btn-primary').click()
    cy.get('.swal2-popup').should('be.visible')
  })
})