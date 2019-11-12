const _ = require('lodash')

module.exports = function TriggerMutation() {
  const app = this
  const ItemsDB = app.service('itemsDB')
  const TriggersDB = app.service('triggersDB')

  return {
    createTriggers: async (parent, args) => {
      try {
        let result = await ItemsDB.get(args.input.ItemIDSchema)
        args.input.zabbixCliIDSchema = result.zabbixCliIDSchema
        args.input.itemid = result.itemid
        return  await TriggersDB.create(args.input)
      } catch (e) {
        console.log(e)
        throw new Error(e)
      }
    },

    updateTriggers: async (parent, args) => {
      try {
        return await TriggersDB.patch(args.input)
      } catch (e) {
        throw new Error(e)
      }
    },

    deleteTriggers: async (parent, args) => {
      try {
        return await TriggersDB.remove(args._id)
      } catch (e) {
        throw new Error(e)
      }
    }
  }
}
