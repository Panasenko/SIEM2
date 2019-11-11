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
      async context => {
        let resultId = context.result._id
        if (await context.app.service('itemsDB').find({query: {zabbixCliIDSchema: resultId}}).length) {
          console.log("itemsDB find")
          await context.app.service('itemsDB').remove(null, {zabbixCliIDSchema: resultId})
        }

        if (await context.app.service('triggersDB').find({query: {zabbixCliIDSchema: resultId}}).length) {
          console.log("TriggersDB find")
          await context.app.service('triggersDB').remove(null, {zabbixCliIDSchema: resultId})
        }
      },
    ]
  },

  error: {
    all: [
      context => {
      console.log(context)

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


