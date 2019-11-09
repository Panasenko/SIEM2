const zabbixCli = require('./mongoDB/zabbix-cli/zabbix-cli.service.js')
const graphql = require('./graphql/graphql.service.js')
const zabbixApi = require('./zabbix-api/zabbix-api.service.js')
const worker = require('./worker/worker.service.js')
const trigger = require('./trigger/trigger.service.js')

const triggers = require('./mongoDB/triggers/triggers.service.js');

const items = require('./mongoDB/items/items.service.js');

const events = require('./mongoDB/events/events.service.js');

module.exports = function (app) {
  app.configure(zabbixCli)
  app.configure(graphql)
  app.configure(zabbixApi)
  app.configure(worker)
  app.configure(trigger)
  app.configure(triggers);
  app.configure(items);
  app.configure(events);
}
