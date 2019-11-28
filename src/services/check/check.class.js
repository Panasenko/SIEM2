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
    return await this.conveyor(task)
  }

  async conveyor(task) {
    await new Promise(async (resolve, reject) => {
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
        task.res_history = await this.validation(task)
        return task
      })

      .catch(err => {
        console.log(err)
      })
  }

  initTriggers(task) {
    let service = this.service
    return _.reduce(task.triggers, function (accumulator, value) {
      accumulator.push(new Trigger(value, service))
      return accumulator
    }, [])
  }

  async validation(task) {
    return _.forEach(task.enrichment_items, async value => {
      let array_trigger = _.filter(task.triggers, {itemid: value.itemid})
      if (array_trigger.length) {
        return _.forEach(array_trigger, async trigger => {
          value.resTrigger = await trigger.check(value)
          return value
        })
      } else {
        value.resTrigger = "not trigger"
        return value
      }
    })
  }
}
