This is an example repo to run cypress alongside an integration between Cypress, Mochawesome Report, Slack, GCP Triggers and Bucket.

1. run "npm i"
2. check cypress/lib/slack.js and set up proper IDS in line 71
3. check cypress.config.js and set up your data in lines 19, 20, 21.
4. check .env-example, copy and create your own .env (don't worry about the envs with local-testing in them, they need to be set up in gcp)
5. check devops/ci/example/cloudbuild.yaml and set up your instances and bucket folders names.