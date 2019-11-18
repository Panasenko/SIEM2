// Initializes the `redis` service on path `/redis`
const { Redis } = require('./redis.class');
const hooks = require('./redis.hooks');

module.exports = function (app) {
  const options = {
    redis: app.get('redis')
  }

  app.use('/redis', new Redis(options, app))

  const service = app.service('redis');

  service.hooks(hooks);
};
