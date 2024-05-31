Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Statem Stock Limiter', () => {
  it('passed', () => {
    cy.intercept('GET', '**/inventory/stock-limiters*').as('stockLimiterListCall')
    cy.intercept('GET', '**/inventory/parts*').as('partListCall')
    cy.intercept('GET', '**/koperasi/access/organization').as('organizationListCall')
    cy.intercept('GET', '**/koperasi/access/outlet*').as('ouletListCall')
    cy.intercept('POST', '**/inventory/stock-limiters').as('stockLimiterCreateCall')
    cy.intercept('PUT', '**/inventory/stock-limiters/*').as('stockLimiterUpdateCall')
    cy.intercept('GET', '**/inventory/stock-limiters/*').as('stockLimiterDetailCall')
    cy.intercept('DELETE', '**/inventory/stock-limiters/*').as('stockLimiterDeleteCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_system').should('be.visible')
      cy.get('#sidebar_system').click({ force: true })
      cy.get('#sidebar_system_part_quantity_limiter').click({ force: true })
    })
    cy.reload().then(() => {
      cy.wait(500).get('body').click()
    })

    //create new data stock limiter
    cy.get('.head-wrapper > .btn').click()
    cy.get('#input_branch').select('Rumah Sakit Hermina Bogor')
    cy.get('#input_outlet_type').select('Waserda')
    cy.wait('@ouletListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('.multiselect').click({ force: true, multiple: true })
      cy.get('.multiselect__select').click({ force: true, multiple: true })
      cy.get('#validator_outlet > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#input_outlet-0').click()
    })
    cy.wait('@partListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('#validator_part_0 > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#input_part_0-0').click()
    })
    cy.get('#input_unit_0').find('option').eq(0).invoke('val').then((val) => {
      cy.get('#input_unit_0').select(val)
    })
    cy.get('#input_min_0').type('1')
    cy.get('#input_max_0').type('100')
    cy.get('#button_submit').click()
    cy.wait('@stockLimiterCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > :nth-child(1) > [aria-colindex="1"]').should('contain', 'Rumah Sakit Hermina Bogor')
    })

    // Edit data stock limiter
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_edit_0').click()
    cy.wait('@stockLimiterDetailCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_branch').invoke('val', '')
      cy.get('#input_branch').select('Rumah Sakit Hermina Jatinegara')
      cy.get('#input_outlet_type').invoke('val', '')
      cy.get('#input_outlet_type').select('Gudang Umum')
    })
    cy.wait('@ouletListCall').then(({ response }) => {
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('.multiselect').click({ force: true, multiple: true })
      cy.get('.multiselect__select').click({ force: true, multiple: true })
      cy.get('#validator_outlet > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#input_outlet-0').click()
    })
    cy.wait('@partListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('#validator_part_0 > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#input_part_0-0').click()
    })
    cy.wait('@partListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('#validator_part_0 > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#input_part_0-0').click()
    })
    cy.get('#input_unit_0').invoke('val', '')
    cy.get('#input_unit_0').find('option').eq(0).invoke('val').then((val) => {
      cy.get('#input_unit_0').select(val)
    })
    cy.get('#input_min_0').clear()
    cy.get('#input_min_0').type('1')
    cy.get('#input_max_0').clear()
    cy.get('#input_max_0').type('100')
    cy.get('#button_submit').click()
    cy.wait('@stockLimiterUpdateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('tbody > :nth-child(1) > [aria-colindex="1"]').should('contain', 'Rumah Sakit Hermina Jatinegara')
    })
    // Delete data stock limiter
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_delete_0').click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.wait('@stockLimiterDeleteCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.wait(1000).get('tbody > :nth-child(1) > [aria-colindex="1"]').should('not.contain', 'Rumah Sakit Hermina Jatinegara')
    })
  })
})