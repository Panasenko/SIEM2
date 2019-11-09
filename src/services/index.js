const zabbixCli = require('./zabbix-cli/zabbix-cli.service.js')

const graphql = require('./graphql/graphql.service.js');

module.exports = function (app) {
  app.configure(zabbixCli)
  app.configure(graphql);
}
