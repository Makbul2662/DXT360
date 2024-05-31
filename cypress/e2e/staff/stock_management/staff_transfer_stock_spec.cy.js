Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Inventory Transfer Stock', () => {
  it('passed', () => {
    const currentDate = new Date().toISOString().slice(0, 10)

    cy.intercept('GET', '**/inventory/transfer-stocks*').as('trfStockListCall')
    cy.intercept('GET', '**/inventory/stocks*').as('stockListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('GET', '**/inventory/receive-orders').as('roListCall')
    cy.intercept('GET', '**/accounting/coa*').as('coaListCall')
    cy.intercept('POST', '**/inventory/transfer-stocks').as('trfStockCreateCall')
    cy.intercept('POST', '**/inventory/transfer-stocks/validate').as('trfStockValidateCall')

    cy.Login(Cypress.env('EMAIL_STAFF_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_inventory').click({ force: true })
      cy.get('.dropdown').should('be.visible')
      cy.get('#sidebar_internal_transfer_input').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //ADD DATA
    cy.get('#btn_add').click()
    cy.wait('@stockListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@companyContactListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@roListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.wait('@coaListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
    cy.get('#input_customer_type').should('be.disabled')
    cy.get('.multiselect__tags').should('be.visible')
    cy.get('.multiselect').click({ force: true, multiple: true })
    cy.get('.multiselect__option').eq(0).click({ force: true })
    cy.get('.multiselect__select').click({ force: true, multiple: true })
    cy.get('#validator_no_ro > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
    cy.wait(1000).get('#input_no_ro-0').click()
    cy.get('#input_tax_rate').should('be.disabled')
    cy.get('#input_date').type(currentDate)
    cy.get('#validator_to_outlet > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
    cy.wait(1000).get('#input_outlet-0').click()
    cy.wait(1000).get('#input_outlet-0').invoke('text').then((text) => {
      const textVal = text.trim()
      Cypress.env('TRANSFER_STOCK_TO_OUTLET', textVal)
    })

    cy.get('#input_coa_tax').find('option').eq(1).invoke('val').then((val) => {
      cy.get('#input_coa_tax').select(val, { force: true })
    })

    cy.get('#validator_material_0 > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
    cy.wait(1000).get('#input_material_0-0').click()

    cy.get('#input_unit_0').should('be.disabled')
    cy.get('#input_stock_0').should('be.disabled')
    cy.get('#input_qty_0').clear()
    cy.get('#input_qty_0').type('10')
    cy.get('#input_price_0').should('be.disabled')
    cy.get('#input_total_price_0').should('be.disabled')
    cy.get('#input_total_tax_0').should('be.disabled')
    cy.get('#input_grand_total_0').should('be.disabled')
    cy.get('#btn_submit').should('be.visible')
    cy.get('#btn_submit').click({ force: true })
    cy.wait('@trfStockValidateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#modal_unverified').then(($modal) => {
        if ($modal.length > 0) {
          if ($modal.is(':visible')) {
            cy.get('#btn_modal_submit').click()
            cy.wait('@trfStockCreateCall').then(({ response }) => {
              expect(response.statusCode).to.eq(200)
              cy.get('.swal2-popup').should('be.visible')
              cy.wait(2000).get('tbody > :nth-child(1) > [aria-colindex="2"]').invoke('text').then((text) => {
                const textVal = text.trim()
                Cypress.env('TRANSFER_STOCK_REFERENCE', textVal)
              })
            })
          } else {
            cy.wait('@trfStockCreateCall').then(({ response }) => {
              expect(response.statusCode).to.eq(200)
              cy.get('.swal2-popup').should('be.visible')
              cy.wait(2000).get('tbody > :nth-child(1) > [aria-colindex="2"]').invoke('text').then((text) => {
                const textVal = text.trim()
                Cypress.env('TRANSFER_STOCK_REFERENCE', textVal)
              })
            })
          }
        } else {
          cy.wait('@trfStockCreateCall').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
            cy.get('.swal2-popup').should('be.visible')
            cy.wait(2000).get('tbody > :nth-child(1) > [aria-colindex="2"]').invoke('text').then((text) => {
              const textVal = text.trim()
              Cypress.env('TRANSFER_STOCK_REFERENCE', textVal)
            })
          })
        }
      })
    })

    //DETAIL DATA
    // cy.get('#btn_dropdown_0__BV_toggle_').click()
    // cy.wait(500).get('#btn_detail_0').click()
    // cy.wait(500).get('#input_customer_type').should('be.disabled')
    // cy.wait(500).get('#input_tax_rate').should('be.disabled')
    // cy.wait(500).get('#input_date').should('be.disabled')
    // cy.wait(500).get('#input_outlet').should('be.disabled')
    // cy.wait(500).get('#input_coa_tax').should('be.disabled')
    // cy.wait(500).get('#input_material_0').should('be.disabled')
    // cy.wait(500).get('#input_unit_0').should('be.disabled')
    // cy.wait(500).get('#input_qty_0').should('be.disabled')
    // cy.wait(500).get('#input_price_0').should('be.disabled')
    // cy.wait(500).get('#input_total_price_0').should('be.disabled')
    // cy.wait(500).get('#input_total_tax_0').should('be.disabled')
    // cy.wait(500).get('#input_grand_total_0').should('be.disabled')
    // cy.wait(1000).get('#btn_back').click({ force: true })
  })

  it('Checking Search GL', () => {
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

    const toOutlet = Cypress.env('TRANSFER_STOCK_TO_OUTLET')
    const reference = Cypress.env('TRANSFER_STOCK_REFERENCE')

    cy.wait(1000).contains('td', `From Transfer Stock: ${reference}, To Outlet: ${toOutlet}`).should('be.visible')

    cy.get('#last-pagination-button').then($nextBtn => {
      if ($nextBtn.is(':enabled')) {
        nextPage($nextBtn)
      }
    })
  })

  function nextPage ($nextBtn) {
    const toOutlet = Cypress.env('TRANSFER_STOCK_TO_OUTLET')
    const reference = Cypress.env('TRANSFER_STOCK_REFERENCE')
    $nextBtn.click()

    cy.wait(1000)

    cy.contains('td', `From Transfer Stock: ${reference}, To Outlet: ${toOutlet}`).should('be.visible')
    cy.get('#last-pagination-button').then($nextBtn => {
      if ($nextBtn.is(':enabled')) {
        nextPage($nextBtn)
      }
    })
  }
})