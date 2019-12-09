const logger = require('../../../logger')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [
    /*  async context => {
        const ItemsDB = context.app.service('itemsDB')
        const TriggersDB = context.app.service('triggersDB')

        let resultId = context.result._id

        try {
          let ItemsDBResult = await ItemsDB.find({query: {zabbixCliIDSchema: resultId}})
          if (ItemsDBResult.length) {
            await ItemsDB.remove(null, {query: {zabbixCliIDSchema: resultId}})
          }
        } catch (e) {
          throw new Error(e)
        }

        try {
          let resultTriggersDB = await TriggersDB.find({query: {zabbixCliIDSchema: resultId}})
          if (resultTriggersDB.length) {
            await TriggersDB.remove(null, {query: {zabbixCliIDSchema: resultId}})
          }
        } catch (e) {
          throw new Error(e)
        }

      }*/
    ]
  },

  error: {
    all: [
      context => {
        logger.log({
          level: 'error',
          label: 'ZabbixCli - hooks',
          message: context.error
        })
      }
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}


