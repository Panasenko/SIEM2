const Methods = require('./methods')
const Time = require('./time')

module.exports = function(data) {

  let intervalTime = Methods.intervalTime
  let eventTimeStart = (!Boolean(data.time_event_start)) ? Time.unixTime() : data.time_event_start
  let nowTime = Time.unixTime()

  return [
    intervalTime,
    eventTimeStart,
    nowTime
  ]
}
