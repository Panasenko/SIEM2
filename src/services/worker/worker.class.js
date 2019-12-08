const _ = require('lodash')
const Worker = require('./worker.run')

exports.WorkerService = class WorkerService {
  constructor(service) {
    this.service = service
    this.workers = []
    this.init()
  }

  init() {
    new Promise(async (resolve, reject) => {
      const arrData = await this.service.zabbixCliDB.find()
      if (arrData.length) {
        resolve(arrData)
      }
      reject(new Error("not task to zabbixCliDB"))
    })
      .then(
        result => _.forEach(result, async item => this.workers.push(new Worker(item, this.service)))
      )
      .catch(err => {
        console.log(err)
      })
  }

  create(data) {
    if (!_.find(this.workers, item => item.zabbix_params._id === data._id)) {
      return this.workers.push(new Worker(data, this.service))
    }
    throw new Error("worker exists")
  }

  find() {
    return this.workers
  }

  get(id) {
    return _.filter(this.workers, items => items._id === id)
  }

  update(id, data) {
    _.forEach(this.workers, item => {
      if (String(item.zabbix_params._id) === id) {
        //TODO: добавдить реализацию обновления

        console.log(item)
      }
    })
  }

  remove(id) {
    if (!_.find(this.workers, item => item.zabbix_params._id === data._id)) {
      this.workers = _.filter(this.workers, items => String(items._id) !== id)
      return true
    }
    return false
  }


}
