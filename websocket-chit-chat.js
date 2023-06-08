const WebSocket = require('ws');

function computeInterval(diff) {
  const intervals = [700, 1500, 2000, 2500, 3000];
  for (const interval of intervals) {
    if (diff - interval < 200 && diff - interval > 0) {
      return interval;
    }
    if (interval - diff < 200 && interval - diff > 0) {
      return interval;
    }
  }
}

module.exports = ({ token }) => {
  return new Promise((resolve, reject) => {
    let secret = null;

    const ws = new WebSocket(`wss://hackattic.com/_/ws/${token}`);

    let start = null;

    ws.on('message', (bytes) => {
      const data = bytes.toString();
      console.log('data', data);
      if (data.startsWith('ping')) {
        const diff = Date.now() - start;
        console.log('diff', diff);
        const interval = computeInterval(diff);
        console.log('interval', interval);
        ws.send(interval);
        start = Date.now();
      } else if (data.startsWith('congratulations')) {
        const secret = data.slice(data.indexOf('"') + 1, data.lastIndexOf('"'));
        resolve({ secret });
      }
    });

    ws.on('open', () => {
      start = Date.now();
    });

    ws.on('error', (error) => {
      console.log('error', error);
    });
  });
};
