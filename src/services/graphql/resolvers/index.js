const ZabbixCli = require('./query/query.zabbix-cli')
const ZabbixAPI = require('./query/query.zabbix-api')
const BuildHostsBQ = require('./build/build.query.HostsBQ')

module.exports = function resolvers() {
  const app = this
  return {
    Query: Object.assign(ZabbixAPI.call(app),ZabbixCli.call(app)),
    Hosts: Object.assign(BuildHostsBQ.call(app)),
  }
}
