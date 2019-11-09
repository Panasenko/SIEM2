const axios = require('axios')
const RB = require('./service.zabbix-api.requestBuilder')
const Errors = require("./service.zabbix-api.valid-errors")
const logger = require('./../../../logger')

class ServiceZabbixApiCallAPI extends Errors {
  constructor(url) {
    super()
    this._url = url
  }

  get url() {
    Errors.valid(this._url, this.constructor.name, "get url")
    return this._url
  }

  async call(method, token, params) {

    try {
      return await axios({
        baseURL: this.url,
        method: 'post',
        headers: {
          Accept: 'application/json',
        },
        data: RB.build(method, token, params),
        timeout: 40000,
        retries: 0
      })
    } catch (error) {


      let message = `Class ${this.constructor.name}, method \"call\" - ${error}`

      logger.log({
        level: 'error',
        label: 'class valid query',
        message: message
      })

      throw new Error(message)
    }
  }
}

module.exports = ServiceZabbixApiCallAPI
