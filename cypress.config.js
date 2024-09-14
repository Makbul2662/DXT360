const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1366,
  viewportHeight: 768,
  projectId: "3r6tqi",

  e2e: {
    baseUrl: 'https://login-demo360.sonarplatform.com',
    experimentalStudio: true,
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config){

    }
  },
  env: {
  },  
  video: true,
});
