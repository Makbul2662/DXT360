Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Cash & Bank', () => {
  it('passed', () => {
    cy.intercept('GET', '**/accounting/banks*').as('bankListCall')
    cy.intercept('GET', '**/accounting/coa*').as('coaListCall')
    cy.intercept('POST', '**/accounting/banks').as('coaCreateCall')
    cy.intercept('PUT', '**/accounting/banks/*').as('coaUpdateCall')
    cy.intercept('DELETE', '**/accounting/banks/*').as('coaDeleteCall')
    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('li > #sidebar_system').should('be.visible')
      cy.get('#sidebar_cash_bank').click({ force: true })
      cy.get('#sidebar_laporan_umur_hutang').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //SEARCH DATA
    cy.get('#input_search').type('DBS')
    cy.wait('@bankListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('[aria-rowindex="1"] > [aria-colindex="2"]').should('contain', 'DBS')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type('SOS')
    cy.wait('@bankListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()
    //ADD DATA
    cy.get('#btn_add').click()
    cy.get('#modal_form').should('be.visible')
    cy.get('#input_bank_account_name').type('JAGO')
    cy.get('#input_bank_description').type('BANK JAGO')
    cy.get('#input_bank_account_number').type('720335442')
    cy.get('#input_id_coa').select('101.05.102 - BNI 890089018')
    cy.get('#input_holding').type('ang kok bin')
    cy.get('#button_submit').click()
    cy.wait('@coaCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
    })
    //EDIT DATA
    cy.get('#input_search').type('BANK JAGO')
    cy.wait('@bankListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#btn_dropdown_0__BV_toggle_').click()
      cy.get('#btn_edit_0').click()
    })
    cy.get('#modal_form').should('be.visible')
    cy.get('#input_bank_account_name').clear()
    cy.get('#input_bank_account_name').type('JAGO EDIT')
    cy.get('#input_bank_description').clear()
    cy.get('#input_bank_description').type('BANK JAGO EDIT')
    cy.get('#input_bank_account_number').clear()
    cy.get('#input_bank_account_number').type('720335442')
    cy.get('#input_id_coa').invoke('val', '')
    cy.get('#input_id_coa').select('101.05.102 - BNI 890089018')
    cy.get('#input_holding').clear()
    cy.get('#input_holding').type('ang kok bin')
    cy.get('#button_submit').click()
    cy.wait('@coaUpdateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('#input_search').clear()
    })
    //DELETE DATA
    cy.get('#input_search').type('BANK JAGO EDIT')
    cy.wait('@bankListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#btn_dropdown_0__BV_toggle_').click()
      cy.get('#btn_delete_0').click()
    })
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.wait('@coaDeleteCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('#input_search').clear()
    })
  })
})