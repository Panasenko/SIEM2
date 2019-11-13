const _ = require('lodash')
const Worker = require('./worker.run')

exports.WorkerService = class WorkerService {
  constructor(app) {
    this.workers = []
    this.ZabbixCliDB = app.service('zabbix-cli-DB')
    this.init(app)
  }


  init(app) {
    const ZabbixCli = this.ZabbixCliDB.find()

    if (ZabbixCli.length) {
      _.forEach(ZabbixCli, async item => {
        return this.workers.push(new Worker(item, app))
      })
    }

  }

  async find(params) {
    return this.workers
  }

  async get(id, params) {
    return _.filter(this.workers, items => items._id === id)
  }

  async create(data, params) {
    return this.workers.push(new Worker(data, app))
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
    return  _.filter(this.workers, subscriber => String(subscriber._id) !== id)
  }
};
