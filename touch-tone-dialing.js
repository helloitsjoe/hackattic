const fs = require('fs');
const wav = require('node-wav');
// const FFT = require('fft.js');
// const DTMF = require('goertzeljs/lib/dtmf');
// const { Blob } = require('node:buffer');

// function renderCanvas(arr, html) {
//   const coords = [];
//   arr.forEach((y, x) =>
//     // coords.push(`{ x: ${x}, y: ${Math.sin(y * 2 * Math.PI) * 100} }`)
//     coords.push(`{ x: ${x}, y: ${y * 10} }`)
//   );
//   return html.replace('[{}]', `[${coords.join(',')}]`);
// }

// const sleep = () => new Promise((r) => setTimeout(r, 30000));

function getChunks(buf) {
  const result = wav.decode(buf);
  const input = result.channelData[0];

  let chunks = [];
  let curr_chunk = [];
  // let prev = 0;

  for (const eye in input) {
    const i = Number(eye);
    const prev = input[i - 1];
    const curr = input[i];
    const next = input[i + 1];

    if (prev && !curr && !next) {
      chunks.push(curr_chunk);
      curr_chunk = [];
    } else if (curr || (prev && next)) {
      curr_chunk.push(curr);
    }
  }

  // console.log('chunks.length', chunks.length);
  // console.log(
  //   'chunks',
  //   chunks.map((c) => [c[0], c[c.length - 1]])
  // );

  return chunks;
}

module.exports = async ({ wav_url }) => {
  const tones = fs.readFileSync('./temp/tones.wav');
  const toneChunks = getChunks(tones);

  const toneMap = toneChunks.reduce((acc, curr, i) => {
    const button = i === 10 ? '*' : i === 11 ? '#' : i.toString();
    acc.set(curr.toString(), button);
    return acc;
  }, new Map());

  console.log('toneMap', toneMap);

  // console.log('wav_url', wav_url);
  const res = await fetch(wav_url);
  const blob = await res.blob();
  const arrayBuf = await blob.arrayBuffer();
  const buf = Buffer.from(arrayBuf);
  // console.log('buf', Uint16Array.from(buf));

  // const file = new Blob([arrayBuf], { type: 'audio/wav' });
  fs.writeFileSync('./temp/test.wav', buf);

  // console.log('input', input.map((c) => (c ? '1' : '0')).join(''));

  const chunks = getChunks(buf);

  const sequence = chunks.reduce((acc, curr) => {
    const button = toneMap.get(curr.toString());
    return acc + button;
  }, '');

  // const f = new FFT(256);
  // // const input = new Array(length).fill(0);
  // const out = f.createComplexArray();

  // // const realInput = new Array(f.size);
  // f.realTransform(out, input);
  // // f.completeSpectrum(out);

  // // console.log('out', out);
  // // console.log('input', input);

  // const htm = fs.readFileSync('./touch-tone-dialing.html', 'utf-8');
  // const h = renderCanvas(out, htm);
  // // const h = renderCanvas(input, htm);

  // fs.writeFileSync('./temp/touch-tone-temp.html', h);

  return { sequence };
};
