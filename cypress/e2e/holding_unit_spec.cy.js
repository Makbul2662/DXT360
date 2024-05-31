Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow System Unit', () => {
  it('Checked Flow Create unit', () => {
    //intercept call api
    cy.intercept('GET', '**/inventory/units*').as('unitListCall')
    cy.intercept('POST', '**/inventory/units').as('unitCreateCall')
    cy.intercept('PUT', '**/inventory/units/*').as('unitUpdateCall')
    cy.intercept('DELETE', '**/inventory/units/*').as('unitDeleteCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_system').should('be.visible')
      cy.get('#sidebar_system').click({ force: true })
      cy.get('#sidebar_setting_unit').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    // SEARCH DATA
    cy.get('#input_search').type('Kilogram')
    cy.wait('@unitListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="1"]').contains('Kilogram')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type('XXX')
    cy.wait('@unitListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()
    cy.get('#btn_create').click()

    // CREATE UNIT
    let completed = false
    const additionalVal = Math.random(3).toString()
    function createUnit () {
      if (completed) {
        return
      }
      cy.get('#input_name').type(`Drum`)
      cy.get('#input_short_name').type(`DRM`)
      cy.get('#button_cancel').should('be.visible')
      cy.get('#button_submit').click()

      cy.get('.swal2-popup').then(($element) => {
        if ($element.length > 0) {
          createUnit()
        }
      })
      completed = true
      return
    }

    createUnit()

    cy.get('tbody > tr > [aria-colindex="1"]').contains('Drum').as('ensure new data in the table appears')
    cy.get('#input_search').type('Drum', { delay: 30 }).as('Search new data')
    cy.get('tbody > tr > [aria-colindex="1"]').contains('Drum')
    cy.get('#input_search').clear()

    // Check data in good and service part
    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_good_services').click({ force: true })
    cy.get('#sidebar_part').click({ force: true })

    cy.get('#btn_add').click()

    cy.wait(2000)

    cy.get('#input_main_unit').scrollIntoView()
    cy.get('#input_main_unit').find('option').eq(1).invoke('val').then((val) => {
      cy.get('#input_main_unit').select(val).as('New Data Unit Successfully Show And Can Be Used')
      cy.get('#input_main_unit').should('contain.text', 'Drum')
    })

  })

  it('Checked Flow Edit Unit', () => {
    cy.intercept('GET', '**/inventory/units*').as('unitListCall')
    cy.intercept('POST', '**/inventory/units').as('unitCreateCall')
    cy.intercept('PUT', '**/inventory/units/*').as('unitUpdateCall')
    cy.intercept('DELETE', '**/inventory/units/*').as('unitDeleteCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_system').should('be.visible')
      cy.get('#sidebar_system').click({ force: true })
      cy.get('#sidebar_setting_unit').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })

    //EDIT UNIT
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_edit_0').click()
    cy.get('#input_name').clear()
    cy.get('#input_name').type('Drum UPDATE')
    cy.get('#input_short_name').clear()
    cy.get('#input_short_name').type('DRM UPDATE')
    cy.get('#button_submit').click()
    cy.get('body').click()
    cy.get('tbody > :nth-child(1) > [aria-colindex="1"]').should('contain', 'Drum UPDATE')

    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_good_services').click({ force: true })
    cy.get('#sidebar_part').click({ force: true })

    cy.get('#btn_add').click()

    cy.wait(2000)

    cy.get('#input_main_unit').scrollIntoView()
    cy.get('#input_main_unit').find('option').eq(1).invoke('val').then((val) => {
      cy.get('#input_main_unit').select(val).as('Data Update Unit Successfully Show And Can Be Used')
      cy.get('#input_main_unit').should('contain.text', 'Drum UPDATE')
    })
  })

  it('Checking Flow Delete Unit', () => {
    cy.intercept('GET', '**/inventory/units*').as('unitListCall')
    cy.intercept('POST', '**/inventory/units').as('unitCreateCall')
    cy.intercept('PUT', '**/inventory/units/*').as('unitUpdateCall')
    cy.intercept('DELETE', '**/inventory/units/*').as('unitDeleteCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_system').should('be.visible')
      cy.get('#sidebar_system').click({ force: true })
      cy.get('#sidebar_setting_unit').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })

    //DELETE DATA
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_delete_0').click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.get('body').click()
    cy.get('tbody > :nth-child(1) > [aria-colindex="1"]').should('not.contain', 'Drum UPDATE')

    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_good_services').click({ force: true })
    cy.get('#sidebar_part').click({ force: true })

    cy.get('#btn_add').click()

    cy.wait(2000)

    cy.get('#input_main_unit').scrollIntoView()
    cy.get('#input_main_unit').find('option').eq(1).invoke('val').then((val) => {
      cy.get('#input_main_unit').select(val).as('Data Unit Not Found, Delete Unit Successfully')
      cy.get('#input_main_unit').should('not.contain.text', 'Drum UPDATE')
    })
  })
})