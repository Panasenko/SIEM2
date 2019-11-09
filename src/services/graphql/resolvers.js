module.exports = function resolvers() {
  const app = this
  const ZabbixCli = app.service('zabbix-cli')
  return {
    Query: {
      async zabbixCliFindById(parent, args) {
        return await ZabbixCli.get(args._id)
      }
    }
  }
}
