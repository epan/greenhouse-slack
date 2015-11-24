# greenhouse-slack integration
>Pipes events from candidate tracking app [Greenhouse](greenhouse.io) into [Slack](slack.com) channels

## What it does

1. Takes webhook events in Greenhouse
2. Forms a Slack message and posts it to a Slack channel
3. Can filter for specific job IDs

## How to get it

1. Make sure you have Developer Permissions in Greenhouse so you can see and make webhooks in Greenhouse
2. Make sure you have permissions to create and modify Slack integrations
3. Set up a webhook in Greenhouse for both New Application Submitted and Application Status Change
4. Set up a hosting thing like Heroku
5. Configure the Slack integration to receive it
6. Have fun wondering why the steps above are so vague
