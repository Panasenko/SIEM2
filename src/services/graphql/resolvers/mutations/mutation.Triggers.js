const _ = require('lodash')
const ItemsDB = require('../../../database/controllers/controll.Items')
const TriggersDB = require('../../../database/controllers/controll.Triggers')

const HistoryGetController = require('./../../../modules/workers/worker.init')

class TriggersMutation {

    async createTriggersToItems(parent, args) {
        try {
            let result = await ItemsDB.findById(args._id)
            args.input.ItemIDSchema = args._id
            args.input.zabbixCliIDSchema = result.zabbixCliIDSchema
            args.input.itemid = result.itemid
            let newTriggers = await TriggersDB.create(args.input)
            await result.triggers.push(newTriggers._id)
            await result.save()
            return newTriggers
        } catch (e) {
            return e
        }
    }

    async deleteTriggersToItems(parent, args) {
        try {
            let delTriggers = await TriggersDB.findByIdAndRemove(args._id)

            let result = await ItemsDB.findById(delTriggers.ItemIDSchema)
            result.triggers = await _.remove(result.triggers, triggers => {
                return triggers === args._id
            })
            await result.save()
            await HistoryGetController.updateWorkers(delTriggers.zabbixCliIDSchema)
            return delTriggers
        } catch (e) {
            return e
        }
    }

}

module.exports = TriggersMutation