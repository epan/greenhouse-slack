'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Middleware
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json()); // for parsing application/json

// Routes
var newDesignApplicant = require('./routes/new_design_applicant');
app.use('/new-design-applicant', newDesignApplicant);

// Endpoints
app.get('/', function (req, res) {
  res.send('Hullo Werld!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
