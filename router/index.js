'use strict';

module.exports = function(app) {
  app.use('/new-design-applicant', require('./routes/new_design_applicant'));
  app.use('/status-design-applicant', require('./routes/status_design_applicant'));
};
