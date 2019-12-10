module.exports = function (level) {
  return function (task, params) {

    let object = {}

    switch (true) {

      case level.disaster(task, ...params):
        object.level = "disaster"
        object.code_level = 5
        break

      case level.high(task, ...params):
        object.level = "high"
        object.code_level = 4
        break

      case level.average(task, ...params):
        object.level = "average"
        object.code_level = 3
        break

      case level.warning(task, ...params):
        object.level = "warning"
        object.code_level = 2
        break

      case level.information(task, ...params):
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

