# github-release-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that generates Github releases in draft upon pull request merge. Deployed on Heroku: https://dashboard.heroku.com/apps/evening-sierra-59086

## Heroku
Find instructions for deployment to Heroku here: https://probot.github.io/docs/deployment/#heroku

## Enabling the bot on a repository

1. Go to [tableau-mkt-release-notes-bot settings](https://github.com/organizations/tableau-mkt/settings/installations/1171165).
  - Add the repository you wish to enable the app on under Repository Access, then save.
2. Then go to settings page of the repository you want to enable the app on. 
  - Click on webhook in the lefthand list on the repository settings page.
  - Then click on add webhook, and enter the following values in the fields. 
    - Payload URL: https://github-release-drafter.herokuapp.com/
    - Content type: application/json
    - Secret: find this in KeePass under Misc Web Tools, Github tableau mkt release notes (bot)
    - Which events would you like to trigger this webhook? Select `Pull Requests` under 'Let me select individual events'.
    - Enable checkbox 'Active'.
