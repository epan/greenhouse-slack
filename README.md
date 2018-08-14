# greenhouse-slack integration
>Pipes events from candidate tracking app [Greenhouse](greenhouse.io) into [Slack](slack.com) channels

## What it does

1. Takes webhook events in Greenhouse
2. Forms a Slack message and posts it to a Slack channel
3. Can filter for specific job IDs

## How to get it

1. Make sure you have Developer Permissions so you can see and make webhooks in Greenhouse
2. Make sure you have permissions to create and modify Slack integrations
3. Set up a hosting thing like Heroku:
  - You'll need to set `GREENHOUSE_EVENT_SLACK_WEBHOOK_URL` as the webhook you created in slack 
  - You'll need to set `GREENHOUSE_JOB_IDS` as a comma separated version of your job IDs e.g. `116,1913`
  - You'll need to set `SLACK_CHANNEL_NAME` as the channel you set up the webhook for e.g: `#design-candidates`
4. Set up two webhooks in Greenhouse for both New Application Submitted and Application Status Change
  - One for a new candidate, the url is `[server]/new-applicant`
  - One for the status changes for a candidate, the url is `[server]/status-applicant`
5. Configure the Slack integration to receive it
6. Have fun wondering why the steps above are so vague
