const logger = require('./../../../../logger')

module.exports = function ZabbixCliMutation() {
  const app = this
  const ZabbixCliDB = app.service('zabbix-cli-DB')

  return {
    createZabbixCli: async (parent, args) => {
      try {
        return await ZabbixCliDB.create(args.input)
      } catch (e) {
        logger.log({
          level: 'error',
          label: 'mutation.ZabbixCli',
          message: `method createZabbixCli - ${e}`
        })
        throw new Error(e)
      }
    },

    updateZabbixCli: async (parent, args) => {
      try {
        return await ZabbixCliDB.patch(args._id, args.input)
      } catch (e) {
        logger.log({
          level: 'error',
          label: 'mutation.ZabbixCli',
          message: ` updateZabbixCli: async(parent, args) - ${e}`
        })
        throw new Error(e)
      }
    },

    deleteZabbixCli: async (parent, args) => {
      try {
        return await ZabbixCliDB.remove(args._id)
      } catch (e) {
        logger.log({
          level: 'error',
          label: 'mutation.ZabbixCli',
          message: ` createZabbixCli: async(parent, args) - ${e}`
        })
        throw new Error(e)
      }

    }
  }

}
