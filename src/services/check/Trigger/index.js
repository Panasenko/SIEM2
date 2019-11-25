const _ = require('lodash')
const Instruction = require('./instruction')
const Methods = require('./methods')
const Time = require('./time')

module.exports = class Trigger {
  constructor(params) {
    this._id = params._id
    this.name = params.name
    this.itemid = params.itemid
    this.closeTime = params.closeTime || 5
    this.eventTimeStart = null

    this.disaster = Instruction.init(params.disaster)
    this.high = Instruction.init(params.high)
    this.average = Instruction.init(params.average)
    this.warning = Instruction.init(params.warning)
    this.information = Instruction.init(params.information)
  }

  check(data){
    return new Promise(resolve => {

    })
  }




  levelAlert(data) {
    let params = this.initParams()

    switch (true) {
      case this.disaster(data, ...params): data.resTrigger = "disaster"
        console.log("disaster")
        break
      case this.high(data, ...params): data.resTrigger = "high"
        console.log("high")
        break
      case this.average(data, ...params): data.resTrigger = "average"
        console.log("average")
        break
      case this.warning(data, ...params): data.resTrigger = "warning"
        console.log("warning")
        break
      case this.information(data, ...params):
        console.log("information")
        return data.resTrigger = "information"
        /*
        break*/
      default: data.resTrigger = "none"
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
