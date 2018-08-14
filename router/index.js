'use strict';

module.exports = function(app) {
  app.use('/new-applicant', require('./routes/new_applicant'));
  app.use('/status-applicant', require('./routes/status_applicant'));
};
