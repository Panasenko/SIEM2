const { ZabbixHistory } = require('./zabbix_history.class');
const createModel = require('../../models/zabbix_history.model');
const hooks = require('./zabbix_history.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  app.use('/zabbix-history', new ZabbixHistory(options, app));

  const service = app.service('zabbix-history');

  service.hooks(hooks);
};