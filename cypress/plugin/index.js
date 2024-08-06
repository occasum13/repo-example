require('dotenv').config()
const postgreSQL = require('cypress-postgresql')
const pg = require('pg')
const fs = require('fs')
const path = require('path')
const prettier = require('prettier')
const outputDir = 'output'
const scenariosErrors = path.resolve('./output', 'errorReport.json')
const screenshotErrors = path.resolve('./output','screenshotsInBase64.txt')

// setting db configurations
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE
}

// setting cenariosComErro to stash scenarios with errors
let cenariosComErro = {
    cenarios: {
        funcionalidade: [],
    }
}

function appendStringToFile(testData) {
    const sourceDir = path.resolve('cypress', `screenshots/${testData.file}/${testData.screenshot}`)
    const bitmap = fs.readFileSync(sourceDir);
    const base64 = Buffer.from(bitmap).toString('base64');
    let fileContent = '';
    console.log(sourceDir)

    // Read existing content from file (if it exists)
    try {
        fileContent = fs.readFileSync(screenshotErrors, 'utf-8');
    } catch (err) {
        // Handle file read error or initialize with empty string if file doesn't exist
        console.error(`Error reading file ${screenshotErrors}: ${err.message}`);
    }

    // Append new string, separating with comma
    if (fileContent !== '') {
        fileContent += `,${base64}`;
    } else {
        fileContent = base64;
    }

    // Write updated content back to file
    try {
        fs.writeFileSync(screenshotErrors, fileContent);
        globalThis.base64Data = fileContent
        console.log(`New string appended to file ${screenshotErrors}`);
    } catch (err) {
        // Handle file write error
        console.error(`Error writing file ${screenshotErrors}: ${err.message}`);
    }
}

// create the file to stash errors in output/
function createReportError(data) {
    const obj = JSON.stringify(data)
    return fs.writeFileSync(scenariosErrors, prettier.format(
        obj, { semi: true, parser: 'json' }), err => {
            if (err) return err
        })
}

// deletes the report
function deleteReportError() {
    let data = { 'cenarios': { 'funcionalidade': [] } }
    fs.writeFileSync(scenariosErrors, JSON.stringify(data, null, 2), 'utf8')
}

// function to read the report
function readReportError() {
    const buffer = fs.readFileSync(scenariosErrors, 'utf-8')
    let contentJson = JSON.parse(buffer)

    return contentJson
}

// push data to file
function scenariosWithError(testData) {
    let contentJson = readReportError()
    contentJson.cenarios.funcionalidade.push(testData)
    createReportError(contentJson)
}

module.exports = (on, config) => {
    on('before:run', () => {
        console.log('override before:run');

        if (fs.existsSync(outputDir)) {
            deleteReportError()
        } else {
            fs.mkdirSync(outputDir)
        }
        const obj = JSON.stringify(cenariosComErro)

        fs.writeFileSync(screenshotErrors, '')

        return (
            fs.writeFileSync(scenariosErrors, prettier.format(obj, { semi: true, parser: 'json' }), err => { if (err) return err })
        )
    })

    on('after:run', () => {
        console.log('override after:run');
    });
    
    on('task', {
        errorCenarios: (testData) => {
            scenariosWithError(testData)
            return null
        },
        screenshots: (testData) => {
            appendStringToFile(testData)
            return null
        }
    });

    const pool = new pg.Pool(dbConfig)
    tasks = postgreSQL.loadDBPlugin(pool)
    on('task', tasks)
    return config
}

