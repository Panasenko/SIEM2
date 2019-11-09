const assert = require('assert');
const app = require('../../src/app');

describe('\'triggers\' service', () => {
  it('registered the service', () => {
    const service = app.service('triggers');

    assert.ok(service, 'Registered the service');
  });
});
