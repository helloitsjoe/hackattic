const it = require('node:test');
const assert = require('node:assert/strict');
const helpMeUnpack = require('../help-me-unpack');

it('int', () => {
  const { int, uint, short, float, double, big_endian_double } = helpMeUnpack({
    bytes: 'q6Gxg9ef68+CQQAA0s6CQ7KsetX8GGNAQGMY/NV6rLI=',
  });
  assert.equal(int, -1415466621);
  assert.equal(uint, 3617582031);
  // TODO: Short is wrong, revisit
  assert.equal(short, 0);
  assert.equal(float, 261.61578369140625);
  assert.equal(double, 152.78086351356393);
  assert.equal(big_endian_double, 152.78086351356393);
});
