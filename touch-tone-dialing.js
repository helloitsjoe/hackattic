const wav = require('node-wav');
const FFT = require('fft.js');

module.exports = async ({ wav_url }) => {
  console.log('wav_url', wav_url);
  const res = await fetch(wav_url);
  const blob = await res.blob();
  const arrayBuf = await blob.arrayBuffer();

  const result = wav.decode(arrayBuf);
  console.log('result', result);
  const input = result.channelData[0];
  const { length } = input;

  console.log('result', length);

  // const f = new FFT(4096);
  // const input = new Array(length).fill(0);
  // const out = f.createComplexArray();

  // const realInput = new Array(f.size);
  // f.realTransform(out, input);

  // console.log('out', out);
  // console.log('input', input);

  return { sequence: '1' };
};
