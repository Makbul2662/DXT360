Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Management Area', () => {
  it('Checking Flow CRUD Management Area and Checking Data in MDL', () => {
    cy.intercept('GET', '**/inventory/regions*').as('regionListCall')
    cy.intercept('GET', '**/koperasi/access/organization').as('organizationListCall')
    cy.intercept('POST', '**/inventory/regions').as('regionCreateCall')
    cy.intercept('PUT', '**/inventory/regions/*').as('regionUpdateCall')
    cy.intercept('GET', '**/inventory/regions/*').as('regionDetailCall')
    cy.intercept('DELETE', '**/inventory/regions/*').as('regionDeleteCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('li > #sidebar_system').should('be.visible')
      cy.get('#sidebar_system').click({ force: true })
      cy.get('#sidebar_management_area').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //SEARCH DATA
    cy.get('#input_search').type('Pasteur Area')
    cy.wait('@regionListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="2"]').contains('Pasteur Area')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type('XXX')
    cy.wait('@regionListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()

    //? ADD DATA
    cy.get('.head-wrapper > .btn').click()
    cy.get('#input_name').type('automation test area')
    cy.get('.py-3').should('be.visible')
    cy.get('#input_outlet').should('exist')
    cy.get('.border-top-0').should('exist')
    cy.get('.py-3')
    cy.wait('@organizationListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.border-top-0').scrollIntoView()
        .should('be.visible')
        .find('#input_outlet_BV_option_2[type="checkbox"]')
        .check({ force: true }).should('be.checked').as('choose Rumah Sakit Hermina Jatinegara')
    })
    cy.get('#button_submit').click()
    cy.wait('@regionCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('tbody > tr > [aria-colindex="2"]').should('contain', 'automation test area')
    })
    //? END ADD DATA

    //! Checking data AREA from page MDL
    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_system').click({ force: true })
    cy.get('#sidebar_system_listings').click({ force: true })

    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.get('.head-wrapper > .btn').click()
    cy.get('#input_area').scrollIntoView()
    cy.get('#input_area').find('option').eq(1).invoke('val').then((val) => {
      cy.get('#input_area').select(val)
      cy.get('#input_area').should('contain.text', 'automation test area')
      cy.log('Created Area Successfully and data can be used')
    })
    cy.get('#button_cancel').click()
    //! END Checking data AREA from page MDL


    //? EDIT DATA
    cy.wait(2000)
    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_system').click({ force: true })
    cy.get('#sidebar_management_area').click({ force: true })

    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_edit_0').click()
    cy.wait('@regionDetailCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_name').clear()
      cy.get('#input_name').type('automation test area update')
    })
    cy.get('.py-3').should('be.visible')
    cy.get('#input_outlet').should('exist')
    cy.get('.border-top-0').should('exist')
    cy.get('.py-3')
    cy.get('.border-top-0').scrollIntoView()
      .should('be.visible')
      .find('#input_outlet_BV_option_2[type="checkbox"]')
      .uncheck({ force: true })
    cy.wait('@organizationListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.border-top-0').scrollIntoView()
        .should('be.visible')
        .find('#input_outlet_BV_option_2[type="checkbox"]')
        .check({ force: true })
    })
    cy.get('#button_submit').click()
    cy.wait('@regionUpdateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('tbody > tr > [aria-colindex="2"]').should('contain', 'automation test area update')
    })
    //? END EDIT DATA

    //! Checking data AREA from page MDL
    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_system').click({ force: true })
    cy.get('#sidebar_system_listings').click({ force: true })

    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.get('.head-wrapper > .btn').click()
    cy.get('#input_area').scrollIntoView()
    cy.get('#input_area').find('option').eq(1).invoke('val').then((val) => {
      cy.get('#input_area').select(val)
      cy.get('#input_area').should('contain.text', 'automation test area update')
      cy.log('Updated Data Area Successfully and data can be used')
    })
    cy.get('#button_cancel').click()
    //! END Checking data AREA from page MDL

    //? DELETE DATA
    cy.wait(2000)
    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_system').click({ force: true })
    cy.get('#sidebar_management_area').click({ force: true })

    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_delete_0').click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.wait('@regionDeleteCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="2"]').should('not.contain', 'automation test area update')
    })
    //? END DELETE DATA

    //! Checking data AREA from page MDL
    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_system').click({ force: true })
    cy.get('#sidebar_system_listings').click({ force: true })

    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.get('.head-wrapper > .btn').click()
    cy.get('#input_area').scrollIntoView()
    cy.get('#input_area').find('option').eq(1).invoke('val').then((val) => {
      cy.get('#input_area').select(val)
      cy.get('#input_area').should('not.contain.text', 'automation test area update')
      cy.log('Delete Area Successfully and data show in this page')
    })
    cy.get('#button_cancel').click()
    //! END Checking data AREA from page MDL
  })
})