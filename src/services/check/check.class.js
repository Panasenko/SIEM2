const _ = require('lodash')
const Trigger = require('./Trigger')

exports.Check = class Check {
  constructor(service) {
    this.service = service
  }

  async find(task) {
    console.log(`${task.zabbixCli_ID}  ${task.enrichment_items.length}`)

    if (!task.zabbixCli_ID && !task.enrichment_items.length) {
      return new Error("bad reques to trigger")
    }
    return await this.conveyor(task).then(result => {
      return result
    })
  }

  async conveyor(task) {
    return await new Promise(async (resolve, reject) => {
      task.triggers = await this.service.triggersDB.find({query: {zabbixCli_ID: task.zabbixCli_ID}})
      if (task.triggers.length) {
        resolve(task)
      } else {
        reject(new Error("empty respons triggers"))
      }
    })
      .then(task => {
        task.triggers = this.initTriggers(task)
        return task
      })

      .then(async task => {


        task.validation = await this.validation({
          enrichment_items: task.enrichment_items,
          triggers: task.triggers
        })

        console.log(task)
        return task
      })

      .catch(err => {
        console.log(err)
      })
  }

  initTriggers(task) {
    let service = this.service
    return _.reduce(task.triggers, (accumulator, value) => {
      accumulator.push(new Trigger(value, service))
      return accumulator
    }, [])
  }


  async validation({enrichment_items, triggers}) {
    return _.forEach(enrichment_items, async item => {

      let array_trigger = _.filter(triggers, {itemid: item.itemid})

      if (array_trigger.length) {
         _.forEach(array_trigger, async trigger => {
          item.resTrigger = await trigger.check(item)

        })
      } else {
        item.resTrigger = "not trigger"
      }
    })
  }

}
