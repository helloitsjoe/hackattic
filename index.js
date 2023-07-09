const [, , challenge, playground] = process.argv;
console.log('challenge', challenge);

const { get, post } = require('./utils');
const fn = require(`./${challenge.replaceAll('_', '-')}`);

(async () => {
  try {
    const res = await get(challenge);
    const body = await fn(res);
    if (!body) {
      console.log('No result!');
      return;
    }
    await post(challenge, JSON.stringify(body), !!playground).then(console.log);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
