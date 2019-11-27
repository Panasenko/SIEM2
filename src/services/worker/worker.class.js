const _ = require('lodash')
const Worker = require('./worker.run')

exports.WorkerService = class WorkerService {
  constructor(service) {
    this.service = service
    this.workers = []
    this.init()
  }

  init() {
    new Promise((resolve, reject) => {
      resolve(this.service.zabbixCliDB.find())
    })
      .then(
        result => _.forEach(result, async item => this.workers.push(new Worker(item, this.service))),
        err => new Error(err)
      )
  }

  async find(params) {
    return this.workers
  }

  async get(id, params) {
    return _.filter(this.workers, items => items._id === id)
  }

}
