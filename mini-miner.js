const { fetch, BASE_URL } = require('./utils');
const { createHash } = require('crypto');

const query = `access_token=${process.env.ACCESS_TOKEN}`;

const getUrl = `${BASE_URL}/mini_miner/problem?${query}`;
const postUrl = `${BASE_URL}/mini_miner/solve?${query}&playground=true`;

const HEX_BITS = 4;

(async () => {
  const { difficulty, block } = await fetch(getUrl);

  console.log('block', block);

  let nonce = null;

  for (let i = 0; i < 10000; i++) {
    const { data } = block;

    const newBlock = JSON.stringify({ data, nonce: i });
    // console.log('block', block);
    const hash = createHash('sha256').update(newBlock).digest('hex');

    const initialZeros = '0'.repeat(Math.ceil(difficulty / HEX_BITS));

    if (hash.startsWith(initialZeros)) {
      nonce = i;
      console.log('hash', hash);
      console.log('nonce', nonce);
      break;
    }
  }

  if (nonce === null) {
    return;
  }

  fetch(postUrl, { method: 'POST', body: JSON.stringify({ nonce }) }).then(
    console.log
  );
})();
