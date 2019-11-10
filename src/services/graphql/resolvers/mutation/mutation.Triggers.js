const _ = require('lodash')

module.exports = function TriggerMutation() {
  const app = this
  const ItemsDB = app.service('itemsDB')
  const TriggersDB = app.service('itemsDB')

  return {
    createTriggersToItems: async (parent, args) => {
      let result = await ItemsDB.get(args._id)
      args.input.ItemIDSchema = args._id
      args.input.zabbixCliIDSchema = result.zabbixCliIDSchema
      args.input.itemid = result.itemid
      let newTriggers = await TriggersDB.create(args.input)
      await ItemsDB.patch(args._id, {triggers: result.triggers.push(newTriggers._id)})
      return newTriggers
    },

    deleteTriggersToItems: async (parent, args) => {
      let removeTrig = await TriggersDB.remove(args._id)
      let result = await ItemsDB.get(removeTrig.ItemIDSchema)
      result.triggers = await _.remove(result.triggers, triggers => {
        return triggers === args._id
      })
      await ItemsDB.patch(removeTrig.ItemIDSchema, {triggers: result.triggers})
      return removeTrig
    }
  }
}
