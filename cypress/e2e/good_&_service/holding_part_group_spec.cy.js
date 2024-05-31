

Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Good & Serive Part Group', () => {
  it('passed', () => {
    cy.intercept('GET', '**/inventory/groups*').as('groupListCall')
    cy.intercept('GET', '**/inventory/groups').as('groupOptionCall')
    cy.intercept('POST', '**/inventory/groups').as('groupCreateCall')
    cy.intercept('PUT', '**/inventory/groups/*').as('groupUpdateCall')
    cy.intercept('DELETE', '**/inventory/groups/*').as('groupDeleteCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('li > #sidebar_system').should('be.visible')
      cy.get('#sidebar_good_services').click({ force: true })
      cy.get('#sidebar_groups').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //? SEARCH DATA
    cy.get('#input_search').type('Tissue makan')
    cy.wait('@groupListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="1"]').contains('Tissue makan')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type('XXX')
    cy.wait('@groupListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()
    //? END SEARCH DATA

    //? ADD DATA
    cy.get('#button_add_group').click()
    cy.wait('@groupOptionCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#modal_form').should('be.visible')
      cy.get('#input_group').type('automation test group')
    })
    cy.get('#button_submit').click()
    cy.wait('@groupCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('tbody > tr > [aria-colindex="1"]').should('contain', 'automation test group')
    })
    //? END DATA

    //! CHECKING DATA GROUP IN PART
    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_good_services').click({ force: true })
    cy.get('#sidebar_part').click({ force: true })

    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.wait(500).get('#btn_add').click()
    cy.get('#input_group').scrollIntoView()
    cy.get('#input_group').find('option').eq(1).invoke('val').then((val) => {
      cy.get('#input_group').select(val)
      cy.get('#input_group').should('contain.text', 'automation test group')
      cy.log('Create Group Successfully and data show in this page')
    })
    cy.get('#btn_cancel').scrollIntoView()
    cy.get('#btn_cancel').should('be.visible')
    cy.get('#btn_cancel').click()
    //! END CHECKING DATA GROUP IN PART

    //? EDIT DATA
    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_good_services').click({ force: true })
    cy.get('#sidebar_groups').click({ force: true })

    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_edit_0').click()
    cy.wait('@groupOptionCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#modal_form').should('be.visible')
      cy.get('#input_group').clear()
      cy.get('#input_group').type('automation test group update')
    })
    cy.get('#button_submit').click()
    cy.wait('@groupUpdateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('tbody > tr > [aria-colindex="1"]').should('contain', 'automation test group update')
    })
    //? END EDIT DATA

    //! CHECKING DATA GROUP IN PART
    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_good_services').click({ force: true })
    cy.get('#sidebar_part').click({ force: true })

    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.wait(500).get('#btn_add').click()
    cy.get('#input_group').scrollIntoView()
    cy.get('#input_group').find('option').eq(1).invoke('val').then((val) => {
      cy.get('#input_group').select(val)
      cy.get('#input_group').should('contain.text', 'automation test group update')
      cy.log('Update Group Successfully and data show in this page')
    })
    cy.get('#btn_cancel').scrollIntoView()
    cy.get('#btn_cancel').should('be.visible')
    cy.get('#btn_cancel').click()
    //! END CHECKING DATA GROUP IN PART

    //? DELETE DATA
    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_good_services').click({ force: true })
    cy.get('#sidebar_groups').click({ force: true })

    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_delete_0').click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.wait('@groupDeleteCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('tbody > tr > [aria-colindex="1"]').should('not.contain', 'automation test group update')
    })
    //? END DELETE DATA

    //! CHECKING DATA GROUP IN PART
    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_good_services').click({ force: true })
    cy.get('#sidebar_part').click({ force: true })

    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.wait(500).get('#btn_add').click()
    cy.get('#input_group').scrollIntoView()
    cy.get('#input_group').find('option').eq(1).invoke('val').then((val) => {
      cy.get('#input_group').select(val)
      cy.get('#input_group').should('not.contain.text', 'automation test group update')
      cy.log('Delete Group Successfully and data not show in this page')
    })
    cy.get('#btn_cancel').scrollIntoView()
    cy.get('#btn_cancel').should('be.visible')
    cy.get('#btn_cancel').click()
    //! END CHECKING DATA GROUP IN PART
  })
})