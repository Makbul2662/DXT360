Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Chart Of Account', () => {
  it('passed', () => {
    cy.intercept('GET', '**/accounting/coa*').as('coaListCall')
    cy.intercept('GET', '**/accounting/types*').as('typeListCall')
    cy.intercept('GET', '**/accounting/headings*').as('headingListCall')
    cy.intercept('GET', '**/accounting/access-rights*').as('accessRightListCall')
    cy.intercept('POST', '**/accounting/coa').as('coaCreateCall')
    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_general').click({ force: true })
      cy.get('#sidebar_coa').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    cy.get('#input_search').type('PC SP KEMAYORAN')
    cy.wait('@coaListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > :nth-child(1) > [aria-colindex="2"]').should('contain', 'PC SP KEMAYORAN')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type('FIXING')
    cy.wait('@coaListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()

    cy.get('#btn_add').click()
    cy.get('#button_account').click()
    const additionalVal = Math.floor(Math.random() * 900) + 100
    cy.get('h4').should('contain', 'Account')
    cy.get('#input_account_number_coa').type(`999.99.${additionalVal}`)
    cy.get('#input_desc_coa').type(`E2E ACCOUNT ${additionalVal}`)
    cy.get('#input_heading_coa').select('100.00.000 - AKTIVA LANCAR')
    cy.get('#input_account_type_coa').select('Aktiva')
    cy.get('#input_options_coa > :nth-child(1)').click()
    cy.get('#input_summary_coa').select('AP')
    cy.get('#input_organization_coa').select('KOKARMINA')
    cy.get('#button_submit_COA').click()
    cy.wait('@coaCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
    })
  })
})