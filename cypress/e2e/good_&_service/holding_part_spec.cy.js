Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Good & Service Part', () => {
  it('Checking Flow Create Part', () => {
    //intercept part
    cy.intercept('GET', '**/inventory/parts*').as('partListCall')
    cy.intercept('POST', '**/inventory/parts').as('partCreateCall')
    cy.intercept('GET', '**/inventory/parts/*').as('partDetailCall')
    cy.intercept('PUT', '**/inventory/parts/*').as('partUpdateCall')
    cy.intercept('DELETE', '**/inventory/parts/*').as('partDeleteCall')

    cy.intercept('GET', '**/inventory/groups').as('groupListCall')
    cy.intercept('GET', '**/inventory/units*').as('unitListCall')
    cy.intercept('GET', '**/inventory/taxes').as('taxesListCall')
    cy.intercept('GET', '**/koperasi/access/outlet*').as('outletListCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('li > #sidebar_system').should('be.visible')
      cy.get('#sidebar_good_services').click({ force: true })
      cy.get('#sidebar_part').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //ADD DATA
    cy.wait(500).get('#btn_add').click()
    cy.get('#input_number').type('auto-2000')
    cy.get('#input_description').type('automation test part')
    cy.wait('@groupListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_group').scrollIntoView()
      cy.get('#input_group').find('option').eq(1).invoke('val').then((val) => {
        cy.get('#input_group').select(val)
      })
    })
    cy.get('#input_tax').select('PPN KELUARAN')
    cy.get('#input_average_cost').select('From Latest Months')
    cy.get('#input_average_cost_month').should('be.visible')
    cy.wait(500).get('#input_average_cost_month').type('1')
    cy.get('.custom-file-label').should('be.visible')
    //const filePath = 'adidas.jpg'
    cy.get('#input_image').attachFile('adidas.jpg', { fileContent: 'image/jpg' })
    cy.get('#input_additional_description').type('test')
    cy.get('#input_additional_sell_price_0').clear()
    cy.get('#input_additional_sell_price_0').type('60000')
    cy.get('#input_additional_outlet_type_0').select('Cafe')
    cy.wait('@outletListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('#wrapper_input_outlet_0 > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.get('#input_outlet_0-0').click()
    })
    cy.get('#input_main_unit').find('option').eq(1).invoke('val').then((val) => {
      cy.get('#input_main_unit').select(val)
    })
    cy.get('#input_quantity_0').type('1')
    cy.get('#input_unit_0').find('option').eq(1).invoke('val').then((val) => {
      cy.get('#input_unit_0').select(val)
    })
    cy.get('#input_part_quantity_0').type('6')
    cy.get('#input_make').type('test')
    cy.get('#input_model').type('test')
    cy.get('#input_code').type('test')
    cy.get('#btn_submit').scrollIntoView()
    cy.get('#btn_submit').should('be.visible')
    cy.get('#btn_submit').click()
    cy.wait('@partCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="2"]').contains('automation test part')
    })

  })

  it('Checking New Part In Purchase order After Create Part', () => {
    cy.intercept('GET', '**/inventory/purchase-orders*').as('poListCall')
    cy.intercept('GET', '**/inventory/parts*').as('partListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('POST', '**/inventory/purchase-orders').as('poCreateCall')
    cy.intercept('POST', '**/inventory/purchase-orders/validate').as('poValidateCall')
    cy.intercept('GET', '**/inventory/purchase-orders/*').as('poDetailCall')

    cy.Login(Cypress.env('EMAIL_STAFF_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_order_entry').click({ force: true })
      cy.get('#sidebar_purchase_order').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.wait(500).get('#btn_add').click()
    cy.wait('@partListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('.multiselect__select').click({ force: true, multiple: true })
      cy.wait(2000).get('#input_part_0-1').click()
      cy.wait(1000).get('#validator_part_0 > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#input_part_0-1').should('contain.text', 'auto-2000 - automation test part')
      cy.log('Create New Part Successfully and data show in this page')
    })
  })

  it('Checking Flow Update Part', () => {
    cy.intercept('GET', '**/inventory/parts*').as('partListCall')
    cy.intercept('POST', '**/inventory/parts').as('partCreateCall')
    cy.intercept('GET', '**/inventory/parts/*').as('partDetailCall')
    cy.intercept('PUT', '**/inventory/parts/*').as('partUpdateCall')
    cy.intercept('DELETE', '**/inventory/parts/*').as('partDeleteCall')

    cy.intercept('GET', '**/inventory/groups').as('groupListCall')
    cy.intercept('GET', '**/inventory/units*').as('unitListCall')
    cy.intercept('GET', '**/inventory/taxes').as('taxesListCall')
    cy.intercept('GET', '**/koperasi/access/outlet*').as('outletListCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('li > #sidebar_system').should('be.visible')
      cy.get('#sidebar_good_services').click({ force: true })
      cy.get('#sidebar_part').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })

    //EDIT DATA
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_edit_0').click()
    cy.wait('@partDetailCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_description').clear()
      cy.get('#input_description').type('automation test part edit')
    })
    cy.get('.btn-primary').click()
    cy.wait('@partUpdateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="2"]').contains('automation test part edit')
    })
  })

  it('Checking Data Part In Purchase order After Edit Part', () => {
    cy.intercept('GET', '**/inventory/purchase-orders*').as('poListCall')
    cy.intercept('GET', '**/inventory/parts*').as('partListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('POST', '**/inventory/purchase-orders').as('poCreateCall')
    cy.intercept('POST', '**/inventory/purchase-orders/validate').as('poValidateCall')
    cy.intercept('GET', '**/inventory/purchase-orders/*').as('poDetailCall')

    cy.Login(Cypress.env('EMAIL_STAFF_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_order_entry').click({ force: true })
      cy.get('#sidebar_purchase_order').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.wait(500).get('#btn_add').click()
    cy.wait('@partListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('.multiselect__select').click({ force: true, multiple: true })
      cy.wait(2000).get('#input_part_0-1').click()
      cy.wait(1000).get('#validator_part_0 > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#input_part_0-1').should('contain.text', 'auto-2000 - automation test part edit')
      cy.log('Update New Part Successfully and data show in this page')
    })
  })

  it('Checking Flow Delete Part', () => {
    cy.intercept('GET', '**/inventory/parts*').as('partListCall')
    cy.intercept('POST', '**/inventory/parts').as('partCreateCall')
    cy.intercept('GET', '**/inventory/parts/*').as('partDetailCall')
    cy.intercept('PUT', '**/inventory/parts/*').as('partUpdateCall')
    cy.intercept('DELETE', '**/inventory/parts/*').as('partDeleteCall')

    cy.intercept('GET', '**/inventory/groups').as('groupListCall')
    cy.intercept('GET', '**/inventory/units*').as('unitListCall')
    cy.intercept('GET', '**/inventory/taxes').as('taxesListCall')
    cy.intercept('GET', '**/koperasi/access/outlet*').as('outletListCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('li > #sidebar_system').should('be.visible')
      cy.get('#sidebar_good_services').click({ force: true })
      cy.get('#sidebar_part').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })

    //DELETE DATA
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_delete_0').click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.wait('@partDeleteCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('tbody > tr > [aria-colindex="2"]').should('not.contain', 'automation test part edit')
    })
  })

  it('Checking Data Part In Purchase order After Delete Part', () => {
    cy.intercept('GET', '**/inventory/purchase-orders*').as('poListCall')
    cy.intercept('GET', '**/inventory/parts*').as('partListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('POST', '**/inventory/purchase-orders').as('poCreateCall')
    cy.intercept('POST', '**/inventory/purchase-orders/validate').as('poValidateCall')
    cy.intercept('GET', '**/inventory/purchase-orders/*').as('poDetailCall')

    cy.Login(Cypress.env('EMAIL_STAFF_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_order_entry').click({ force: true })
      cy.get('#sidebar_purchase_order').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.wait(500).get('#btn_add').click()
    cy.wait('@partListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('.multiselect__select').click({ force: true, multiple: true })
      cy.wait(2000).get('#input_part_0-1').click()
      cy.wait(1000).get('#validator_part_0 > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#input_part_0-1').should('not.contain.text', 'auto-2000 - automation test part edit')
      cy.log('Delete Part Successfully and data not show in this section')
    })
  })

})