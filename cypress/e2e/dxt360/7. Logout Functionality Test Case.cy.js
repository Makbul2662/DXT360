describe('Verify the logout functionally', () => {

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
    it('Redirect the user to DXT360 Trendwatch and analytics dashboard then logout', () => {
        // Pilih DXT360 Trendwatch dashboard
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
        cy.wait(5000)
        cy.url().should('include', '/sources?channel=twitter')
        cy.get('#__next').should('be.visible')
            .then(() => {
                cy.log('User is redirected to DXT360 Trendwatch dashboard')
            })
        cy.get('.h-16').should('be.visible')
        cy.get('img')
            .should('be.visible')
            .and(($img) => {
                expect($img).to.have.attr('src').that.includes('/logo.png')
            })
        cy.get('.group.relative.z-50').eq(1).should('be.visible')
        cy.get('.group.relative.z-50').eq(1).realHover('mouse')
        cy.wait(5000).get('.space-y-2 > button').click().as('Button Logout')
        cy.get('[id^=headlessui-dialog-panel-]').should('be.visible').as('Pop Up Logout')
        cy.get('[id^=headlessui-dialog-panel-] > .flex.gap-2.mb-2 > button:nth-child(2)').click().as('Confirm Logout')
        cy.url().should('include', '//login-demo360.sonarplatform.com').as('Back to login page')
    })
})