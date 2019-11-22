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

  }

  async get(id, params) {
    return _.filter(this.workers, items => items._id === id)
  }

  async create(data, options) {
    return this.workers.push(new Worker(data, this.options))
  }

  async update(id, data, params) {
    return _.forEach(this.workers, (subscriber) => {
      if (String(subscriber._id) === id) {
        subscriber.updateProperties().then(r => console.error(r))
      }
    })
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return _.filter(this.workers, subscriber => String(subscriber._id) !== id)
  }
};
