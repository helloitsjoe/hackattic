const it = require('node:test');
const assert = require('node:assert/strict');

it('testing node test runner', () => {
  assert.equal(1, 1);
  assert.deepEqual({ foo: 'bar' }, { foo: 'bar' });
});
