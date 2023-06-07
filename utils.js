const nodeFetch = require('node-fetch');

const BASE_URL = 'https://hackattic.com/challenges';

const query = `access_token=${process.env.ACCESS_TOKEN}`;
console.log('query', query);

const fetch = (url, options) => {
  return nodeFetch(url, options).then((res) => {
    if (!res.ok) {
      throw new Error(res.status);
    }
    return res.json();
  });
};

const get = (challenge) => {
  return fetch(`${BASE_URL}/${challenge}/problem?${query}`);
};

const post = (challenge, body, playground = false) => {
  playgroundQuery = playground ? '&playground=true' : '';

  return fetch(`${BASE_URL}/${challenge}/solve?${query}${playgroundQuery}`, {
    method: 'POST',
    body,
  });
};

module.exports = { get, post, BASE_URL };
