const _ = require('lodash')
const InitWorker = require('./init.worker')

exports.Worker = class Worker {
  constructor(app) {
    this.workers = []
    this.ZabbixCliDB = app.service('zabbix-cli-DB')
    this.init(app)
  }


  init(app) {
    const ZabbixCli = this.ZabbixCliDB.find()

    if (ZabbixCli.length) {
      _.forEach(ZabbixCli, async item => {
        return this.workers.push(new InitWorker(item, app))
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

  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return {id};
  }
};
