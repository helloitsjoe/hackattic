const it = require('node:test');
const assert = require('node:assert');
const hashPass = require('../password-hashing');

it('hashes', (t) => {
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

  assert.equal(result, 'foo');
});
