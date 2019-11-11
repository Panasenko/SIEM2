// Initializes the `events` service on path `/events`
const { EventsDB } = require('./events.class');
const createModel = require('../../../models/events.model');
const hooks = require('./events.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/eventsDB', new EventsDB(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('eventsDB');

  service.hooks(hooks);
};
