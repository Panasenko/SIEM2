const _ = require('lodash')
const InitTriggers = require('./initTriggers')

class TriggerRouter {
    constructor(zabbixCliID) {
        this.zabbixCliID = zabbixCliID
        this.triggers = InitTriggers.initTriggers(this.zabbixCliID)
    }

    async monitoring(data) {
        let triggerArr = await this.triggers

        if (_.isArray(data)) {
            _.forEach(data, async function (value) {

                console.log(value.itemid)
                let filterTriggers = _.filter(triggerArr, {itemid: value.itemid})

                if(filterTriggers.length){
                    return _.forEach(filterTriggers, function (trigger) {
                        return trigger.check(value)
                    })
                }



            })
        }
    }



}

module.exports = TriggerRouter