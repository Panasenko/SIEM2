const assert = require('assert');
const app = require('../../src/app');

describe('\'zabbixAPI\' service', () => {
  it('registered the service', () => {
    const service = app.service('zabbix-api');

    assert.ok(service, 'Registered the service');
  });
});
