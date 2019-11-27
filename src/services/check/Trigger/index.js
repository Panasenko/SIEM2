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
  }

  async check(task) {
    if (_.isObject(task)) {
      return await this.conveyor(task)
    }
    throw new Error("no object passed")
  }


  async conveyor(task) {
    return new Promise(async resolve => {
      let result = await this.driver.redis.hgetall(this.redis_id)

      if (_.isNull(result)) {
        console.log(1)
        task.trigger_params = await this.redis_add(this.redis_param())
        resolve(task)
      }else {
        task.trigger_params = result
        console.log(2)
        resolve(task)
      }

    })

      .then(task => {
        console.log(task)
      })

  }

  redis_param() {
    return {
      level: "null",
      close_time: this.trigger.closeTime || 6,
      time_create_trigger: Date.now() / 1000 | 0,
      time_update_trigger: "null",
      time_event_start: "null",
      time_event_update: "null",
      time_event_close: "null",
      time_normalization: "null",
    }
  }


  async redis_add(redis_param) {
    let result = await this.driver.redis.hmset(this.redis_id, redis_param)
    console.log("redis_add " + result)

    if (!result) {
      throw new Error("err create params to redis")
    }
    return redis_param
  }

  generete_rid({ zabbixCli_ID, itemid, _id}) {
    return `trigger:event:${zabbixCli_ID}:${itemid}:${_id}`
  }


  levelAlert(data) {
    let params = this.initParams()

    switch (true) {
      case this.level.disaster(data, ...params):
        data.resTrigger = "disaster"
        console.log("disaster")
        break
      case this.level.high(data, ...params):
        data.resTrigger = "high"
        console.log("high")
        break
      case this.level.average(data, ...params):
        data.resTrigger = "average"
        console.log("average")
        break
      case this.level.warning(data, ...params):
        data.resTrigger = "warning"
        console.log("warning")
        break
      case this.level.information(data, ...params):
        console.log("information")
        return data.resTrigger = "information"
      /*
      break*/
      default:
        data.resTrigger = "none"
    }
  }

  initParams() {
    let intervalTime = Methods.intervalTime
    let eventTimeStart = (_.isNull(this.trigger.time_event_start)) ? Time.unixTime() : this.trigger.time_event_start
    let nowTime = Time.unixTime()

    return [
      intervalTime,
      eventTimeStart,
      nowTime
    ]
  }
}
