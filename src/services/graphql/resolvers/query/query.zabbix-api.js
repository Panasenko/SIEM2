const logger = require('../../../../logger')
module.exports = function ZabbixAPIQuery() {

  const app = this
  const ZabbixAPI = app.service('zabbix-api')

  async function callService(method, args) {
    try {
      return await ZabbixAPI.find({method, args: args.input})
    } catch (e) {
      logger.log({
        level: 'error',
        label: 'resolver.zabbix-api',
        message: `method callService(method, args) ${e}`
      })
    }
  }

  return {
    version: (parent, args) => ({version: callService("apiinfo.version", args)}),
    token: (parent, args) => ({token: callService("user.login", args)}),
    hostgroup: (parent, args) => callService("hostgroup.get", args),
    hosts: (parent, args) => callService("host.get", args),
    applications: (parent, args) => callService("application.get", args),
    graphics: (parent, args) => callService( "graph.get", args),
    items: (parent, args) => callService("item.get", args)
  }
}
