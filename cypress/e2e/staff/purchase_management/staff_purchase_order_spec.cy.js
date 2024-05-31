Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Purchase Management Purchase Order', () => {
  it('Created PO', () => {
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
    //ADD DATA
    cy.get('#btn_add').click()
    cy.wait('@companyContactListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('#validator_supplier > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(2000).get('#input_supplier-1').click()
    })
    cy.get('#input_date').type('2024-04-22')
    cy.wait('@partListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('.multiselect__select').click({ force: true, multiple: true })
      cy.wait(2000).get('#input_part_0-1').click()
    })
    cy.get('#input_quantity').clear()
    cy.wait(500).get('#input_quantity').type('10')
    cy.wait(1000).get('#input_unit_0').find('option').eq(0).invoke('val').then((value) => {
      cy.get('#input_unit_0').select(value)
    })
    cy.get('#input_price_0').clear()
    cy.get('#input_price_0').type('90000')
    cy.get('#input_notes').type('testing automation new product', { delay: 75 })
    cy.get('#section_sub_total').should('be.visible')
    cy.get('#value_sub_total').should('be.visible')
    cy.contains('#value_sub_total', /Rp\s9\.000\.000,00/)
    cy.get('#section_grand_total').should('be.visible')
    cy.get('#value_grand_total').should('be.visible')
    cy.contains('#value_grand_total', /Rp\s9\.000\.000,00/)

    cy.get('#btn_submit').click()
    cy.wait('@poValidateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#modal_unverified').then(($modal) => {
        if ($modal.length > 0) {
          if ($modal.is(':visible')) {
            cy.get('#btn_modal_submit').click()
            cy.wait('@poCreateCall').then(({ response }) => {
              expect(response.statusCode).to.eq(200)
              cy.get('.swal2-popup').should('be.visible')
              cy.wait(2000).get('tbody > :nth-child(1) > [aria-colindex="5"]').should('contain', 'Waiting')
            })
          } else {
            cy.wait('@poCreateCall').then(({ response }) => {
              expect(response.statusCode).to.eq(200)
              cy.get('.swal2-popup').should('be.visible')
              cy.wait(2000).get('tbody > :nth-child(1) > [aria-colindex="5"]').should('contain', 'Approved')
            })
          }
        } else {
          cy.wait('@poCreateCall').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
            cy.get('.swal2-popup').should('be.visible')
            cy.wait(2000).get('tbody > :nth-child(1) > [aria-colindex="5"]').should('contain', 'Approved')
          })
        }
      })
    })
    //DETAIL
    // cy.get('#btn_dropdown_action_0__BV_toggle_').click()
    // cy.get('#btn_detail_0').click()
    // cy.wait('@poDetailCall').then(({ response }) => {
    //   expect(response.statusCode).to.eq(200)
    //   cy.get('.main-content').should('contain', 'Detail Purchase Order')
    //   cy.get('#input_supplier').should('be.disabled')
    // })
    // cy.get('#input_order_number').should('be.disabled')
    // cy.get('#input_date').should('be.disabled')
    // cy.get('#item_2').should('be.disabled')
    // cy.get('#input_quantity_0').should('be.disabled')
    // cy.get('#item_5').should('be.disabled')
    // cy.get('#item_6').should('be.disabled')
    // cy.get('#input_notes').should('be.disabled')
    // cy.get('#btn_back').click()
  })
  it('Passed Approve PO', () => {
    cy.intercept('GET', '**/inventory/purchase-orders*').as('poListCall')
    cy.intercept('POST', '**/inventory/purchase-orders-approve').as('poApproveCall')
    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_order_entry').click({ force: true })
      cy.get('#sidebar_approve_po').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    cy.get('tbody > :nth-child(1) > [aria-colindex="5"]').invoke('text').then((text) => {
      const cellValue = text.trim()
      if (cellValue == 'Waiting') {
        cy.get('tbody > :nth-child(1) > [aria-colindex="7"]').should('be.visible')
        cy.get('#chk_approve_po_0 > .custom-control').click()
        cy.get('#btn_approve_po').click().should('be.visible')
        cy.get('.swal2-popup').should('be.visible')
        cy.get('.swal2-confirm').click()
        cy.wait(2000).get('.swal2-popup').should('be.visible')
        cy.wait(2000).get('tbody > :nth-child(1) > [aria-colindex="5"]').should('contain', 'Approved')
      } else {
        cy.log('Purchase Order Approved').as('Purchase Order Approved Success')
      }
    })

  })
})