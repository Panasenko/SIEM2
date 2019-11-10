const ZabbixApi   = require('./zabbix-api.class');

module.exports = function (app) {
  app.use('/zabbix-api', new ZabbixApi());
}
