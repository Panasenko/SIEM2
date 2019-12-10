const _ = require('lodash')
const Instruction = require('./instruction')
const Time = require('./time')
const alert_level = require('./alert_level')
const init_methods = require('./init_methods')
const update_level = require('./update_level')

module.exports = class Trigger {
  constructor(params, service) {
    this.service = service
    this.trigger = params
    this.itemid = params.itemid
    this.redis_id = this.generete_rid(params)

    this.alert_level = alert_level({
      disaster: Instruction.init(params.disaster),
      high: Instruction.init(params.high),
      average: Instruction.init(params.average),
      warning: Instruction.init(params.warning),
      information: Instruction.init(params.information)
    })
  }

  async check(task) {
    if (_.isObject(task)) {
      return await this.conveyor(task)
    }
    return new Error("no object passed")
  }

  async conveyor(task) {
    return new Promise(async resolve => {
      let trigger_params = await this.service.redis.rget(this.redis_id)

      if (_.isNull(trigger_params)) {
        task.trigger_params = {
          level: "none",
          code_level: 0,
          status: "inactive",
          time_close_alert: this.trigger.closeTime || 6,
          time_create_trigger: Time.unixTime(),
          time_update_trigger: 0,
          time_event_start: 0,
          time_event_update: 0,
          time_event_close: 0,
          time_normalization: 0
        }
        resolve(task)
      } else {
        task.trigger_params = trigger_params
        resolve(task)
      }
    })

      .then(task => {
        task.alert_level = this.alert_level(task, init_methods(task.trigger_params))
        return task
      })

      .then(task => {
        task.trigger_params = update_level(task.trigger_params, task.alert_level)
        return task
      })

      .then(async task => {
        task.radis_res = await this.redis_set(task.trigger_params)
        return task
      })

      .catch(err => {
        console.log(err)
      })
  }

  generete_rid({zabbixCli_ID, itemid, _id}) {
    return `${zabbixCli_ID}:trigger:${itemid}:${_id}`
  }

  async redis_set(redis_param) {
    let result = await this.service.redis.rset(this.redis_id, redis_param)
    if (!result) {
      return new Error("err create params to redis")
    }
    return redis_param
  }

}
