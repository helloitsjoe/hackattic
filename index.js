const [, , challenge, playground] = process.argv;
console.log('challenge', challenge);

const { get, post } = require('./utils');
const fn = require(`./${challenge.replaceAll('_', '-')}`);

(async () => {
  const res = await get(challenge);
  const body = await fn(res);
  if (!body) {
    console.log('No result!');
    return;
  }
  await post(challenge, JSON.stringify(body), !!playground).then(console.log);
})();
