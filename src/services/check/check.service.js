const { Check } = require('./check.class')
const hooks = require('./check.hooks')
const event = require('./check.event')

module.exports = function (app) {
  const service = {
    app: app,
    triggersDB: app.service('triggersDB'),
    redis: app.service('redis')
  }

  app.use('/check', new Check(service, app))

  app.configure(event)

  const check = app.service('check')

  check.hooks(hooks)
};
