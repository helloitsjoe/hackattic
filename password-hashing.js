const {
  createHash,
  createHmac,
  pbkdf2Sync,
  scryptSync,
} = require('node:crypto');

module.exports = (input) => {
  console.log('input', input);

  // _control is example scrypt calculated for password="rosebud", salt="pepper", N=128, p=8, n=4
  const {
    password,
    salt: base64Salt,
    pbkdf2: { rounds, hash },
    scrypt: { N, r, p, buflen, _control },
  } = input;

  const salt = Buffer.from(base64Salt, 'base64');

  const sha256 = createHash('sha256').update(password).digest('hex');
  const hmac = createHmac('sha256', salt).update(password).digest('hex');
  const pbkdf2 = pbkdf2Sync(password, salt, rounds, 32, hash).toString('hex');

  const scrypt = scryptSync(password, salt, buflen, {
    N,
    p,
    r,
    maxmem: 256 * N * r,
  }).toString('hex');

  console.log('scrypt', scrypt);

  return { sha256, hmac, pbkdf2, scrypt };
};
