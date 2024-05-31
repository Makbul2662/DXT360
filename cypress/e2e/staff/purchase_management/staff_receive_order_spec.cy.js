Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Purchase Management For Receive Order', () => {

  it('passed', () => {
    let poNumber
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
    //ADD DATA
    cy.get('#btn_add').click()
    const additionalVal = Math.floor(Math.random() * 9000) + 1000
    cy.get('#input_no_invoice').type(`${additionalVal}`)
    cy.get('#input_date').type('2024-01-24')
    cy.wait('@poListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('.multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#null-0').click()
    })

    cy.wait(1000).get('#null-0').invoke('text').as('getDataPoNumber')
    cy.wait(1000).get('#input_part_0-1').invoke('text').as('getPartNumber')

    cy.get('@getDataPoNumber').then((val) => {
      const value = val.trim()
      Cypress.env('numberOfPo', value)
    })

    cy.get('@getPartNumber').then((val) => {
      const value = val.trim()
      Cypress.env('NUMBER_OF_PART', value)
    })

    cy.wait(1000).get('#null-0').invoke('text').then((text) => {
      poNumber = text.trim()
      cy.get('#input_supplier').should('be.disabled')
      cy.get('#input_tax').select('PPN KELUARAN - 10%')
      cy.get('#btn_submit').click()
      cy.wait('@roCreateCall').then(({ response }) => {
        expect(response.statusCode).to.eq(200)
        cy.get('.swal2-popup').should('be.visible')
        cy.wait(2000).get('tbody > :nth-child(1) > [aria-colindex="3"]').should('contain', poNumber)
      })
    })
    // EDIT DATA
    // cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    // cy.get('#btn_edit_0').click()
    // cy.wait('@roDetailCall').then(({ response }) => {
    //   expect(response.statusCode).to.eq(200)
    //   cy.get('#input_no_invoice').clear()
    //   cy.wait(2000).get('#input_no_invoice').type(`${additionalVal}`)
    // })
    // cy.get('#input_date').clear()
    // cy.get('#input_date').type('2024-01-24')
    // cy.get('#input_supplier').should('be.disabled')
    // cy.get('#input_tax').invoke('val', '')
    // cy.get('#input_tax').select('PPN KELUARAN - 10%')
    // cy.get('#btn_submit').click()
    // cy.wait('@roUpdateCall').then(({ response }) => {
    //   expect(response.statusCode).to.eq(200)
    //   cy.get('.swal2-popup').should('be.visible')
    // })

    // DETAIL DATA
    // cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    // cy.get('#btn_detail_0').click()
    // cy.wait('@roDetailCall').then(({ response }) => {
    //   expect(response.statusCode).to.eq(200)
    //   cy.get('#input_no_invoice').should('be.disabled')
    //   cy.get('#input_date').should('be.disabled')
    //   cy.get('#input_po').should('be.disabled')
    //   cy.get('#input_supplier').should('be.disabled')
    // })
    // cy.get('#input_part_0').should('be.disabled')
    // cy.get('#input_unit_0').should('be.disabled')
    // cy.get('#input_outstanding_0').should('be.disabled')
    // cy.get('#input_received_0').should('be.disabled')
    // cy.get('#input_price_0').should('be.disabled')
    // cy.get('#input_total_price_0').should('be.disabled')
    // cy.get('#input_tax').should('be.disabled')
    // cy.get('#btn_back').click({ force: true })

  })
  it('Checking Good Stock', () => {
    cy.intercept('GET', '**/inventory/stocks*').as('GoodStockListCall')
    cy.Login(Cypress.env('EMAIL_STAFF_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_inventory').click({ force: true })
      cy.get('.dropdown').should('be.visible')
      cy.get('#sidebar_good_stock').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    const partNumber = Cypress.env('NUMBER_OF_PART')
    cy.get('table').within(() => {
      cy.contains('td', partNumber).should('exist').as('Data saved in good stock')
    })

  })
})