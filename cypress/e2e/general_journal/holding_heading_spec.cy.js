Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Heading COA', () => {
  it('passed', () => {
    cy.intercept('GET', '**/accounting/headings*').as('headingListCall')
    cy.intercept('POST', '**/accounting/headings').as('headingCreateCall')
    cy.intercept('PUT', '**/accounting/headings/*').as('headingUpdateCall')
    cy.intercept('DELETE', '**/accounting/headings/*').as('headingDeleteCall')
    const additionalVal = Math.floor(Math.random() * 900) + 100
    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_general').click({ force: true })
      cy.get('#sidebar_coa').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    cy.get('#btn_add').click()
    cy.get('#button_heading').click()
    cy.get('h4').should('contain', 'Heading')
    //SEARCH DATA
    cy.get('#input_search').type('AKTIVA LANCAR')
    cy.wait('@headingListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('[aria-rowindex="1"] > [aria-colindex="2"]').should('contain', 'AKTIVA LANCAR')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type('bendahara')
    cy.wait('@headingListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > td > div > .text-center > h4').should('contain', 'No data available in table')
    })
    cy.get('#input_search').clear()
    // ADD DATA + EDIT + DELETE
    cy.get('#input_account_number').type(`999.999.${additionalVal}`)
    cy.get('#input_desc').type(`HEAD ${additionalVal}`)
    cy.get('#button_submit').click()
    cy.wait('@headingCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
    })
    cy.get('#input_search').type(`HEAD ${additionalVal}`)
    cy.get('[aria-rowindex="1"] > [aria-colindex="2"]').should('contain', `HEAD ${additionalVal}`)
    cy.get('#btn_dropdown_0__BV_toggle_').click()
    cy.get('#btn_edit_0').click()
    cy.get('#input_account_number').clear()
    cy.get('#input_account_number').type(`999.999.${additionalVal}`)
    cy.get('#input_desc').clear()
    cy.get('#input_desc').type(`HEAD ${additionalVal} EDIT`)
    cy.get('#button_submit').click()
    cy.wait('@headingUpdateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
    })
    cy.get('#input_search').clear()
    cy.get('#input_search').type(`HEAD ${additionalVal} EDIT`)
    cy.get('[aria-rowindex="1"] > [aria-colindex="2"]').should('contain', `HEAD ${additionalVal} EDIT`)
    cy.get('#input_search').clear()
    cy.get('#input_search').type(`HEAD ${additionalVal} EDIT`)
    cy.get('#btn_dropdown_0__BV_toggle_').click()
    cy.get('#btn_delete_0').click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.wait('@headingDeleteCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
    })
    cy.get('#input_search').clear()
  })
})