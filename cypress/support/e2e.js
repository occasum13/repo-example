import postgreSQL from 'cypress-postgresql'
postgreSQL.loadDBCommands()

// import './commands'

import 'faker-br'
import 'cypress-mochawesome-reporter/register';

// this section was prepared to grab the first screenshot name error and if it fails all 4 attempts (depends on what you've set on cypress.config.js) it saves the results and grabs the first
//screenshot. But if it fails only once instead of every single time it won't keep the screenshots.

// this will run after each test
afterEach(() => {
    // this validates if the test has or hasn't passed and if it's the first try [0] or not.
    if (Cypress.mocha.getRunner().suite.ctx.currentTest.state != 'passed' 
        && Cypress.mocha.getRunner().suite.ctx.currentTest._currentRetry == 0) {
        // if it's the first try, it'll save these variables
        var testTitle = Cypress.currentTest.titlePath
        var filePath = Cypress.mocha.getRunner().suite.ctx.currentTest.invocationDetails.relativeFile
        var fileName = filePath.split('/').pop()
        var testName = testTitle[2].replace(/\s+/g, '_').toLowerCase()
        // mount proper screenshot path
        var screenshotPath = `${testTitle[0]+' -- '+testTitle[1]+' -- '+testTitle[2]+' (failed).png'}` 
      
        // setupt this object with the proper data
        globalThis.testData = {
            // the name of the file
            file: fileName,
            // the name of the test
            test: testName,
            // the path for the cypress screenshot from said file/test
            screenshot: screenshotPath
        }
    } // if this above doesn't pass, it'll check if it's the last retry. 
    else if (Cypress.mocha.getRunner().suite.ctx.currentTest.state != 'passed' 
        && Cypress.mocha.getRunner().suite.ctx.currentTest._currentRetry == 3) { 
        var testTitle = Cypress.currentTest.titlePath
        var data = {
            title: testTitle,
            error: Cypress.mocha.getRunner().suite.ctx.currentTest.err.message
        }

        // these functions are the same from the plugin/index.js file. Only if the test has failed all attempts it'll run both scripts.
        cy.task('errorCenarios', data)
        cy.task('screenshots', globalThis.testData)
    }
})

// this is something usefull to avoid website errors that sometimes may occur from nowhere.
Cypress.on('uncaught:exception', () => {
    return false
})