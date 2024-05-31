Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Flow Inventory Monitoring Part Price', () => {
  it('passed', () => {
    cy.intercept('GET', '**/inventory/groups').as('groupListCall')
    cy.intercept('GET', '**/koperasi/access/organization').as('organizationListCall')
    cy.intercept('GET', '**/inventory/monitors/parts*').as('monitorPartsListCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('li > #sidebar_inventory').should('be.visible')
      cy.get('#sidebar_inventory').click({ force: true })
      cy.get('#sidebar_monitor_part').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })
    //SEARCH DATA
    cy.get('#input_search').type('FRESHMILK GREENFIELD')
    cy.wait('@monitorPartsListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('tbody > tr > [aria-colindex="2"]').should('contain', 'FRESHMILK GREENFIELD')
    })

    cy.get('#input_search').clear()
  })
})