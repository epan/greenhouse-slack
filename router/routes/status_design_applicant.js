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

  // Store JSON payload from Greenhouse
  var json = req.body;
  var application = json.payload.application;
  var candidate = application.candidate;
  var jobs = application.jobs;

  // Candidate info
  var candidateId = candidate.id;
  var candidateName = candidate.first_name + " " + candidate.last_name;

  // Application and interview info
  var jobName = jobs[0].name;
  var jobId = jobs[0].id;
  var applicationId = application.id;
  var applicationStatus = application.status;
  var interviewStage = application.current_stage.name;
  var interviewStatus = application.current_stage.interviews[0].status;

  // Jobs to filter for
  var jobIDs = GREENHOUSE_JOB_IDS.split(",").map(id => parseInt(id))
  var isDesignJob = false;

  // String mutation for formatting message to Slack
  var icon = '';
  var message = '';
  var color = '';
  var applicationGreenhouseLink = '<https://app.greenhouse.io/people/' + candidateId + '?application_id=' + applicationId + '|View in Greenhouse>';

  switch (applicationStatus) {
    case 'active':
      icon = ':arrow_right:';
      color = '#439FE0';
      message = candidateName + ' (' + jobName + ') was just updated to ' + interviewStage + ' (' + interviewStatus + ').\n' + applicationGreenhouseLink;
      break;
    case 'rejected':
      icon = ':no_good:';
      color = 'danger';
      message = candidateName + ' (' + jobName + ') was just rejected.\n' + applicationGreenhouseLink;
      break;
    case 'hired':
      icon = ':raised_hands:';
      color = 'good';
      message = candidateName + ' (' + jobName + ') was just hired!\n' + applicationGreenhouseLink;
      break;
    default:
      message = "I'm not sure what happened to this candidate\n" + applicationGreenhouseLink;
  }

  console.log(message);

  // Check if job is a design job then send update to Slack
  isDesignJob = jobIDs.indexOf(jobId) > -1;

  console.log(isDesignJob);

  if (isDesignJob) {
    slack.send({
      channel: SLACK_CHANNEL_NAME,
      color: '#7CD197',
      icon_emoji: icon,
      username: 'Applicant Status Change',
      text: message,
    });
  }
});

module.exports = router;
