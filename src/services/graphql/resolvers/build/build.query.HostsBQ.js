const _ = require('lodash')

module.exports = function () {
  const app = this
  const ZabbixAPI = app.service('zabbix-api')

  async function callService(method, args) {
    try {
      return await ZabbixAPI.find({method, args: args.input})
    } catch (e) {
      logger.log({
        level: 'error',
        label: 'build.query.HostsBQ',
        message: `method callService(method, args) ${e}`
      })
    }
  }

  return {
    async graphics(parent, args) {
      let data = await callService("graph.get", args)
      return _.filter(data, a => a.hosts[0].hostid === parent.hostid)
    },

    async applications(parent, args) {
      let data = await callService("application.get", args)
      return _.filter(data, a => a.hostid === parent.hostid)
    },

    async items(parent, args) {
      let data = await callService("item.get", args)
      return _.filter(data, a => a.hostid === parent.hostid)
    }
  }
}
