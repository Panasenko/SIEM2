const Time = require('./time')

module.exports = function(trigger_params, alert_level){

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

