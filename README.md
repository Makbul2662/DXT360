# Cypress Test Automation

This repository contains automated end-to-end (E2E) tests for platform using [Cypress](https://www.cypress.io/). It includes several plugins for advanced functionality, such as file uploads, real event simulations, and BDD support with Cucumber.

## Project Information

- **Project Name:** DXT360 Test Automation
- **Author:** Abul
- **Version:** 1.0.0
- **License:** ISC

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Running Tests](#running-tests)
  - [Interactive Mode](#interactive-mode)
  - [Headless Mode](#headless-mode)
- [Plugins Used](#plugins-used)
- [Writing Tests](#writing-tests)
- [Custom Commands](#custom-commands)
- [Configuration](#configuration)

## Getting Started

Follow these steps to set up and run the Cypress tests in this repository.

### Prerequisites

Make sure you have the following installed:

- **Node.js** (12.x or higher)
- **npm** or **yarn**

### Installation

- cd /your/project/path
- npm install cypress --save-dev

Clone the repository and install the dependencies.

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

### Running Test
The following scripts are defined in your package.json:

- npm run test: Opens Cypress in the interactive Test Runner.

- npm run start: Runs Cypress tests in headless mode.

### Plugins
This project uses the following Cypress plugins:

cypress-file-upload: Handles file uploads in tests.
- @badeball/cypress-cucumber-preprocessor: Enables behavior-driven development (BDD) with Cucumber.
- cypress-if: Allows conditional Cypress commands.
- cypress-plugin-tab: Simulates pressing the tab key.
- cypress-real-events: Simulates real user events like hover, drag, etc.

### Writing Test
```javascript
describe('Login Test', () => {
  it('should log in successfully', () => {
    cy.visit('https://example.com/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

### Custom Commands
You can define reusable commands in cypress/support/commands.js. For example, a custom login and function command:
```javascript
import "cypress-real-events/support"
Cypress.Commands.add('ValidationTopTrends', () => {
  cy.get('.my-masonry-grid', { timeout: 10000 })
  .find('.my-masonry-grid_column > div')
  .should('be.visible')
  // .should('have.length', 20).as('Show 20 top trends')
  .then($elements => {
    const numberOfItems = $elements.length;

    // Validatio if item < 20
    if (numberOfItems < 20) {
      cy.log(`Warning: Expected 20 items but found ${numberOfItems}.`)
      expect(numberOfItems).to.be.at.least(1)
    }
    else 
    {
      expect(numberOfItems).to.be.at.least(20)
    }
    })
})
```
### Configuration
```javascript
module.exports = {
  e2e: {
    baseUrl: 'https://example.com',
    env: {
      apiUrl: 'https://api.example.com',
    },
    supportFile: 'cypress/support/index.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
}
```
