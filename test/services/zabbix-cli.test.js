const assert = require('assert');
const app = require('../../src/app');

describe('\'zabbixCli\' service', () => {
  it('registered the service', () => {
    const service = app.service('zabbix-cli');

    assert.ok(service, 'Registered the service');
  });
});
