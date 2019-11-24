const _ = require('lodash')

module.exports = class Worker {
  constructor(params, options) {
    this.zabbixCli = params
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
        await this.initZabbixCli(this.zabbixCli._id).then(
          result => {
            if (result.inProgress) {
              this.conveyor()
            }
          }
        )
      }, this.zabbixCli.intervalTime || 30000)
    }
  }

  async initZabbixCli(id) {
    return await this.driver.zabbixCliDB.get(this.zabbixCli._id)
      .then(result => {
        return this.zabbixCli = result
      })
      .catch(err => this.stopWorker(err))
  }


  initTask() {
    return {
      zabbixCli_ID: this.zabbixCli._id,
      reqHistory: {
        method: "history.get",
        args: {
          url: this.zabbixCli.url,
          token: this.zabbixCli.token,
          reqParam: {}
        }
      }
    }
  }

  conveyor() {
    new Promise(resolve => {
      resolve(this.initTask())
    })
      .then(async task => {
        task.itemObj = await this.getItems(task)
        return task
      })
      .then(async task => {
        task.itemsArr = await this.itemsToArr(task)
        return task
      })
      .then(async task => {
        task.result = await this.iterator(task)
        return task
      })
      .then(result => this.handler(result))
      .catch(err => this.errorHandler(err))
  }

  getItems(task) {
    return new Promise((resolve) => {
      let result = this.driver.itemsDB.find({query: {zabbixCli_ID: task.zabbixCli_ID}})
      resolve(result)
    })
  }

  itemsToArr(task) {
    return _.reduce(task.itemObj, function (accumulator, value) {
      accumulator[+value.value_type].push(value.itemid)
      return accumulator
    }, [[], [], [], [], []])
  }

  async iterator(task) {
    let promisArray = []
    for (let [key, value] of task.itemsArr.entries()) {
      if (value.length > 0) {
        task.reqHistory.args.reqParam = {
          itemids: value,
          time_from: this.lastTime || Date.now() / 1000 | 0,
          history: key
        }

        promisArray.push(await this.callApi(task.reqHistory))
      }
    }
    return Promise.all(promisArray)
  }

  async callApi(params) {
    return await this.driver.zabbixAPI.find(params)
  }

  handler(task) {
    this.lastTime = Date.now() / 1000 | 0
    console.log(task.result)
    return task
  }

  stopWorker() {
    console.log("stop")
    clearInterval(this.timerID)
    this.running = false
  }

  errorHandler(err) {
    this.sumError++
    if (this.sumError >= 5) {
      this.stopWorker()
    }

  }

}
