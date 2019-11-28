const _ = require('lodash')
const Instruction = require('./instruction')
const Methods = require('./methods')
const Time = require('./time')

module.exports = class Trigger {
  constructor(params, driver) {
    this.driver = driver
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

    this.redis_param = {
      level: "none",
      status: "inactive",
      close_time: this.trigger.closeTime || 6,
      time_create_trigger: Time.unixTime(),
      time_update_trigger: 0,
      time_event_start: 0,
      time_event_update: 0,
      time_event_close: 0,
      time_normalization: 0,
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
      let result = await this.driver.redis.hgetall(this.redis_id)

      if (_.isNull(result)) {
        task.trigger_params = await this.redis_add(this.redis_param)
        resolve(task)
      } else {
        task.trigger_params = result
        resolve(task)
      }
    })

      .then(task => {
        task.trigger_params = this.revise(task)
        return task
      })

      .then(task => {
        console.log(task)
      })

  }

  generete_rid({zabbixCli_ID, itemid, _id}) {
    return `trigger:event:${zabbixCli_ID}:${itemid}:${_id}`
  }

  async redis_add(redis_param) {
    let result = await this.driver.redis.hmset(this.redis_id, redis_param)
    if (!result) {
      return new Error("err create params to redis")
    }
    return redis_param
  }

  revise(task) {
    return _.reduce(task.history, (trigger_params, value, key) => {
      let result = this.alert_level(value, this.init_methods(task))
        return this.updatr_level(trigger_params, result)
    }, task.trigger_params)
  }

  updatr_level(trigger_params, result){
    switch (_.isObject(result) && _.isObject(trigger_params)) {
      case (trigger_params.level === "none" && result.level !== "none"):
        console.log("start")
        trigger_params = this.update_trigger_params(trigger_params, {
          level: result.level,
          status: "active",
          time_event_start: Time.unixTime()
        })
        break
      case (trigger_params.level !== result.level && result.level !== "none"):
        console.log("etap 2")
        trigger_params = this.update_trigger_params(trigger_params, {
          level: result.level,
          status: "active",
          time_event_update: Time.unixTime()
        })
      case (result.level === "none"):
        console.log("etap 3")
        if(!Boolean(trigger_params.time_normalization)){
          trigger_params.time_normalization = Time.unixTime()
        }

        let alert = {}
        if(trigger_params.time_normalization + (trigger_params.closeTime * 60) >= Time.unixTime()){
          alert = {
            level: result.level,
            status: "active",
            time_event_update: Time.unixTime()
          }
        } else {
          alert = {
            level: result.level,
            status: "inactive",
            time_event_close: Time.unixTime()
          }
        }
        trigger_params = this.update_trigger_params(trigger_params, alert)
        break




      //this.eventTimeNormalized + (this.closeTime * 60) <= Time.unixTime()


    }

    return trigger_params
  }

  update_trigger_params(trigger, alert) {
    return Object.assign(trigger, alert, {
      time_update_trigger: Time.unixTime()
    })
  }


  init_methods({trigger_params}) {
    let intervalTime = Methods.intervalTime
    let eventTimeStart = (Boolean(trigger_params.time_event_start)) ? Time.unixTime() : trigger_params.time_event_start
    let nowTime = Time.unixTime()
    return [
      intervalTime,
      eventTimeStart,
      nowTime
    ]
  }

  alert_level(task, params) {
    switch (_.isObject(task) && _.isArray(params)) {
      case this.level.disaster(task, ...params):
        task.level = "disaster"
        console.log("disaster")
        break
      case this.level.high(task, ...params):
        task.level = "high"
        console.log("high")
        break
      case this.level.average(task, ...params):
        task.level = "average"
        console.log("average")
        break
      case this.level.warning(task, ...params):
        task.level = "warning"
        console.log("warning")
        break
      case this.level.information(task, ...params):
        task.level = "information"
        console.log("information")
        break
      default:
        task.level = "none"
    }

    return task
  }

}
