const assert = require('assert');
const app = require('../../src/app');

describe('\'TimescaleDB\' service', () => {
  it('registered the service', () => {
    const service = app.service('timescale-db');

    assert.ok(service, 'Registered the service');
  });
});
