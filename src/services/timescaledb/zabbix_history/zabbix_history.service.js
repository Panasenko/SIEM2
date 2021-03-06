const { ZabbixHistory } = require('./zabbix_history.class');
const createModel = require('../../../models/postgres_db/zabbix_history.model');
const hooks = require('./zabbix_history.hooks');

module.exports = function (app) {
  const options = {
    app: app,
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  app.use('/zabbix-timescaledb', new ZabbixHistory(options, app));

  const service = app.service('zabbix-timescaledb')

  service.hooks(hooks);
};
