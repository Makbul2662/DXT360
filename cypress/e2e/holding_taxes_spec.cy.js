Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Checking Flow System Create Taxes', () => {
  const currentDate = new Date().toISOString().slice(0, 10)
  it('Checking Flow Create Taxes', () => {
    cy.intercept('GET', '**/inventory/taxes*').as('taxesListCall')
    cy.intercept('GET', '**/accounting/coa*').as('coaTaxCall')
    cy.intercept('POST', '**/inventory/taxes').as('taxesCreateCall')
    cy.intercept('GET', '**/inventory/taxes/*').as('taxesDetailCall')
    cy.intercept('PUT', '**/inventory/taxes/*').as('taxesUpdateCall')
    cy.intercept('DELETE', '**/inventory/taxes/*').as('taxesDeleteCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_system').should('be.visible')
      cy.get('#sidebar_system').click({ force: true })
      cy.get('#sidebar_taxes').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    // SEARCH DATA
    cy.get('#input_search').type('PPN')
    cy.wait('@taxesListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="1"]').contains('PPN')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type('XXX')
    cy.wait('@taxesListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()
    // create new data taxes
    cy.get('#btn_create').click()
    cy.get('#input_name').type('automation test tax')
    cy.wait('@coaTaxCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#select_tax_account').find('option').eq(0).invoke('val').then((val) => {
        cy.get('#select_tax_account').select(val)
      })
    })

    cy.get('#input_rate').type('10')
    cy.get('#input_min_taxable').type('1')
    cy.get('#input_valid_to').type(currentDate)
    cy.get('#button_submit').click()
    cy.wait('@taxesCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.wait(1500).get('tbody > :nth-child(1) > [aria-colindex="1"]').should('contain', 'automation test tax')
    })
  })

  it('Checking Data After Create Taxes in Receive Order', () => {
    cy.intercept('GET', '**/inventory/receive-orders*').as('roListCall')
    cy.intercept('GET', '**/inventory/parts*').as('partListCall')
    cy.intercept('GET', '**/inventory/purchase-orders*').as('poListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('GET', '**/inventory/taxes').as('taxesListCall')
    cy.intercept('POST', '**/inventory/receive-orders*').as('roCreateCall')
    cy.intercept('GET', '**/inventory/receive-orders/*').as('roDetailCall')
    cy.intercept('PUT', '**/inventory/receive-orders/*').as('roUpdateCall')

    cy.Login(Cypress.env('EMAIL_STAFF_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_order_entry').click({ force: true })
      cy.get('#sidebar_receive_order').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    cy.get('#btn_add').click()
    cy.get('#input_tax').scrollIntoView()
    cy.get('#input_tax').select('automation test tax - 10%')
    cy.get('#input_tax').should('contain.text', 'automation test tax - 10%').as('Data Successfully Created and can be used')
  })

  it('Checking Flow System Update Taxes', () => {
    cy.intercept('GET', '**/inventory/taxes*').as('taxesListCall')
    cy.intercept('GET', '**/accounting/coa*').as('coaTaxCall')
    cy.intercept('POST', '**/inventory/taxes').as('taxesCreateCall')
    cy.intercept('GET', '**/inventory/taxes/*').as('taxesDetailCall')
    cy.intercept('PUT', '**/inventory/taxes/*').as('taxesUpdateCall')
    cy.intercept('DELETE', '**/inventory/taxes/*').as('taxesDeleteCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_system').should('be.visible')
      cy.get('#sidebar_system').click({ force: true })
      cy.get('#sidebar_taxes').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //Edit data taxes
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_edit_0').click()
    cy.wait('@taxesDetailCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_name').clear()
      cy.get('#input_name').type('automation test tax update')
      cy.get('#select_tax_account').invoke('val', '')
      cy.wait('@coaTaxCall').then(({ response }) => {
        expect(response.statusCode).to.eq(200)
        cy.get('#select_tax_account').find('option').eq(0).invoke('val').then((val) => {
          cy.get('#select_tax_account').select(val)
        })
      })
    })
    cy.get('#input_rate').clear()
    cy.get('#input_rate').type('10')
    cy.get('#input_min_taxable').clear()
    cy.get('#input_min_taxable').type('1')
    cy.get('#input_valid_to').clear()
    cy.get('#input_valid_to').type(currentDate)
    cy.get('#button_submit').click()
    cy.wait('@taxesUpdateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > :nth-child(1) > [aria-colindex="1"]').should('contain', 'automation test tax update')
    })
  })

  it('Checking Data After Update Taxes in Receive Order', () => {
    cy.intercept('GET', '**/inventory/receive-orders*').as('roListCall')
    cy.intercept('GET', '**/inventory/parts*').as('partListCall')
    cy.intercept('GET', '**/inventory/purchase-orders*').as('poListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('GET', '**/inventory/taxes').as('taxesListCall')
    cy.intercept('POST', '**/inventory/receive-orders*').as('roCreateCall')
    cy.intercept('GET', '**/inventory/receive-orders/*').as('roDetailCall')
    cy.intercept('PUT', '**/inventory/receive-orders/*').as('roUpdateCall')

    cy.Login(Cypress.env('EMAIL_STAFF_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_order_entry').click({ force: true })
      cy.get('#sidebar_receive_order').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    cy.get('#btn_add').click()
    cy.get('#input_tax').scrollIntoView()
    cy.get('#input_tax').select('automation test tax update - 10%')
    cy.get('#input_tax').should('contain.text', 'automation test tax update - 10%').as('Data Successfully Updated and can be used')
  })

  it('Checking Flow System Delete Taxes', () => {
    cy.intercept('GET', '**/inventory/taxes*').as('taxesListCall')
    cy.intercept('GET', '**/accounting/coa*').as('coaTaxCall')
    cy.intercept('POST', '**/inventory/taxes').as('taxesCreateCall')
    cy.intercept('GET', '**/inventory/taxes/*').as('taxesDetailCall')
    cy.intercept('PUT', '**/inventory/taxes/*').as('taxesUpdateCall')
    cy.intercept('DELETE', '**/inventory/taxes/*').as('taxesDeleteCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_system').should('be.visible')
      cy.get('#sidebar_system').click({ force: true })
      cy.get('#sidebar_taxes').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //DELETE DATA
    cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    cy.get('#btn_delete_0').click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.wait('@taxesDeleteCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > :nth-child(1) > [aria-colindex="1"]').should('not.contain', 'automation test tax update')
    })
  })

  it('Checking Data After Delete Taxes in Receive Order', () => {
    cy.intercept('GET', '**/inventory/receive-orders*').as('roListCall')
    cy.intercept('GET', '**/inventory/parts*').as('partListCall')
    cy.intercept('GET', '**/inventory/purchase-orders*').as('poListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('GET', '**/inventory/taxes').as('taxesListCall')
    cy.intercept('POST', '**/inventory/receive-orders*').as('roCreateCall')
    cy.intercept('GET', '**/inventory/receive-orders/*').as('roDetailCall')
    cy.intercept('PUT', '**/inventory/receive-orders/*').as('roUpdateCall')

    cy.Login(Cypress.env('EMAIL_STAFF_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_order_entry').click({ force: true })
      cy.get('#sidebar_receive_order').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    cy.get('#btn_add').click()
    cy.get('#input_tax').scrollIntoView()
    cy.get('#input_tax').select('PPN KELUARAN - 10%')
    cy.get('#input_tax').should('not.contain.text', 'automation test tax update - 10%').as('Data Successfully Updated and can be used')
  })
})