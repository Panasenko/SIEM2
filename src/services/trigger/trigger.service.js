// Initializes the `trigger` service on path `/trigger`
const { Trigger } = require('./trigger.class');
const hooks = require('./trigger.hooks');

module.exports = function (app) {

  // Initialize our service with any options it requires
  app.use('/trigger', new Trigger(app));

  // Get our initialized service so that we can register hooks
  const service = app.service('trigger');

  service.hooks(hooks);
};
