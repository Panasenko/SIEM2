module.exports = class InitWorker {
  constructor(params, app){
    this.id = params._id
    this.name = params.name
    this.description = params.description
    this.url = params.url
    this.token = params.token
    this.intervalTime = params.intervalTime || 10000
    this.lastTime = params.lastTime || Date.now() / 1000 | 0
    this.isError = false
    this.timerID = null
    this.status = false

    this.zabbixAPI = app.service('zabbix-api')
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
