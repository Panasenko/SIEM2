const Worker = require('./worker')
const ChangItems = require('./changItems')
const ZabbixAPI = require('../../services/zabbix-api/service.zabbix-api/service.zabbix-api.zabbixAPI')
const ZabbixCliDB = require('../../database/controllers/controll.ZabbixCli')
const TriggerRouter = require('../triggers/trigger.router')

class WorkerHistory extends Worker {
  constructor(args) {
    super(args)
    this._items = args.items || []
    this.updateProperties()
    this.triggerRouter = new TriggerRouter(this._id)
  }

  get items() {
    return this._items
  }

  set items(value) {
    this._items = value
  }

  async updateProperties() {
    let data = await ZabbixCliDB.findById(this._id)
    this.logger.info("Получение данных из БД")

    this.name = data.name
    this.description = data.description
    this.url = data.url
    this.token = data.token
    this.intervalTime = data.intervalTime
    this.inProgress = data.inProgress
    this.items = data.items

    if (this.inProgress && !this.status) {
      return this.workerHistory()
    }
  }

  async callHistoryAPI() {

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
            this.triggerRouter.monitoring(dataHistory)
          }
        } catch (e) {
          console.log(e)
          this.isError = true
        }
      }
    }
  }

  workerHistory() {
    console.log("start")

    this.timerID = setInterval(async () => { //TODO: Попробовать рекурсивный setTimeout

      if (this.inProgress && this.items.length > 0) {
        this.status = true
        await this.callHistoryAPI()
        this.lastTime = Date.now() / 1000 | 0
      } else {
        console.log("stop")
        clearInterval(this.timerID)
        this.status = false
      }
    }, this.intervalTime)

  }


}

module.exports = WorkerHistory
