// Initializes the `worker` service on path `/worker`
const { Worker } = require('./worker.class');
const hooks = require('./worker.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/worker', new Worker(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('worker');

  service.hooks(hooks);
};
