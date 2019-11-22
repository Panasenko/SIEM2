// Initializes the `zabbixCli` service on path `/service.zabbix-api-cli`
const { ZabbixCliDB } = require('./zabbix-cli.class')
const createModel = require('../../../models/zabbix-cli.model')
const hooks = require('./zabbix-cli.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    multi: true
  }

  // Initialize our service with any options it requires
  app.use('/zabbix-cli-DB', new ZabbixCliDB(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('zabbix-cli-DB')

  service.hooks(hooks)
}
