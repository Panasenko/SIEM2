const _ = require('lodash')
const Trigger = require('./trigger')
const TriggersDB = require('../../database/controllers/controll.Triggers')

class TriggerInit {
    static async initTriggers(zabbixCliID){
        return _.reduce(await this.getTriggers(zabbixCliID), function (accumulator, value) {
            accumulator.push(new Trigger(value))
            return accumulator
        }, [])
    }

    static async getTriggers(zabbixCliID){
        return await TriggersDB.find({zabbixCliIDSchema: zabbixCliID})
    }
}

module.exports = TriggerInit