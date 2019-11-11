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
    create: [
      async context => {
       try {
         const ZabbixCliDB =  context.app.service('zabbix-cli-DB')
         let result = await ZabbixCliDB.get(context.result.zabbixCliIDSchema)
         result.items.push(context.result._id)
         await ZabbixCliDB.patch(result._id, {items: result.items })
       }catch (e) {
         throw new Error(`items.hooks create ${e}`)
       }
      }
    ],
    update: [],
    patch: [],
    remove: []
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
