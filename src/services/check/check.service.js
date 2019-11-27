const { Check } = require('./check.class');
const hooks = require('./check.hooks');

module.exports = function (app) {
  const service = {
    triggersDB: app.service('triggersDB'),
    redis: app.service('redis')
  }

  app.use('/check', new Check(service, app))

  const check = app.service('check')

  check.hooks(hooks)
};
