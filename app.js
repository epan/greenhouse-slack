'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Variables for Slack incoming webhook url
var GREENHOUSE_EVENT_SLACK_WEBHOOK_URL = process.env.GREENHOUSE_EVENT_SLACK_WEBHOOK_URL;
var slack = require('slack-notify')(GREENHOUSE_EVENT_SLACK_WEBHOOK_URL);

// Middleware
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json()); // for parsing application/json

// Endpoints
app.get('/', function (req, res) {
  res.send('Hullo Werld!');
});

app.get('/greenhouse-event', function (req, res) {
  res.send('Feed me Greenhouse webhooks plz thx.');
  res.sendStatus(200);
});

app.post('/greenhouse-event', function (req, res) {
  // Store JSON payload from Greenhouse
  var content = req.body;

  // Candidate info
  var candidate_id = content.payload.application.candidate.id;
  var candidate_name = content.payload.application.candidate.first_name + " " + content.payload.application.candidate.last_name;
  var candidate_email = content.payload.application.candidate.email_addresses[0].value;
  var candidate_email_link = '<mailto:' + candidate_email + '|' + candidate_email + '>';

  // Job and application info
  var job_name = content.payload.application.jobs[0].name;
  var application_id = content.payload.application.id;
  var application_source = content.payload.application.source.public_name;
  var design_jobs = [
    'Head of Design', // job_id: 123548
    'Product Designer', // job_id: 122173
    'User Experience Researcher', // job_id: 123549
    'Communication Designer' // job_id: 123547
  ];

  // For Slack content string formation
  var bot_title = '';
  var message = '';
  var summary = '';
  var application_greenhouse_link = '<https://app.greenhouse.io/people/' + candidate_id + '?application_id=' + application_id  + '#candidate_details' + '|View in Greenhouse>';

  // Makes the Greenhouse webhook test ping gods pleased
  res.sendStatus(200);

  // Format the content for Slack
  bot_title = 'New Applicant';
  message = '*' + candidate_name + '*' + ' applied to ' + '*' + job_name + '*';
  summary = candidate_name + '\n' +
            job_name + '\n' +
            'via ' + application_source + '\n' +
            candidate_email_link + '\n' +
            application_greenhouse_link;

  // Send the formated message to Slackbot incoming webhook
  slack.send({
    icon_emoji: ':eyes:',
    username: bot_title,
    text: message,
    attachments: [
      {
        fallback: 'Check Greenhouse for more details.',
        fields: [
          {
            title: 'Application',
            value: summary,
            short: true
          }
        ]
      }
    ]
  });

  // Check if job is one of the design_jobs
  var is_design_jobs = design_jobs.indexOf(job_name) > -1;
  if (is_design_jobs) {
    slack.send({
      channel: '#design-candidates',
      color: '#7CD197',
      icon_emoji: ':eyes:',
      username: bot_title,
      text: message,
      attachments: [
        {
          fallback: 'Check Greenhouse for more details.',
          fields: [
            {
              title: 'Application',
              value: summary,
              short: true
            }
          ]
        }
      ]
    });
  }
});


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
