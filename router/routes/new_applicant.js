'use strict';

var express = require('express');
var router = express.Router();

// Variables for Slack incoming webhook url
var GREENHOUSE_EVENT_SLACK_WEBHOOK_URL = process.env.GREENHOUSE_EVENT_SLACK_WEBHOOK_URL;
var GREENHOUSE_JOB_IDS = process.env.GREENHOUSE_JOB_IDS;
var SLACK_CHANNEL_NAME = process.env.SLACK_CHANNEL_NAME;

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
  var jobIDs = GREENHOUSE_JOB_IDS.split(",").map(id => parseInt(id))
  
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

  // Check if job is one of the jobIDs before sending to Slack
  isDesignJob = jobIDs.indexOf(jobId) > -1;
  if (isDesignJob) {
    slack.send({
      channel: SLACK_CHANNEL_NAME,
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
