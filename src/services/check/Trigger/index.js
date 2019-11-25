const _ = require('lodash')
const Instruction = require('./instruction')
const Methods = require('./methods')
const Time = require('./time')

module.exports = class Trigger {
  constructor(params, zabbixCli_Id) {
    this.zabbixCli_Id = zabbixCli_Id
    this.params = this.init(params)
  }

  init(params) {
    return {
      event: {
        name: params.name,
        itemid: params.itemid,
        closeTime: params.closeTime || 5,
        eventTimeStart: null
      },
      level: {
        disaster: Instruction.init(params.disaster),
        high: Instruction.init(params.high),
        average: Instruction.init(params.average),
        warning: Instruction.init(params.warning),
        information: Instruction.init(params.information)
      }
    }
  }

  check(data) {
    return new Promise(resolve => {

    })
  }

  redis_id() {
    return `trigger:event:${this.zabbixCli_Id}:${this.params.event.itemid}`
  }


  levelAlert(data) {
    let params = this.initParams()

    switch (true) {
      case this.params.level.disaster(data, ...params):
        data.resTrigger = "disaster"
        console.log("disaster")
        break
      case this.params.level.high(data, ...params):
        data.resTrigger = "high"
        console.log("high")
        break
      case this.params.level.average(data, ...params):
        data.resTrigger = "average"
        console.log("average")
        break
      case this.params.level.warning(data, ...params):
        data.resTrigger = "warning"
        console.log("warning")
        break
      case this.params.level.information(data, ...params):
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
    let eventTimeStart = (_.isNull(this.eventTimeStart)) ? Time.unixTime() : this.eventTimeStart
    let nowTime = Time.unixTime()

    return [
      intervalTime,
      eventTimeStart,
      nowTime
    ]
  }
}
