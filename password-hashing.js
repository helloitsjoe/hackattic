const {
  createHash,
  createHmac,
  pbkdf2Sync,
  scryptSync,
} = require('node:crypto');

module.exports = (input) => {
  console.log('input', input);

  // example scrypt calculated for password="rosebud", salt="pepper", N=128, p=8, n=4
  const {
    password,
    salt,
    pbkdf2: { rounds, hash },
    scrypt: { N, r, p, buflen, _control },
  } = input;

  //
  const sha256 = createHash('sha256').update(password).digest('hex');
  const hmac = createHmac('sha256', salt).update(password).digest('hex');
  const pbkdf2 = pbkdf2Sync(password, salt, rounds, 1 /* keylen */, hash);
  const scrypt = scryptSync(password, salt, buflen);

  return { sha256, hmac, pbkdf2, scrypt };
};
