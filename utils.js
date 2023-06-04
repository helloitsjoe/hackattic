const nodeFetch = require('node-fetch');

const BASE_URL = 'https://hackattic.com/challenges';

const fetch = (url, options) => {
  return nodeFetch(url, options).then((res) => {
    if (!res.ok) {
      throw new Error(res.status);
    }
    return res.json();
  });
};

module.exports = { fetch, BASE_URL };
