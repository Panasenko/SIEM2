const assert = require('assert');
const app = require('../../src/app');

describe('\'zabbix_history\' service', () => {
  it('registered the service', () => {
    const service = app.service('zabbix-history');

    assert.ok(service, 'Registered the service');
  });
});
