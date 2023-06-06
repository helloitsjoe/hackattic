const nodeFetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const QrCode = require('qrcode-reader');
const Jimp = require('jimp');
const { fetch, BASE_URL } = require('./utils');

const query = `access_token=${process.env.ACCESS_TOKEN}`;

const getUrl = `${BASE_URL}/reading_qr/problem?${query}`;
const postUrl = `${BASE_URL}/reading_qr/solve?${query}`;

(async () => {
  const { image_url } = await fetch(getUrl);

  console.log('image_url', image_url);

  const image = await nodeFetch(image_url).then((res) => res.blob());

  const arrayBuf = await image.arrayBuffer();
  const buf = Buffer.from(arrayBuf);

  // Read image file with jimp
  // const buffer = fs.readFileSync(path.join(__dirname, 'temp', 'qr.png'));
  Jimp.read(buf, (err, image) => {
    if (err) {
      console.error(err);
      return;
    }
    // scan qr code
    const qr = new QrCode();
    qr.callback = (err, value) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log('value.result', value.result);
      console.log('value', value);

      fetch(postUrl, {
        method: 'POST',
        body: JSON.stringify({ code: value.result }),
      }).then(console.log);
    };
    qr.decode(image.bitmap);
  });
})();
