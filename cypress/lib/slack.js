require('dotenv').config()
let fs = require('fs')
const axios = require('axios')
const path = require('path')
const cenariosErro = path.resolve('output', 'errorReport.json')
const buffer = fs.readFileSync(cenariosErro, 'utf-8')

//error output messages
let contentJson = JSON.parse(buffer)
let message = ''
let messageCounter = 0
let flakeCounter = 0

let screenshot = path.resolve('screenshotsPage.html')
console.log(screenshot)

// error and flake counter, as well as details of each test are set in this forEach
contentJson.cenarios.funcionalidade.forEach(element => {
    if (element.title[2]) { //if theres 2 items under element.title it means its a backend test
        message+=`*Describe:* ${element.title[0]}\n*Context:* ${element.title[1]}\n*Test:* ${element.title[2]}\n*Error:* ${element.error}\n\n\n`
        let str = element.title[2].split(' ');
        str[str.length - 1] === 'flake' ? flakeCounter+=1 : flakeCounter
    } 
    else { //otherwise, its a frontend test. them both have different properties that must be set properly in order to send the webhook message.
        message+=`*Feature:* ${element.title[0]}\n*Scenario Outline:* ${element.title[1]}\n*Error:* ${element.error}\n\n\n`
        let str = element.title[1].split(' ');
        str[str.length - 1] === 'flake' ? flakeCounter+=1 : flakeCounter
    }
    messageCounter+=1
})

//verifying the condition of whether all the errors are flake or not
let flakeCheck = messageCounter === 0 ? false : (messageCounter === flakeCounter ? true : false)

//verifying the condition of whether someone must be mentioned or not
let mentionCheck = messageCounter !== 0 && flakeCheck === false ? true : false

//defining if all are flake, if there are errors or not based on flakecheck and messageCounter results
let reportResult = flakeCheck ? 'Build has flake errors... :|' : (messageCounter != 0 ? 'Build has failed! :(' : 'Build was successfull! :)') 
//defining the proper color
let reportColor = flakeCheck ? '#FFFF00' : (messageCounter != 0 ? '#d60207' : '#52a447')
//defining if its under the max messages limit from slack, and which message to send
let reportMessage = flakeCheck ? `*Except flake errors (${flakeCounter}), all other specs were successfull!!!*\n\nGood work devs!` : (
    messageCounter === 0 ? '*Every spec was successfull!!!*\n\nGood work devs!' : (
        messageCounter >= 10 ? '*A ton of specs have failed... Please check GCP url to see all of them.*' : message
    )
)

//links and env variables definition
let GCS_URL = "https://storage.googleapis.com"
let GCB_URL = "https://console.cloud.google.com"

//defining the env variables
const reportPath = process.env.HTML_PATH
const bucketName = process.env.GCS_BUCKET
const bucketReportFolder = process.env.REPORT_FOLDER
const projectId = process.env.PROJECT_ID
const buildId = process.env.BUILD_ID
const repoName = process.env.REPO_NAME
const branchName = process.env.BRANCH_NAME
const commit = process.env.COMMIT_SHA
const slackWebhook = process.env.SLACK_WEBHOOK
const currentDate = process.env.DATE_TIME
const triggerName = process.env.TRIGGER_NAME

//sets the user/team qa to be mentioned in the channel
let teamQa = '<@INSERT-YOUR-SLACK-ID-HERE>, <@AND-ADD-ANOTHER-ONE-IF-YOU-WANT-TO>'

//defining the urls for the report
const cloudbuildUrl = `${GCB_URL}/cloud-build/builds/${buildId}?project=${projectId}`
const mochawesomeBucketUrl = `${GCS_URL}/${bucketName}/${bucketReportFolder}/${repoName}/${currentDate}/${reportPath}/mochawesome.html`
const screenshotBucketUrl = `${GCS_URL}/${bucketName}/${bucketReportFolder}/${repoName}/${currentDate}/${reportPath}/screenshotsPage.html`

//defining axios config and slack data
const config = {
    method: 'post',
    url: slackWebhook,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    data: {
        type: 'mrkdwn',
        text: `\n\n\n *${reportResult}*\n\n\n  ${mentionCheck?'*Test Failed Outside Flake!!!*: '+teamQa+'\n\n\n  ':''}*Repo:* ${repoName}\n\n  *Branch Name:* ${branchName}\n\n  *Commit:* ${commit}\n\n  *Trigger:* ${triggerName}\n\n  *Mochawesome Report Url:* ${mochawesomeBucketUrl}\n\n  ${screenshot?'*Screenshots Page Url*: '+screenshotBucketUrl:''}\n\n  *Cloudbuild Run Url:* ${cloudbuildUrl}\n\n\n*Results:*\n\n`,
        attachments: [
            {
                'color': `${reportColor}`,
                'blocks': [
                    {
                        'type': 'section',
                        'text': {
                            'type': 'mrkdwn',
                            'text': `${reportMessage}`
                        },
                    }
                ]
            }
        ]
    }
}

//send axios request and logs response & error
axios(config)
.then(function (response) {
    console.log(JSON.stringify(response.data));
})
.catch(function (error) {
    console.log(error);
})