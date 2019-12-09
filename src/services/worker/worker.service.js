const { WorkerService } = require('./worker.class');
const hooks = require('./worker.hooks');

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



  //TODO: Дабавить управление массивом классов при помощи ивентемиттеров

  worker.hooks(hooks)
};
