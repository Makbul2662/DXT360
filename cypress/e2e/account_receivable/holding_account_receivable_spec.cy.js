Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Account Receivable', () => {
  it('passed', () => {
    cy.intercept('GET', '**/accounting/ar*').as('arListCall')
    cy.intercept('GET', '**/inventory/taxes').as('taxesListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('GET', '**/accounting/coa*').as('coaListCall')
    cy.intercept('POST', '**/accounting/ar-transaction').as('arCreateCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_account_receiveable').click({ force: true })
      cy.get('#sidebar_pencatatan_piutang').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //SEARCH DATA
    cy.get('#input_search').type('AR')
    cy.wait('@arListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > :nth-child(1) > [aria-colindex="4"]').should('contain', 'AR/2024/01/10/0028')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type('TWZ')
    cy.wait('@arListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()
    //ADD DATA
    cy.get('.head-wrapper > .btn').click()
    const additionalVal = Math.floor(Math.random() * 900) + 100
    cy.get('#input_customer_type').select('Company')
    cy.wait('@companyContactListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('.multiselect__select').click({ force: true, multiple: true })
      cy.wait(2000).get('#input_customer-0').click()
    })
    cy.get('#input_currency').select('Indonesia Rupiah')
    cy.get('#input_description').type(`desc-${additionalVal}`)
    cy.get('#input_notes').type(`notes-${additionalVal}`)
    cy.get('#input_order_number').type(`OR-AR-${additionalVal}`)
    cy.get('#input_due_date').type('2024-02-12')
    cy.get('#input_po_number').type(`PO-AR-${additionalVal}`)
    cy.get('#input_internal_notes').type(`internal-notes-${additionalVal}`)
    cy.get('#input_amount_0').clear()
    cy.get('#input_amount_0').type(5000)
    cy.get('#input_coa_0').select('601.01.001 - PENDAPATAN WASERDA PUSAT')
    cy.get('#input_description_0').type(`item desc ${additionalVal}`)
    cy.get('.custom-control').click()
    cy.get('#input_tax_0').select('PPN MASUKAN')
    cy.get('#input_income_account').select('104.01.001 - PIUTANG WASERDA PUSAT')
    cy.get('#btn_submit').click()
    cy.wait('@arCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
    })
  })
})