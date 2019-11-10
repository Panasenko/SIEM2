const logger = require('./../../../../logger')

module.exports = function ZabbixCLIQuery() {
  const app = this
  const ZabbixCliDB = app.service('zabbix-cli-DB')

  return {
    async zabbixCliFindById(parent, args) {
      try {
        return await ZabbixCliDB.get(args._id)
      } catch (e) {
        logger.log({
          level: 'error',
          label: 'query.zabbix-cli',
          message: ` zabbixCliFindById(parent, args) - ${e}`
        })
      }
    },

    async zabbixCliFind(parent, args) {
      try {
        return await ZabbixCliDB.find(null)
      } catch (e) {
        logger.log({
          level: 'error',
          label: 'query.zabbix-cli',
          message: `zabbixCliFind(parent, args) - ${e}`
        })
      }
    }
  }
}
