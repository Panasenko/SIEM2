const assert = require('assert');
const app = require('../../src/app');

describe('\'trigger\' service', () => {
  it('registered the service', () => {
    const service = app.service('trigger');

    assert.ok(service, 'Registered the service');
  });
});
