const _ = require('lodash')


module.exports = function ItemsMutation() {
  const app = this
  const ZabbixCliDB = app.service('zabbix-cli-DB')
  const ItemsDB = app.service('itemsDB')
  const TriggersDB = app.service('itemsDB')

  return {
    createItems: async (parent, args) => {
      return ItemsDB.create(args.input)
/*

    },

    updateItems: async (parent, args) => {
      return ItemsDB.patch(args._id, args.input)
      /*
            return  await ZabbixCliDB.get(args._id)
            args.input.zabbixCliIDSchema = args._id
            let newItems =
            await ZabbixCliDB.patch(args._id, {items: await result.items.push(newItems._id)})
            return newItems*/
    },

    deleteItems: async (parent, args) => {
      return  ItemsDB.remove(args._id)
/*      await TriggersDB.remove(null, {ItemIDSchema: delItems.ItemIDSchema})
      let result = await ZabbixCliDB.get(delItems.zabbixCliIDSchema)
      await ZabbixCliDB.patch(delItems.zabbixCliIDSchema, {items: await _.remove(result.items, item => item === args._id)})
      return delItems*/
    }

  }
}

