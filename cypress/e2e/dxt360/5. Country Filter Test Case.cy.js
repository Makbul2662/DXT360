describe('Login functionality and navigation to dashboards', () => {
  
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
  
    it('Redirect the user to DXT360 Trendwatch dashboard and navigate to a channel then select country', () => {
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
        //The feed updates to display content filtered by the selected country
        //select country Singapore
        cy.intercept('POST', '**/trends/twitter').as('Success')
        cy.get('[id^= headlessui-listbox-button-]').click()
        cy.get('[id^= headlessui-listbox-option-]:nth-child(2)').click()
        cy.intercept('POST', '**/trends/twitter').as('Filtered')
        cy.wait(3000).get('[data-testid="twitter_desktop"]').click()
        cy.wait('@Success').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
          })
        cy.wait(5000)
        cy.url().should('include', '/sources?channel=twitter')
        cy.wait(3000)
        cy.get('.my-masonry-grid').should('be.visible')
 
          cy.wait(8000)
        cy.wait('@Filtered').then(({ response }) => {
        //Expected Result: The feed updates to display content filtered by country_code
            expect(response.body.meta.payload.country_code).to.eq("sg")
          })
          //Select country Malaysia
          cy.get('[id^= headlessui-listbox-button-]').click()
        cy.get('[id^= headlessui-listbox-option-]:nth-child(3)').click()
        cy.intercept('POST', '**/trends/twitter').as('Filtered')
        cy.wait(5000).url().should('include', '/sources?channel=twitter')
        cy.get('.my-masonry-grid').should('be.visible')
        cy.intercept('POST', '**/trends/twitter').as('Success')
        cy.wait(5000)
        cy.wait('@Success').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
          })
        cy.wait('@Filtered').then(({ response }) => {
        //Expected Result: The feed updates to display content filtered by country_code
            expect(response.body.meta.payload.country_code).to.eq("my")
          })
          //Select country Thailand
          cy.get('[id^= headlessui-listbox-button-]').click()
        cy.get('[id^= headlessui-listbox-option-]:nth-child(4)').click()
        cy.wait(5000).url().should('include', '/sources?channel=twitter')
        cy.intercept('POST', '**/trends/twitter').as('Filtered')
        cy.intercept('POST', '**/trends/twitter').as('Success')
        cy.wait(5000)
        cy.wait('@Success').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
          })
        cy.wait('@Filtered').then(({ response }) => {
        //Expected Result: The feed updates to display content filtered by country_code 
            expect(response.body.meta.payload.country_code).to.eq("th")
    })
    })
    })
    
