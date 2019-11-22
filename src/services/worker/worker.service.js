const { WorkerService } = require('./worker.class');
const hooks = require('./worker.hooks');

module.exports = function (app) {

  const options = {
    zabbixCliDB: app.service('zabbix-cli-DB'),
    itemsDB: app.service('itemsDB'),
    triggersDB: app.service('triggersDB'),
    redisClient: app.service('redis')
  }

  app.use('/worker', new WorkerService(options, app));

  const service = app.service('worker');

  service.hooks(hooks);
};
