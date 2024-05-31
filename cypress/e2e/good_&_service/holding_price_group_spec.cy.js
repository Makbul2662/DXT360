Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Good & Service Price Group', () => {
  it('passed', () => {
    cy.intercept('GET', '**/inventory/price-groups*').as('priceGroupListCall')
    cy.intercept('POST', '**/inventory/price-groups').as('priceGroupCreateCall')
    cy.intercept('PUT', '**/inventory/price-groups/*').as('priceGroupUpdateCall')
    cy.intercept('DELETE', '**/inventory/price-groups/*').as('priceGroupDeleteCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('li > #sidebar_system').should('be.visible')
      cy.get('#sidebar_good_services').click({ force: true })
      cy.get('#sidebar_price_groups').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })

    //? ADD DATA
    cy.get('#button_add_price_group').click()
    cy.get('#modal_form').should('be.visible')
    cy.get('#input_pricegroup').type('automation test')
    cy.get('#button_submit').click()
    cy.wait('@priceGroupCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('tbody > tr > [aria-colindex="1"]').should('contain', 'automation test')
    })
    //? END ADD DATA
    //? EDIT DATA
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_edit_0').click()
    cy.get('#modal_form').should('be.visible')
    cy.get('#input_pricegroup').clear()
    cy.get('#input_pricegroup').type('automation test update')
    cy.get('#button_submit').click()
    cy.wait('@priceGroupUpdateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('tbody > tr > [aria-colindex="1"]').should('contain.text', 'automation test update')
    })
    //? END ADD DATA
    //? DELETE DATA
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_delete_0').click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.wait('@priceGroupDeleteCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.wait(500).get('table').within(() => {
        cy.get('td').contains('automation test update').should('not.exist')
      })
    })
    //? END ADD DATA
  })
})