const zabbixCli = require('./mongoDB/zabbix-cli/zabbix-cli.service.js')
const graphql = require('./graphql/graphql.service.js')
const zabbixApi = require('./zabbix-api/zabbix-api.service.js')
const worker = require('./worker/worker.service.js')
const triggers = require('./mongoDB/triggers/triggers.service.js');
const items = require('./mongoDB/items/items.service.js');
const events = require('./mongoDB/events/events.service.js');
const redis = require('./redis/redis.service.js');

module.exports = function (app) {
  app.configure(zabbixApi)
  app.configure(triggers)
  app.configure(items)
  app.configure(events)
  app.configure(zabbixCli)
  app.configure(redis)
  app.configure(graphql)
  app.configure(worker)
}
