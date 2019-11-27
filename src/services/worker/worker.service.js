const { WorkerService } = require('./worker.class');
const hooks = require('./worker.hooks');

module.exports = function (app) {

  const service = {
    zabbixCliDB: app.service('zabbix-cli-DB'),
    itemsDB: app.service('itemsDB'),
    triggersDB: app.service('triggersDB'),
    redisClient: app.service('redis'),
    zabbixAPI: app.service('zabbix-api'),
    check: app.service('check')
  }

  app.use('/worker', new WorkerService(service, app))

  const worker = app.service('worker')

  worker.hooks(hooks)
};
