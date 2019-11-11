const ZabbixCliQuery = require('./query/query.zabbix-cli')
const ZabbixAPIQuery = require('./query/query.zabbix-api')
const BuildHostsBQ = require('./build/build.query.HostsBQ')
const ZabbixCliMutation = require('./mutation/mutation.ZabbixCli')
const TriggerMutation = require('./mutation/mutation.Triggers')
const ItemsMutation = require('./mutation/mutation.Items')

module.exports = function resolvers() {
  const app = this

  return {
    Query: Object.assign(ZabbixAPIQuery.call(app), ZabbixCliQuery.call(app)),
    Mutation: Object.assign(ZabbixCliMutation.call(app),ItemsMutation.call(app), TriggerMutation.call(app)),
    Hosts: Object.assign(BuildHostsBQ.call(app)),
  }
}
