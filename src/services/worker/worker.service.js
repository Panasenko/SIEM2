const { WorkerService } = require('./worker.class')
const hooks = require('./worker.hooks')
const event = require('./worker.event')

module.exports = function (app) {

  const service = {
    zabbixCliDB: app.service('zabbix-cli-DB'),
    itemsDB: app.service('itemsDB'),
    triggersDB: app.service('triggersDB'),
    redis: app.service('redis'),
    zabbixAPI: app.service('zabbix-api'),
    zabbix_tdb: app.service('zabbix-timescaledb'),
    check: app.service('check')
  }

  app.use('/worker', new WorkerService(service, app))

  const worker = app.service('worker')

  app.configure(event)

  worker.hooks(hooks)
};
