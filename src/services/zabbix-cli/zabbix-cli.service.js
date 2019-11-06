// Initializes the `zabbixCli` service on path `/zabbix-cli`
const { ZabbixCli } = require('./zabbix-cli.class')
const createModel = require('../../models/zabbix-cli.model')
const hooks = require('./zabbix-cli.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/zabbix-cli', new ZabbixCli(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('zabbix-cli')

  service.hooks(hooks)
}
