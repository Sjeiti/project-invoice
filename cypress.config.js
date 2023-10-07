const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'h4bvkf',
  video: false,
  localStorage: 'cypress/fixtures/localStorageData.json',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    excludeSpecPattern: [/*'components/!*.spec*.js', '!*.spec*.js'*/],
    specPattern: 'src/**/*.spec.{js,jsx,ts,tsx}',
    baseUrl: 'https://localhost:4212',
  },
})
