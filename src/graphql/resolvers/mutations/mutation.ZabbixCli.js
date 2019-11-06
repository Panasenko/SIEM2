const ZabbixCliDB = require('../../../database/controllers/controll.ZabbixCli')
const ItemsDB = require('../../../database/controllers/controll.Items')
const TriggersDB = require('../../../database/controllers/controll.Triggers')
const HistoryGetController = require('./../../../modules/workers/worker.init')

class ZabbixCliMutation {

    async createZabbixCli(parent, args) {
            let data = await ZabbixCliDB.create(args.input)
            await HistoryGetController.createWorkers(data)
            return await data
    }

    async updateZabbixCli(parent, args) {
        try {
            let updateZabbixCli = await ZabbixCliDB.findByIdAndUpdate(args._id, args.input)
            await HistoryGetController.updateWorkers(args._id)
            return await updateZabbixCli
        } catch (e) {
            return e
        }
    }

    async deleteZabbixCli(parent, args) {
        try {
            let elementDelete = await ZabbixCliDB.findByIdAndRemove(args._id)
            await ItemsDB.deleteMany({zabbixCliIDSchema: args._id})
            await TriggersDB.deleteMany({zabbixCliIDSchema: args._id})
            await HistoryGetController.deleteWorkers(args._id)
            return await elementDelete
        } catch (e) {
            return e
        }
    }
}

module.exports = ZabbixCliMutation