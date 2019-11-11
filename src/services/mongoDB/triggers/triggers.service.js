// Initializes the `triggers` service on path `/triggers`
const { TriggersDB } = require('./triggers.class');
const createModel = require('../../../models/triggers.model');
const hooks = require('./triggers.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/triggersDB', new TriggersDB(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('triggersDB');

  service.hooks(hooks);
};
