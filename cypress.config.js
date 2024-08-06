/* eslint-disable indent */
const { defineConfig } = require('cypress')
require('dotenv').config()

module.exports = defineConfig({
	reporter: 'cypress-multi-reporters',
	reporterOptions: {
		configFile: 'reporter-config.json',
	},
  e2e: {
    setupNodeEvents(on, config) {
      require ('cypress-mochawesome-reporter/plugin')(on);
      require ('./cypress/plugin/index')(on, config);
			return config
    },
    defaultCommandTimeout: 30000,
    responseTimeout: 30000,
    requestTimeout: 30000,
    username: 'insert-your-username-here',
		password: 'insert-your-password-here',
    baseUrl: 'insert-your-url-here',
    video: false,
    videoCompression: 0,
    retries: 3,
    screenshotOnRunFailure: true,
    experimentalRunAllSpecs: true
  },
})

