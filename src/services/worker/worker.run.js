const _ = require('lodash')
const history_worker = require('./history.worker')

module.exports = class Worker {
  constructor(params, service) {
    this.zabbix_params = params
    this.service = service
    this.lastTime = Date.now() / 1000 | 0
    this.timerID = null
    this.running = false
    this.isError = false
    this.sumError = 0
    this.history_worker = new history_worker(service)

    this.worker()
  }

  worker() {
    if (_.isNull(this.timerID)) {
      this.timerID = setInterval(async () => await this.handler(), this.zabbix_params.intervalTime || 30000)
    }
  }

  handler(){
    return Promise.all([
      this.history_worker.history(this.zabbix_params)
    ]).then(result => {
      console.log(result)
    },
      err => {
      console.log(err)
      })
  }



  stopWorker(err) {
    console.log("stop")
    clearInterval(this.timerID)
    this.running = false
  }

  errorHandler(err) { //TODO: Добавить логирование
    this.sumError++
    this.isError = true
    if (this.sumError >= 5) {
      this.stopWorker()
    }
  }
}
