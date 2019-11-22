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
   // this.worker()
  }

  worker() {
    if (this.timerID === null) {
      this.timerID = setInterval((promisArr) => {
        Promise.all([this.initItem()]).then(() => {
          console.log("worker")
        })
      }, this.zabbixCli.intervalTime || 1000)
    }
  }

  initItem() {
    const zabbixCli_ID = this.zabbixCli._id
    return new Promise((resolve) => {
      let result = this.driver.itemsDB.find({query: {zabbixCli_ID: zabbixCli_ID}})
      resolve(result)
    })

      .then(items => {
        this.items = _.reduce(items, function (accumulator, value) {
          accumulator[+value.value_type].push(value.itemid)
          return accumulator
        }, [[], [], [], [], []])
        console.log(this.items)
        return this.items
      })
  }

  /*  initItem() {
      console.log(2)
      const zabbixCli_ID = this.zabbixCli._id
       new Promise((resolve, reject) => {
       let result = this.driver.items.find()
        resolve(result)
      })

        .then(item => { console.log(item) })*/

  /*    .then(items => {
        console.log(items)

        return this.items = _.reduce(items, function (accumulator, value) {
          accumulator[+value.value_type].push(value.itemid)
          return accumulator
        }, [[], [], [], [], []])
      })*/


  /*  iterator() {
      for (let [key, value] of this.items.entries()) {
        if (value.length > 0) {
          let reqParams = {}
          reqParams.itemids = value
          reqParams.time_from = this.lastTime || Date.now() / 1000 | 0
          reqParams.history = key
          console.log(reqParams)
        }
      }
    }*/


  /*init(){
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
*/


}
