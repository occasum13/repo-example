This is an example repo to run cypress alongside an integration between Cypress, Mochawesome Report, Slack, GCP Triggers and Bucket.

1. run "npm i";
2. check cypress/lib/slack.js and set up proper IDS in line 71;
3. check cypress.config.js and set up your data in lines 19, 20, 21;
4. check .env-example, copy and create your own .env (don't worry about the envs with local-testing in them, they need to be set up in gcp);
5. get a slack channel webhook to put it inside .env and properly set the slack channel;
5. check devops/ci/example/cloudbuild.yaml and set up your instances and bucket folders names;
6. setup your gcp environment properly (remember to setup the devops/ci path and the variables too, but keep in mind that some of them don't have to be explicit, check gcp variables documentation.);

How to run configs locally for test porpuses after configuration:

1. run cypress however you'd like
2. run "npm run merge-reports" to unite every spec in one report
3. run "npm run generate-html" to create a html file containing the results
4. run "npm run screenshotPage-generator" to create a html file containing the printscreens (if they exist)
5. run "npm run slack-notify" to send the message through the configured webhook/slack channel.
6. enjoy your integration :D