const { TriggersDB } = require('./triggers.class')
const createModel = require('../../../models/triggers.model')
const hooks = require('./triggers.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    multi: true
  }

  app.use('/triggersDB', new TriggersDB(options, app))

  const service = app.service('triggersDB')

  service.hooks(hooks)
}
