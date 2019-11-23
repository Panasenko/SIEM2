const _ = require('lodash')

module.exports = class Worker {
  constructor(params, options) {
    this.zabbixCli = params
    this.items = []

    this.driver = options

    this.lastTime = Date.now() / 1000 | 0
    this.timerID = null
    this.running = true
    this.updated = false
    this.isError = false
    this.sumError = 0
    this.worker()
  }


  worker() {
    if (this.timerID === null) {
      this.timerID = setInterval(async () => {
        if (this.running) {
          await this.conveyor()
        }

        if(this.sumError >= 5){
          this.stopWorker()
        }


      }, this.zabbixCli.intervalTime || 1000)
    }
  }

  stopWorker(){
    clearInterval(this.timerID)
    this.running = false
  }

  errorHandler(err) {


  }

  conveyor() {
    new Promise(resolve => {
      resolve()
    })
      .catch(err => errorHandler(err))
      .then(result => {
        return this.initItem(result)
      })
      .then(result => {
        return this.iterator(result)
      })
      .then(result => {
        return this.handler(result)
      })
      .catch(err => errorHandler())
  }

  initItem() {
    const zabbixCli_ID = this.zabbixCli._id
    return new Promise((resolve) => {
      let result = this.driver.itemsDB.find({query: {zabbixCli_ID}})
      resolve(result)
    })
      .then(items => {
        this.items = _.reduce(items, function (accumulator, value) {
          accumulator[+value.value_type].push(value.itemid)
          return accumulator
        }, [[], [], [], [], []])
        return this.items
      })
  }

  async iterator() {
    let promisArray = []

    let params = {}
    params.method = "history.get"
    params.args = {}
    params.args.url = this.zabbixCli.url
    params.args.token = this.zabbixCli.token

    for (let [key, value] of this.items.entries()) {
      if (value.length > 0) {
        let reqParams = {}
        reqParams.itemids = value
        reqParams.time_from = this.lastTime || Date.now() / 1000 | 0
        reqParams.history = key
        params.args.reqParam = reqParams

        promisArray.push(await this.callApi(params))
      }
    }
    return Promise.all(promisArray)
  }

  async callApi(params) {
    return await this.driver.zabbixAPI.find(params)
  }

  handler(resolve) {
    this.lastTime = Date.now() / 1000 | 0
    console.log(resolve)
    return resolve
  }


  /*

  async worker(){
    this.timerID = setInterval(async () => {
      if (this.running && this.items.length) {
        await this.request()
        this.lastTime = Date.now() / 1000 | 0
      } else {
        clearInterval(this.timerID)
        this.running = false
      }
    }, this.intervalTime)
  }





  async request(){
    console.log("Вызов АПИ")
    for (let [key, value] of ChangItems.parsItems(this.items).entries()) {
      if (value.length > 0) {
        let reqParams = {}
        reqParams.itemids = value
        reqParams.time_from = this.lastTime || Date.now() / 1000 | 0
        reqParams.history = key

        try {
          let dataHistory = await ZabbixAPI.getHistory(this._url, this._token, reqParams)
          this.isError = false
          console.log(dataHistory)
          if (dataHistory.length) {

          }
        } catch (e) {
          console.log(e)
          this.isError = true
        }
      }
    }
  }
*/


}
