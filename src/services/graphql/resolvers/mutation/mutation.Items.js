const _ = require('lodash')


module.exports = function ItemsMutation() {
  const app = this
  const ItemsDB = app.service('itemsDB')

  return {
    createItems: async (parent, args) => {
      return ItemsDB.create(args.input)
    },

    updateItems: async (parent, args) => {
      return ItemsDB.patch(args._id, args.input)
    },

    deleteItems: async (parent, args) => {
      return  ItemsDB.remove(args._id)
    }

  }
}

