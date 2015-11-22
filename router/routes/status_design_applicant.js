'use strict';

var express = require('express');
var router = express.Router();

// Variables for Slack incoming webhook url
var GREENHOUSE_EVENT_SLACK_WEBHOOK_URL = process.env.GREENHOUSE_EVENT_SLACK_WEBHOOK_URL;
var slack = require('slack-notify')(GREENHOUSE_EVENT_SLACK_WEBHOOK_URL);

router.post('/', function (req, res) {
  // Makes the Greenhouse webhook test ping gods pleased
  res.sendStatus(200);

  // TODO parse the applicant change JSON and format slack-notify
};

module.exports = router;
