Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

function searchDataForLastRow (date, name) {
  return cy.get('table tbody tr:last-child').then(($row) => {
    const rowDate = $row.find('td:nth-child(2)').text().trim()
    const rowName = $row.find('td:nth-child(3)').text().trim()

    if (rowDate === date && rowName === name) {
      cy.get('table tbody tr:last-child td:nth-child(2)').should('contain.text', date).as('Data for new date founded')
      cy.get('table tbody tr:last-child td:nth-child(3)').should('contain.text', name).as('Data for new name founded')
    } else {
      lastPage()
      cy.wait(1000)
      searchDataForLastRow(date, name)
    }
  })
}

function searchDataInAPAging (name) {
  return cy.get('table tbody tr:last-child').then(($row) => {
    const rowName = $row.find('td:nth-child(1)').text().trim()
    cy.log(rowName)

    if (rowName === name) {
      cy.get('table tbody tr:last-child td:nth-child(1)').should('contain.text', name).as('Data for new name founded')
    } else {
      cy.wait(1000)
      agingLastPage()
      cy.wait(1000)
      searchDataInAPAging(name)
    }
  })
}

function lastPage () {
  cy.get('#last-pagination-button').click()
}
function agingLastPage () {
  cy.get('#last-pagination-button').should('be.visible')
  cy.get('#last-pagination-button').scrollIntoView()
  cy.get('#last-pagination-button').click()
}

function isLastPage () {
  return cy.get('#last-pagination-button').should('have.attr', 'disabled')
}

describe('Flow Account Payable', () => {
  it('passed', () => {
    const currentDate = new Date().toISOString().slice(0, 10)

    cy.intercept('GET', '**/accounting/ap*').as('apListCall')
    cy.intercept('GET', '**/inventory/taxes').as('taxesListCall')
    cy.intercept('GET', '**/accounting/company-contacts*').as('companyContactListCall')
    cy.intercept('GET', '**/accounting/coa*').as('coaListCall')
    cy.intercept('POST', '**/accounting/ap-transaction').as('apCreateCall')

    cy.Login(Cypress.env('EMAIL_HOLDING_USER'), Cypress.env('PASSWORD')).then(() => {
      cy.get('#sidebar_account_payable').click({ force: true })
      cy.get('#sidebar_ap_search').click({ force: true })
    })
    cy.reload().then(() => {
      cy.get('body').click()
    })

    //ADD DATA
    cy.get('#btn_add').click()
    const additionalVal = Math.floor(Math.random() * 900) + 100
    cy.get('.multiselect__tags').should('be.visible')
    cy.get('#validator_vendor > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
    cy.wait(1000).get('#input_vendor-0').invoke('text').then((text) => {
      const textVal = text.trim()
      Cypress.env('CUSTOMER_AP', textVal)
    })
    cy.wait(1000).get('#input_vendor-0').click()
    cy.get('#input_currency').select('Indonesia Rupiah')
    cy.get('#input_description').type(`desc-${additionalVal}`)
    cy.get('#input_notes').type(`notes-${additionalVal}`)
    cy.get('#input_order_number').type(`OR-${additionalVal}`)
    cy.get('#input_due_date').type(currentDate)
    cy.get('#input_po_number').type(`PO-${additionalVal}`)
    cy.get('#input_internal_notes').type(`internal-notes-${additionalVal}`)
    cy.get('#input_amount_0').clear()
    cy.get('#input_amount_0').type('400000')
    cy.wait('@coaListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('#validator_input_account_0 > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#input_account_0-0').click()
    })
    cy.get('#input_description_0').type(`item description ${additionalVal}`)
    cy.get('.custom-control').click()
    cy.wait('@taxesListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('#input_tax_0').find('option').eq(0).invoke('val').then((val) => {
        cy.get('#input_tax_0').select(val)
      })
    })
    cy.get('#input_tax_type_0').find('option').eq(0).invoke('val').then((val) => {
      cy.get('#input_tax_type_0').select(0)
    })
    cy.wait('@coaListCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.multiselect__tags').should('be.visible')
      cy.get('#validator_additional > .form-group > div > .multiselect > .multiselect__select').click({ force: true, multiple: true })
      cy.wait(1000).get('#input_additional-0').click()
    })
    cy.get('#btn_submit').click()
    cy.wait('@apCreateCall').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      cy.get('.swal2-popup').should('be.visible')
      const vendorName = Cypress.env('CUSTOMER_AP')
      cy.wait(2000)
      searchDataForLastRow(currentDate, vendorName)
      cy.get('#sidebar_account_payable').click({ force: true })
      cy.get('.active > .dropdown-menu > .nav-item > .nav-link > .text-dark').click({ force: true })
      cy.get('#report-AP > :nth-child(2) > #sidebar_laporan_umur_piutang > .text-dark').click({ force: true })

      cy.reload().then(() => {
        cy.get('body').click()
      })

      cy.wait(2000)
      searchDataInAPAging(vendorName)

    })
  })
})