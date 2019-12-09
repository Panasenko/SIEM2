const _ = require('lodash')
const Instruction = require('./instruction')
const Methods = require('./methods')
const Time = require('./time')

module.exports = class Trigger {
  constructor(params, service) {
    this.service = service
    this.trigger = params
    this.itemid = params.itemid
    this.redis_id = this.generete_rid(params)

    this.level = {
      disaster: Instruction.init(params.disaster),
      high: Instruction.init(params.high),
      average: Instruction.init(params.average),
      warning: Instruction.init(params.warning),
      information: Instruction.init(params.information)
    }
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
        task.alert_level = this.alert_level(task, this.init_methods(task))
        return task
      })

      .then(task => {
        task.trigger_params = this.update_level(task.trigger_params, task.alert_level)
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

  /*revise(task) {
    return _.reduce(task.history, (trigger_params, value) => {
      let alert_level = this.alert_level(value, this.init_methods(task))
        return this.update_level(trigger_params, alert_level)
    }, task.trigger_params)
  }*/



  update_level(trigger_params, alert_level){
    switch (true) {
      case (trigger_params.code_level === 0 && alert_level.code_level > 0):
        trigger_params = Object.assign(trigger_params, alert_level, {
          status: "active",
          time_event_start: Time.unixTime(),
          time_update_trigger: Time.unixTime(),
          time_normalization: (+trigger_params.time_close_alert * 60) + Time.unixTime()
        })
        break

      case (0 < trigger_params.code_level && alert_level.code_level > 0 && alert_level.code_level !== trigger_params.code_level):
        trigger_params = Object.assign(trigger_params, alert_level, {
          status: "active",
          time_event_update: Time.unixTime(),
          time_update_trigger: Time.unixTime(),
          time_normalization: (+trigger_params.time_close_alert * 60) + Time.unixTime()
        })
        break

      case (trigger_params.status === "active" && alert_level.code_level === 0 &&  Number(trigger_params.time_normalization) >= Time.unixTime()):
        trigger_params = Object.assign(trigger_params, alert_level, {
          status: "normalization",
          time_update_trigger: Time.unixTime(),
          time_event_update: Time.unixTime()
        })
        break

      case (trigger_params.status === "active" && alert_level.code_level === 0 &&  Number(trigger_params.time_normalization) <= Time.unixTime()):
        trigger_params = Object.assign(trigger_params, alert_level,{
          status: "inactive",
          time_event_start: 0,
          time_update_trigger: Time.unixTime(),
          time_event_close: Time.unixTime()
        })
        break

      default:
        trigger_params = Object.assign(trigger_params, alert_level, {
        time_update_trigger: Time.unixTime()
      })
    }

    return trigger_params
  }

  init_methods({trigger_params}) {
    let intervalTime = Methods.intervalTime
    let eventTimeStart = (!Boolean(trigger_params.time_event_start)) ? Time.unixTime() : trigger_params.time_event_start
    let nowTime = Time.unixTime()

    return [
      intervalTime,
      eventTimeStart,
      nowTime
    ]
  }

  alert_level(object, params) {
    switch (true) {
      case this.level.disaster(object, ...params):
        object.level = "disaster"
        object.code_level = 5
        break

      case this.level.high(object, ...params):
        object.level = "high"
        object.code_level = 4
        break

      case this.level.average(object, ...params):
        object.level = "average"
        object.code_level = 3
        break

      case this.level.warning(object, ...params):
        object.level = "warning"
        object.code_level = 2
        break

      case this.level.information(object, ...params):
        object.level = "information"
        object.code_level = 1
        break

      default:
        object.level = "none"
        object.code_level = 0
    }

    return object
  }

}
