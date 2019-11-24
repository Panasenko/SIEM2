const _ = require('lodash')
const Worker = require('./worker.run')

exports.WorkerService = class WorkerService {
  constructor(options) {
    this.options = options
    this.dbZabbixCli = options.zabbixCliDB
    this.workers = []

    this.init()
  }

  init(options) {
    new Promise((resolve, reject) => {
      resolve(this.dbZabbixCli.find())
    })
      .then(
        result => _.forEach(result, async item => this.workers.push(new Worker(item, this.options))),
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
