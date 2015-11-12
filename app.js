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

app.get('/new-design-applicant', function (req, res) {
  res.send('Feed me Greenhouse designer webhooks plz thx.');
  // res.sendStatus(200);
});

app.post('/new-design-applicant', function (req, res) {
  // Makes the Greenhouse webhook test ping gods pleased
  if (req.body.action === 'ping' || 'new_candidate_application') {
    res.sendStatus(200);
  }

  // Store JSON payload from Greenhouse
  var application = req.body.payload.application;

  // Candidate info
  var candidateId = application.candidate.id;
  var candidateName = application.candidate.first_name + " " + application.candidate.last_name;
  var candidateEmail = application.candidate.email_addresses[0].value;
  var candidateEmailLink = '<mailto:' + candidateEmail + '|' + candidateEmail + '>';

  // Job and application info
  var jobName = application.jobs[0].name;
  var applicationId = application.id;
  var applicationSource = application.source.public_name;
  var designJobs = [
    'Head of Design', // job_id: 123548
    'Product Designer', // job_id: 122173
    'User Experience Researcher', // job_id: 123549
    'Communication Designer' // job_id: 123547
  ];

  // For Slack content string formation
  var botTitle = '';
  var message = '';
  var summary = '';
  var applicationGreenhouseLink = '<https://app.greenhouse.io/people/' + candidateId + '?application_id=' + applicationId  + '#candidate_details' + '|View in Greenhouse>';
  var isDesignJob = false;

  // Format the content for Slack
  botTitle = 'New Applicant';
  message = '*' + candidateName + '*' + ' applied to ' + '*' + jobName + '*';
  summary = candidateName + '\n' +
            jobName + '\n' +
            'via ' + applicationSource + '\n' +
            candidateEmailLink + '\n' +
            applicationGreenhouseLink;

  // Send the formated message to Slackbot incoming webhook
  slack.send({
    icon_emoji: ':eyes:',
    username: botTitle,
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

  // Check if job is one of the designJobs before sending to Slack
  isDesignJob = designJobs.indexOf(jobName) > -1;
  if (isDesignJob) {
    slack.send({
      channel: '#design-candidates',
      color: '#7CD197',
      icon_emoji: ':eyes:',
      username: botTitle,
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
