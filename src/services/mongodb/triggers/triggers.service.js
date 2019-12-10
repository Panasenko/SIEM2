const { TriggersDB } = require('./triggers.class')
const createModel = require('../../../models/mongo_db/triggers.model')
const hooks = require('./triggers.hooks')

module.exports = function (app) {
  const options = {
    app: app,
    Model: createModel(app),
    multi: true
  }

  app.use('/triggersDB', new TriggersDB(options, app))

  const service = app.service('triggersDB')

  service.hooks(hooks)
}
