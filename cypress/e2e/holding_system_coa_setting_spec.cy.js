Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Coa Setting', () => {
  it('passed', () => {
    cy.intercept('GET', '**/inventory/outlets*').as('outletListCall')
    cy.intercept('GET', '**/accounting/coa*').as('coaListCall')
    cy.intercept('GET', '**/inventory/outlet_coa_configurations*').as('coaConfigListCall')
    cy.intercept('POST', '**/inventory/outlet_coa_configurations').as('coaConfigCreateCall')
    cy.intercept('GET', '**/inventory/outlet_coa_configurations/*').as('coaConfigDetailCall')
    cy.intercept('PUT', '**/inventory/outlet_coa_configurations/*').as('coaConfigUpdateCall')
    cy.intercept('DELETE', '**/inventory/outlet_coa_configurations/*').as('coaConfigDeleteCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('li > #sidebar_system').should('be.visible')
      cy.get('#sidebar_system').click({ force: true })
      cy.get('#sidebar_coa_setting').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //SEARCH DATA
    cy.get('#input_search').type('cafe')
    cy.wait('@coaConfigListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="2"]').contains('Cafe Pasteur')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type('XXX')
    cy.wait('@coaConfigListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()

    //? ADD DATA
    cy.get('.head-wrapper > .btn').click()
    cy.wait('@coaListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.get('#input_name').type('automation test coa config')
    cy.wait('@outletListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('.multiselect').click({ force: true, multiple: true })
      cy.get('.multiselect__select').click({ force: true, multiple: true })
      cy.get('#validator_outlet > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#input_outlet-0').click()
    })
    cy.get('.multiselect__tags').should('be.visible')
    cy.get('input').should('be.visible')
    cy.wait('@coaListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_coa_supply').type('111.01.021{enter}', { force: true })
      cy.get('#input_coa_cost').type('701.01.021{enter}', { force: true })
      cy.get('#input_coa_debt').type('301.01.121{enter}', { force: true })
      cy.get('#input_coa_income').type('601.01.021{enter}', { force: true })
      cy.get('#input_coa_cogs').type('701.01.021{enter}', { force: true })
      cy.get('#input_coa_cash').type('101.01.421{enter}', { force: true })
      cy.get('#input_coa_receivable').type('104.01.021{enter}', { force: true })
    })
    cy.get('#btn_submit').click()
    cy.wait('@coaConfigCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="2"]').contains('automation test coa config')
    })
    //? END ADD DATA

    //? EDIT DATA
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_edit_0').click()
    cy.wait('@coaListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@coaConfigDetailCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_name').clear()
      cy.get('#input_name').type('automation test coa config update')
    })
    cy.get('#input_outlet').invoke('val', '')
    cy.wait('@outletListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('.multiselect').click({ force: true, multiple: true })
      cy.get('.multiselect__select').click({ force: true, multiple: true })
      cy.get('#validator_outlet > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#input_outlet-0').click()
      cy.get('#validator_outlet > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#input_outlet-0').click()
    })
    cy.get('.multiselect__tags').should('be.visible')
    cy.get('input').should('be.visible')
    cy.wait('@coaListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_coa_supply').clear({ force: true })
      cy.get('#input_coa_supply').type('111.01.021{enter}', { force: true })
      cy.get('#input_coa_cost').clear({ force: true })
      cy.get('#input_coa_cost').type('701.01.021{enter}', { force: true })
      cy.get('#input_coa_debt').clear({ force: true })
      cy.get('#input_coa_debt').type('301.01.121{enter}', { force: true })
      cy.get('#input_coa_income').clear({ force: true })
      cy.get('#input_coa_income').type('601.01.021{enter}', { force: true })
      cy.get('#input_coa_cogs').clear({ force: true })
      cy.get('#input_coa_cogs').type('701.01.021{enter}', { force: true })
      cy.get('#input_coa_cash').clear({ force: true })
      cy.get('#input_coa_cash').type('101.01.421{enter}', { force: true })
      cy.get('#input_coa_receivable').clear({ force: true })
      cy.get('#input_coa_receivable').type('104.01.021{enter}', { force: true })
    })
    cy.get('#btn_submit').click()
    cy.wait('@coaConfigUpdateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('tbody > tr > [aria-colindex="2"]').contains('automation test coa config update')
    })
    //? END EDIT DATA

    //? DELETE DATA
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_delete_0').click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.wait('@coaConfigDeleteCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('tbody > tr > [aria-colindex="2"]').should('not.contain.text', 'automation test coa config update')
    })
    //? END DELETE DATA
  })
})
