'use strict';

var express = require('express');
var router = express.Router();

// Variables for Slack incoming webhook url
var GREENHOUSE_EVENT_SLACK_WEBHOOK_URL = process.env.GREENHOUSE_EVENT_SLACK_WEBHOOK_URL;
var slack = require('slack-notify')(GREENHOUSE_EVENT_SLACK_WEBHOOK_URL);

router.post('/', function (req, res) {
  // Makes the Greenhouse webhook test ping gods pleased
  res.sendStatus(200);

  var json = req.body;

  // Store JSON payload from Greenhouse
  var application = json.payload.application;
  var candidate = application.candidate;
  var jobs = application.jobs;

  // Candidate info
  var candidateId = candidate.id;
  var candidateName = candidate.first_name + " " + candidate.last_name;
  var candidateEmail = candidate.email_addresses[0].value;
  var candidateEmailLink = '<mailto:' + candidateEmail + '|' + candidateEmail + '>';

  // Job and application info
  var jobName = jobs[0].name;
  var jobId = jobs[0].id;
  var applicationId = application.id;
  var applicationSource = application.source.public_name;
  var designJobs = [
    123548, // job_name: 'Head of Design'
    122173, // job_name: 'Product Designer'
    123549, // job_name: 'User Experience Researcher'
    123547 // job_name: 'Communication Designer'
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
  isDesignJob = designJobs.indexOf(jobId) > -1;
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

module.exports = router;
