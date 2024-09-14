describe('Verify that the user can navigate between different channel tabs', () => {

  before(() => {
    cy.visit('https://login-demo360.sonarplatform.com')
    cy.get('input[type="text"]').type('qa.test.trendwatch@sonar.id', { delay: 70 });
    cy.get('input[type="password"]').type('tR3nD_watc#');
    cy.get('.transition-colors').should('be.visible').and('be.enabled');
    cy.get('button[type="submit"]').click()
    cy.intercept('POST', '**/callback/credentials').as('Login')
    cy.get('main').should('be.visible')
      .then(() => {
        cy.log('User is logged in successfully and redirected to the Application Switcher page')
      })
    cy.wait('@Login').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
    })
  })

  it('Redirect the user to DXT360 Trendwatch dashboard and click each channel tab', () => {
    cy.wait(5000).contains('main')
    const findAndClickButton = (selector) => {
      cy.get('main').then(($main) => {
        if ($main.find(selector).length > 0) {
          cy.get(selector)
            .should('be.visible')
            .and('be.enabled')
            .contains('Open App')
            .click();
        } else {
          cy.log(`Element ${selector} not found.`);
        }
      });
    };

    cy.get('main').then(($main) => {
      if ($main.find(':nth-child(2) > .p-4 > .flex > .bg-primary-600').length > 0) {
        findAndClickButton(':nth-child(2) > .p-4 > .flex > .bg-primary-600');
      } else {
        cy.log('Checking nth-child(3)...');
        findAndClickButton(':nth-child(3) > .p-4 > .flex > .bg-primary-600');
      }
    })
    cy.wait(5000).url().should('include', '/sources?channel=twitter')
    cy.get('#__next').should('be.visible')
      .then(() => {
        cy.log('User is redirected to DXT360 Trendwatch dashboard');
      })
    cy.get('.h-16').should('be.visible')
    cy.get('img')
      .should('be.visible')
      .and(($img) => {
        expect($img).to.have.attr('src').that.includes('/logo.png')
      })
    //Expected : Validation Page got 20 top trends for each channel
    cy.get('[data-testid="facebook_desktop"]').click()
    cy.get('.text-h5').contains('Facebook - 20 Top Trends').as('Facebook page')
    cy.get('[data-testid="twitter_desktop"]').click()
    cy.get('.text-h5').contains('Twitter - 20 Top Trends').as('Twitter page')
    cy.get('[data-testid="youtube_desktop"]').click()
    cy.get('.text-h5').contains('Youtube - 20 Top Trends').as('Youtube page')
    cy.get('[data-testid="google_desktop"]').click()
    cy.get('.text-h5').contains('Google - 20 Top Trends').as('Google page')
    cy.get('[data-testid="forum_desktop"]').click()
    cy.get('.text-h5').contains('Forum - 20 Top Trends').as('Forum page')
    cy.get('[data-testid="instagram_desktop"]').click()
    cy.get('.text-h5').contains('Instagram - 20 Top Trends').as('Instagram page')
    cy.get('[data-testid="tiktok_desktop"]').click()
    cy.get('.text-h5').contains('TikTok - 20 Top Trends').as('Tiktok page')
  })
})
