module.exports = function ZabbixCLIQuery() {
  const app = this
  const ZabbixCli = app.service('zabbix-cli')
  return {
    async zabbixCliFindById(parent, args) {
      try {
        return await ZabbixCli.get(args._id)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
