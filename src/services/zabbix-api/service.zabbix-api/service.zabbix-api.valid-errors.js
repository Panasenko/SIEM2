const _ = require('lodash')
const logger = require('./../../../logger')

class ServiceZabbixApiValidErrors {
  static valid(value, thisClass, thisMeth, validMeth = ["isNull", "isUndefined"]) {

    this.massage = `class ${thisClass}, method ${thisMeth}: `

    //Передан ли обьект значений для проверки
    if (_.isObject(value)) {

      this.isEmpty(value)

      //Итерируем переданный объект параметров
      return _.each(value, (val) => {
        return this.iterationValidMethod(val, validMeth)
      })
    } else {
      return this.iterationValidMethod(value, validMeth)
    }

    throw new Error(`Class ${this.constructor.name} parameter \"value\" not determined - ${value}`)
  }

  static iterationValidMethod(value, validMeth) {
    //Проверка, передан ли массив методов для проверки
    if (_.isArray(validMeth)) {
      //Итерируем методы для проверки
      return _.each(validMeth, (valM) => this.switchCase(value, valM))
    }

    if (_.isString(validMeth)) {
      return this.switchCase(value, validMeth)
    }

    let message = `Class ${this.constructor.name} method \"validMeth\" not determined - ${validMeth}`
    logger.log({
      level: 'error',
      label: 'class valid query',
      message: message
    })


    throw new Error(message)
  }

  static switchCase(value, validMeth) {
    switch (validMeth) {
      case "isNull":
        this.isNull(value)
        break
      case "isUndefined":
        this.isUndefined(value)
        break
      default:
        return "method for validate dont match"
    }
  }

  static isNull(value) {
    if (_.isNull(value)) {
      let message = `${this.massage} Parameter is not defined. Passed value - null`
      logger.log({
        level: 'error',
        label: 'class valid query',
        message: message
      })

      throw new Error(message)
    }
    return value
  }


  static isUndefined(value) {
    let message = `${this.massage} Parameter is not defined. Passed value - undefined`

    if (value === undefined) {
      logger.log({
        level: 'error',
        label: 'class valid query',
        message: message
      })

      throw new Error(message)
    }
    return value
  }

  static isEmpty(value) {
    let message = `${this.massage} Parameter is not defined. Passed value - undefined`

    if (_.isEmpty(value)) {
      logger.log({
        level: 'error',
        label: 'class valid query',
        message: message
      })

      throw new Error(message)
    }
    return value
  }

}

module.exports = ServiceZabbixApiValidErrors
