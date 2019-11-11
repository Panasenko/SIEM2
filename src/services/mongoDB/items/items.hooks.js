const logger = require('../../../logger')
const _ = require('lodash')

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
    create: [
      async context => {
        try {
          const ZabbixCliDB = context.app.service('zabbix-cli-DB')
          let result = await ZabbixCliDB.get(context.result.zabbixCliIDSchema)
          result.items.push(context.result._id)
          await ZabbixCliDB.patch(result._id, {items: result.items})
        } catch (e) {
          throw new Error(`items.hooks create ${e}`)
        }
      }
    ],
    update: [],
    patch: [],
    remove: [
      async context => {
        let itemsIdSchem = context.result._id
        console.log(itemsIdSchem)

        const ZabbixCliDB = context.app.service('zabbix-cli-DB')
        const TriggersDB = context.app.service('triggersDB')

        try {
          let result = await ZabbixCliDB.get(context.result.zabbixCliIDSchema)
          await ZabbixCliDB.patch(result._id, {items: _.filter(result.items, item => item !== itemsIdSchem)})
        } catch (e) {
          throw new Error(`items.hooks remove ZabbixCliDB ${e}`)
        }

        try {
          let resultTriggersDB =  await TriggersDB.find({query: {ItemIDSchema: itemsIdSchem}})
          if (resultTriggersDB.length){
            await TriggersDB.remove(null, {query:{ItemIDSchema: itemsIdSchem}})
          }
        } catch (e) {
          throw new Error(`items.hooks remove TriggersDB ${e}`)
        }

      }


    ]
  },

  error: {
    all: [
      context => {
        logger.log({
          level: 'error',
          label: 'Items - hooks',
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
};
