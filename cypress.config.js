const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1980,
  viewportHeight: 1000,
    projectId: 'cnhqk3',
    

  e2e: {
    baseUrl: 'http://staging-inventory-accounting.simkokar.com',
    experimentalStudio: true,
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      
      // implement node event listeners here
    },
    env: {
      EMAIL_HOLDING_USER: 'holding@kokarmina.com',
      PASSWORD: 'Kokarmina123',
      EMAIL_STAFF_USER: 'enahsukanah125@gmail.com',
      EMAIL_UNIT_USER: 'nenengsuryaningsih8@gmail.com',
      NUMBER_OF_PART: '',
      TRANSFER_STOCK_TO_OUTLET: '',
      TRANSFER_STOCK_REFERENCE: '',
      STOCK_OP_NAME_REFERENCE: '',
      CUSTOMER_AP: ''
    },
    retries: 2
  },
});
