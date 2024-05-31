Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Account Type', () => {
  it('passed', () => {
    cy.intercept('GET', '**/accounting/types*').as('accountTypeListCall')
    cy.intercept('POST', '**/accounting/types').as('accountTypeCreateCall')
    cy.intercept('PUT', '**/accounting/types/*').as('accountTypeUpdateCall')
    cy.intercept('DELETE', '**/accounting/types/*').as('accountTypeDeleteCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_general').click({ force: true })
      cy.get('#sidebar_account_type').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //SEARCH DATA
    cy.get('#input_search').type('Aktiva')
    cy.wait('@accountTypeListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('[aria-rowindex="1"] > .text-center').contains('Aktiva')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type('Taxing')
    cy.wait('@accountTypeListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()
    //ADD DATA
    cy.get('#btn_add').click()
    cy.get('#modal_form').should('be.visible')
    cy.get('#input_account_type').type('Benefit')
    cy.get('#button_submit').click()
    cy.wait('@accountTypeCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('[aria-rowindex="1"] > .text-center').contains('Benefit')
    })
    //EDIT DATA
    cy.get('#btn_dropdown_0__BV_toggle_').click()
    cy.get('#btn_edit_0').click()
    cy.get('#modal_form').should('be.visible')
    cy.get('#input_account_type').clear()
    cy.get('#input_account_type').type('Benefit Edit')
    cy.get('#button_submit').click()
    cy.wait('@accountTypeUpdateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('[aria-rowindex="1"] > .text-center').contains('Benefit Edit')
    })
    //DELETE DATA
    cy.get('#btn_dropdown_0__BV_toggle_').click()
    cy.get('#btn_delete_0').click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.wait('@accountTypeDeleteCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('[aria-rowindex="1"] > .text-center').should('not.contain', 'Benefit Edit')
    })
  })
})