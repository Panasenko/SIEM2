// Initializes the `zabbixCli` service on path `/service.zabbix-api-cli`
const { ZabbixCli } = require('./zabbix-cli.class')
const createModel = require('../../../models/zabbix-cli.model')
const hooks = require('./zabbix-cli.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    whitelist: [ '$populate' ]
  }

  // Initialize our service with any options it requires
  app.use('/service.zabbix-api-cli', new ZabbixCli(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('zabbix-cli')

  service.hooks(hooks)
}
