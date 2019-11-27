const _ = require('lodash')

module.exports = class Worker {
  constructor(params, service) {
    this.zabbix_params = params
    this.service = service
    this.lastTime = Date.now() / 1000 | 0
    this.timerID = null
    this.running = false
    this.isError = false
    this.sumError = 0
    this.worker()
  }

  worker() {
    if (this.timerID === null) {
      this.timerID = setInterval(async () => {
        await this.initZabbixCli(this.zabbix_params._id).then(
          result => {
            if (result.inProgress) {
              this.conveyor()
            }
          }
        )
      }, this.zabbix_params.intervalTime || 30000)
    }
  }

  async initZabbixCli(id) {
    return await this.service.zabbixCliDB.get(this.zabbix_params._id)
      .then(result => {
        return this.zabbix_params = result
      })
      .catch(err => {
        console.log(err)
        this.stopWorker(err)
      })
  }


  initTask() {
    return {
      zabbixCli_ID: this.zabbix_params._id,
      req_history: {
        method: "history.get",
        args: {
          url: this.zabbix_params.url,
          token: this.zabbix_params.token,
          reqParam: {}
        }
      }
    }
  }

  conveyor() {
    new Promise(resolve => {
      this.running = true
      resolve(this.initTask())
    })
      .then(async task => {
        task.items = await this.getItems(task)
        return task
      })
      .then(async task => {
        task.items_array = await this.itemsToArr(task)
        return task
      })
      .then(async task => {
        task.res_history = _.flatten(await this.iterator(task))
        this.lastTime = Date.now() / 1000 | 0
        return task
      })
      .then(task => {
        return this.enrichment(task)
      })
      .then(task => {
        return this.handler(task)
      })
      .catch(err => this.errorHandler(err))
  }

  getItems(task) {
    return new Promise((resolve) => {
      let result = this.service.itemsDB.find({query: {zabbixCli_ID: task.zabbixCli_ID}})
      resolve(result)
    })
  }

  itemsToArr(task) {
    return _.reduce(task.items, function (accumulator, value) {
      accumulator[+value.value_type].push(value.itemid)
      return accumulator
    }, [[], [], [], [], []])
  }

  async iterator(task) {
    let promis_array = []
    for (let [key, value] of task.items_array.entries()) {
      if (value.length > 0) {
        task.req_history.args.reqParam = {
          itemids: value,
          time_from: this.lastTime || Date.now() / 1000 | 0,
          history: key
        }

        promis_array.push(await this.callApi(task.req_history))
      }
    }
    return Promise.all(promis_array)
  }

  async callApi(params) {
    return await this.service.zabbixAPI.find(params)
  }

  enrichment(task) {
    task.enrichment_items = []
    _.forEach(task.items, item => {
      let item_history = _.filter(task.res_history, {
        itemid: item.itemid
      })

      if (item_history.length) {
        item.history = item_history
        return task.enrichment_items.push(item)
      }
    })
    return task
  }

  async handler(task) {
    if (task.zabbixCli_ID && task.enrichment_items.length){
      task.validate = await this.service.check.find({
        zabbixCli_ID: task.zabbixCli_ID,
        enrichment_items: task.enrichment_items
      })
    }
    return task
  }

  stopWorker(err) {
    console.log("sasa " + err )

    console.log("stop")
    clearInterval(this.timerID)
    this.running = false
  }

  errorHandler(err) {
    this.sumError++
    this.isError = true
    if (this.sumError >= 5) {
      this.stopWorker()
    }

  }

}
