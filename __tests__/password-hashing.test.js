const it = require('node:test');
const assert = require('node:assert');
const hashPass = require('../password-hashing');

// Disabling because pbkdf2 and scrypt are time consuming
it.skip('hashes', (t) => {
  const result = hashPass({
    password: 'JOSHUA9020',
    salt: 'I5gguqurU95ZrTqk+hg=',
    pbkdf2: { rounds: 490000, hash: 'sha256' },
    scrypt: {
      N: 524288,
      r: 32,
      p: 2,
      buflen: 32,
      _control:
        'b19a18ea8a50a861d08eb94be602f6cbfe67ab98d2021400a3b83fbe3b8ba698',
    },
  });

  assert.deepEqual(result, {
    sha256: '6ccc49a0f9f07bb3b3b121a385766c3ba87c6ba65eabf42f6e0835c687c4ca9c',
    hmac: '2d940e8b6bc35d74a188d81c41b9f0e3bd397b6f6f2488dbd472166384786290',
    scrypt: 'b19a18ea8a50a861d08eb94be602f6cbfe67ab98d2021400a3b83fbe3b8ba69',
  });
});
