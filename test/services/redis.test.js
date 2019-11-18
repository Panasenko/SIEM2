const assert = require('assert');
const app = require('../../src/app');

describe('\'redis\' service', () => {
  it('registered the service', () => {
    const service = app.service('redis');

    assert.ok(service, 'Registered the service');
  });
});
