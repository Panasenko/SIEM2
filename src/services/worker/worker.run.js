const ChangItems = require('./changItems.worker')

module.exports = class Worker {
  constructor(params, app){
    this.id = params._id
    this.name = params.name
    this.description = params.description
    this.url = params.url
    this.token = params.token
    this.intervalTime = params.intervalTime || 10000
    this.lastTime = params.lastTime || Date.now() / 1000 | 0
    this.timerID = null
    this.items = []

    this.running = true
    this.updated = false
    this.isError = false

    this.Service_itemsDB = app.service('itemsDB')
    this.Service_triggersDB = app.service('triggersDB')
    this.Service_ZabbixAPI = app.service('zabbix-api')
  }

  init(){
    let promise = new Promise((resolve, reject) => {
      this.Service_itemsDB.find({query: {zabbixCliIDSchema: this.id}})
    })



    promise
      .then(
        result => {
          // первая функция-обработчик - запустится при вызове resolve
          console.log("Fulfilled: " + result); // result - аргумент resolve
        },
        error => {
          // вторая функция - запустится при вызове reject
          console.log("Rejected: " + error); // error - аргумент reject
        }
      )
  }

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

  handler(){
    let promise = new Promise((resolve, reject) => {

    })



    promise
      .then(
        result => {
          // первая функция-обработчик - запустится при вызове resolve
          console.log("Fulfilled: " + result); // result - аргумент resolve
        },
        error => {
          // вторая функция - запустится при вызове reject
          console.log("Rejected: " + error); // error - аргумент reject
        }
      )
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



}
