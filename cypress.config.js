const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultCommandTimeout: 10000,
  responseTimeout: 1200000,
  e2e: {
    baseUrl: 'https://api.example.com/v1',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
