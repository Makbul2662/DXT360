describe('Verify the switch between Slide, Table and TV', () => {

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

    it('Redirect the user to DXT360 Trendwatch and analytics dashboard', () => {
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
        //Slide view mode
        cy.get('[data-testid="facebook_desktop"]').click()
        cy.get('.p-1.px-4.py-2.rounded-2xl:nth-child(1)').click().as('Slide view')
        cy.get('.flex.items-center.space-x-4').should('be.visible').as('displayed slide view')
        //table view mode
        cy.get('.p-1.px-4.py-2.rounded-2xl:nth-child(2)').click().as('Table view')
        cy.get('.text-h5').contains('Facebook - 20 Top Trends').as('Displayed Table format')
        cy.ValidationTopTrends()
        //Tv mode view
        const stub = cy.stub();
        cy.document().then(doc => {
            doc.documentElement.requestFullscreen = stub
        })
        cy.wait(3000).get('.relative.group.inline-block > .p-2.rounded-full.cursor-pointer').click().as('Tv mode')
        cy.wait(3000).get('.relative.group.inline-block > .p-2.rounded-full.cursor-pointer')
            .then(() => expect(stub).to.be.called)
        cy.viewport(2999, 2999).as('Full screen tv mode')
        //Full screen (TV Mode) in cypress not supported, that's why I can't show you a result 
    })
})
