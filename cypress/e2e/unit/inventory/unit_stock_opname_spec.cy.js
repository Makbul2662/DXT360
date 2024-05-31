Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow inventory Stock Management Stock Opname by Unit', () => {
  it('Checking Flow Create Stock Opname', () => {
    const currentDate = new Date().toISOString().slice(0, 10)

    cy.intercept('GET', '**/inventory/stock-opnames*').as('stockOpnameListCall')
    cy.intercept('GET', '**/inventory/stocks*').as('stockListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('GET', '**/inventory/groups').as('groupListCall')
    cy.intercept('GET', '**/inventory/parts*').as('partListCall')
    cy.intercept('POST', '**/inventory/stock-opnames').as('stockOpnameCreateCall')

    cy.Login(Cypress.env('EMAIL_UNIT_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_inventory').click({ force: true })
      cy.get('#sidebar_stock_opname').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    cy.get('#btn_add').click()
    cy.get('#input_date').type(currentDate)
    cy.get('#input_type').find('option').eq(1).invoke('val').then((val) => {
      cy.get('#input_type').select(val)
    })
    cy.get('.multiselect__tags').should('be.visible')
    cy.get('.multiselect').click({ force: true, multiple: true })
    cy.get('.multiselect__select').click({ force: true, multiple: true })
    cy.get('#validator_part_0 > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
    cy.wait(1000).get('#input_part_0-0').click()
    cy.get('#input_unit_0').should('be.disabled')
    cy.get('#input_price_0').should('be.disabled')
    cy.get('#input_quantity_0').type('5')

    cy.get('#button_submit').click()
    cy.wait('@stockOpnameCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      cy.wait(2000).get('tbody > :nth-child(1) > [aria-colindex="2"]').invoke('text').then((text) => {
        const textVal = text.trim()
        Cypress.env('STOCK_OP_NAME_REFERENCE', textVal)
        cy.log('Stock opname reference saved!')
      })
    })
  })

  it('Checking Approve Stock Opname', () => {
    cy.intercept('GET', '**/inventory/stock-opnames*').as('stockOpnameListCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_inventory').click({ force: true })
      cy.get('#sidebar_stock_opname').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    cy.wait(1000).get('tbody > :nth-child(1) > [aria-colindex="4"]').invoke('text').then((text) => {
      const cellValue = text.trim()
      if (cellValue == 'DRAFT') {
        cy.get('#btn_dropdown_action_0__BV_toggle_').click()
        cy.get('#btn_detail_0').click()
        cy.get('#button_approve').click()
        cy.get('.swal2-popup').should('be.visible')
        cy.wait(1000).get('tbody > :nth-child(1) > [aria-colindex="4"]').should('contain', 'SETTLE')
      } else {
        cy.log('Stock Opname Approved')
      }
    })
  })

  it('Checking Data From Stock Opname To GL', () => {
    cy.intercept('GET', '**/accounting/coa').as('coaListCall')
    cy.intercept('GET', '**/accounting/gl*').as('glListCall')
    cy.intercept('GET', '**/accounting/year-end').as('yearEndListCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_general').click({ force: true })
      cy.get('#sidebar_general_search_gl').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })

    cy.wait('@coaListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@glListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@yearEndListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })

    const stockOpnameReference = Cypress.env('STOCK_OP_NAME_REFERENCE')

    cy.wait(1000).contains('td', stockOpnameReference).should('be.visible').as('Data Record To GL Successfully')

    cy.get('#last-pagination-button').then($nextBtn => {
      if ($nextBtn.is(':enabled')) {
        nextPage($nextBtn)
      }
    })
  })

  function nextPage ($nextBtn) {
    const stockOpnameReference = Cypress.env('STOCK_OP_NAME_REFERENCE')
    $nextBtn.click()

    cy.wait(1000)
    cy.contains('td', stockOpnameReference).should('be.visible').as('Data Record To GL Successfully')
    cy.get('#last-pagination-button').then($nextBtn => {
      if ($nextBtn.is(':enabled')) {
        nextPage($nextBtn)
      }
    })
  }
})