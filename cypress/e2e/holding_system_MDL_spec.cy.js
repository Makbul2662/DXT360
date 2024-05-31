Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow System Master Data Listings', () => {
  const currentDate = new Date().toISOString().slice(0, 10)
  it('Checking Create Data MDL', () => {
    cy.intercept('GET', '**/inventory/regions').as('regionListCall')
    cy.intercept('GET', '**/inventory/parts*').as('partListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('GET', '**/inventory/parts/*').as('partDetailCall')
    cy.intercept('GET', '**/inventory/listings*').as('listingListCall')
    cy.intercept('POST', '**/inventory/listings').as('listingCreateCall')
    cy.intercept('PUT', '**/inventory/listings/*').as('listingUpdateCall')
    cy.intercept('GET', '**/inventory/listings/*').as('listingDetailCall')
    cy.intercept('DELETE', '**/inventory/listings/*').as('listingDeleteCall')

    cy.intercept('GET', '**/inventory/groups').as('groupListCall')
    cy.intercept('GET', '**/inventory/units*').as('unitListCall')
    cy.intercept('GET', '**/inventory/taxes').as('taxesListCall')
    cy.intercept('GET', '**/koperasi/access/outlet*').as('outletListCall')
    cy.intercept('POST', '**/inventory/parts').as('partCreateCall')
    cy.intercept('DELETE', '**/inventory/parts/*').as('partDeleteCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('li > #sidebar_system').should('be.visible')
      cy.get('#sidebar_good_services').click({ force: true })
      cy.get('#sidebar_part').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.wait(500).get('#btn_add').click()
    cy.get('#input_number').type('MDL-2000')
    cy.get('#input_description').type('mdl part')
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
      cy.get('tbody > tr > [aria-colindex="2"]').contains('mdl part')
    })
    const additionalVal = Math.floor(Math.random() * 900) + 100


    cy.wait(500).get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_system').click({ force: true })
    cy.get('#sidebar_system_listings').click({ force: true })

    cy.reload().then(() => {
      cy.get('body').click()
    })


    //ADD DATA
    cy.get('#btn_add').click()
    cy.get('#input_name').type(`automation mdl ${additionalVal}`)
    cy.wait('@regionListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_area').find('option').eq(1).invoke('val').then((val) => {
        cy.get('#input_area').select(val)
      })
    })
    cy.get('#input_expired_date').type(currentDate)
    cy.wait('@companyContactListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('#wrapper_supplier_0 > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.get('#input_supplier_0-1').click()
    })

    cy.wait('@partListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#wrapper_part_0 > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.get('#input_part_0-1').click()
    })

    cy.wait('@partDetailCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_unit_0').find('option').eq(1).invoke('val').then((val) => {
        cy.get('#input_unit_0').select(val)
      })
    })
    cy.get('#input_price_0').clear()
    cy.get('#input_price_0').type('1000')
    cy.get('#button_submit').click().as('submit MDL')
    cy.wait('@listingCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.wait(500).get('tbody > :nth-child(1) > [aria-colindex="2"]').should('contain.text', `automation mdl ${additionalVal}`)
    })
    //EDIT DATA
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_edit_0').click()
    cy.wait('@listingDetailCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_name').clear()
      cy.get('#input_name').type(`automation mdl update ${additionalVal}`)
    })
    cy.get('#input_area').invoke('val', '')
    cy.wait('@regionListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_area').find('option').eq(1).invoke('val').then((val) => {
        cy.get('#input_area').select(val)
      })
    })
    cy.get('#input_expired_date').clear()
    cy.get('#input_expired_date').type(currentDate)
    cy.wait('@companyContactListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('#wrapper_supplier_0 > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.get('#input_supplier_0-1').click()
      cy.get('#wrapper_supplier_0 > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.get('#input_supplier_0-1').click()
    })
    cy.wait('@partListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('#wrapper_part_0 > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.get('#input_part_0-1').click()
      cy.get('#wrapper_part_0 > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.get('#input_part_0-1').click()
    })
    cy.get('#input_unit_0').invoke('val', '')
    cy.wait('@partDetailCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_unit_0').find('option').eq(1).invoke('val').then((val) => {
        cy.get('#input_unit_0').select(val)
      })
    })
    cy.get('#input_price_0').clear()
    cy.get('#input_price_0').type('1000')
    cy.get('#button_submit').click().as('update MDL')
    cy.wait('@listingUpdateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.wait(500).get('tbody > :nth-child(1) > [aria-colindex="2"]').should('contain.text', `automation mdl update ${additionalVal}`)
    })
    //DELETE DATA
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_delete_0').click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.wait('@listingDeleteCall').then(({ response }) => {
      if (response.statusCode == 200) {
        cy.get('.swal2-popup').should('be.visible')
        cy.wait(500).get('tbody > :nth-child(1) > [aria-colindex="2"]').should('not.contain.text', `automation mdl update ${additionalVal}`)
      } else {
        cy.get('.swal2-popup').should('be.visible')
        cy.wait(500).get('tbody > :nth-child(1) > [aria-colindex="2"]').should('contain.text', `automation mdl update ${additionalVal}`)
      }
    })

    cy.get('li > #sidebar_system').should('be.visible')
    cy.get('#sidebar_good_services').click({ force: true })
    cy.get('#sidebar_part').click({ force: true })
    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_delete_0').click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.wait('@partDeleteCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.get('tbody > tr > [aria-colindex="2"]').should('not.contain', 'mdl part')
    })

  })
})