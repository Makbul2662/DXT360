    describe('Verify the login functionality with valid and invalid credentials', () => {
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
    
  
    it('Appropriate error message is displayed, and the user is not logged in', () => {
      cy.get('input[type="text"]').type('qa.test.trendwatch@sonar.id',{delay: 50})
      cy.get('input[type="password"]').type('ini password salah')
      cy.wait(1000).get(':nth-child(2) > .relative > .absolute').click().as('show password')
      cy.get('button[type="submit"]').click({force:true})
      cy.get('.transition-colors').should('be.visible')
      cy.wait(3000).get('button[type="submit"]').click({force:true})
      // Verifikasi bahwa pesan error muncul
      cy.wait(3000).get('.mb-10').should('be.visible')
        .and('contain', 'We could not find that email and password combination').as('Error message is displayed')

    })
  })