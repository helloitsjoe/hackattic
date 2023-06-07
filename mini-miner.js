const { createHash } = require('crypto');

const HEX_BITS = 4;

module.exports = ({ difficulty, block }) => {
  console.log('block', block);

  let nonce = null;

  for (let i = 0; i < 1_000_000; i++) {
    const { data } = block;

    const newBlock = JSON.stringify({ data, nonce: i });
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

  return JSON.stringify({ nonce });
};
