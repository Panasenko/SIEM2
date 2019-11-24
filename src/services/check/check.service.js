const { Check } = require('./check.class');
const hooks = require('./check.hooks');

module.exports = function (app) {
  const options = {
    triggersDB: app.service('triggersDB')
  };

  app.use('/check', new Check(options, app))

  const service = app.service('check')

  service.hooks(hooks)
};
