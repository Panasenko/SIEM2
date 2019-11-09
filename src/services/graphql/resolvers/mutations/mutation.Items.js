const _ = require('lodash')
const ZabbixCliDB = require('../../../database/controllers/controll.ZabbixCli')
const ItemsDB = require('../../../database/controllers/controll.Items')
const TriggersDB = require('../../../database/controllers/controll.Triggers')


const HistoryGetController = require('./../../../modules/workers/worker.init')

class ItemsMutation {

    async createItemsToZabbixCli(parent, args) {
        try {
            let result = await ZabbixCliDB.findById(args._id)
            args.input.zabbixCliIDSchema = args._id
            let newItems = await ItemsDB.create(args.input)
            await result.items.push(newItems._id)
            await result.save()

            HistoryGetController.updateWorkers(args._id)

            return newItems
        } catch (e) {
            return e
        }
    }

    async deleteItemsToZabbixCli(parent, args) {
        try {
            let delItems = await ItemsDB.findByIdAndRemove(args._id)
            await TriggersDB.deleteMany({ItemIDSchema: delItems.ItemIDSchema})
            let result = await ZabbixCliDB.findById(delItems.zabbixCliIDSchema)
            result.items = await _.remove(result.items, item => {
                return item === args._id
            })
            await result.save()
            await HistoryGetController.updateWorkers(delItems.zabbixCliIDSchema)
            return delItems
        } catch (e) {
            return e
        }
    }

}

module.exports = ItemsMutation