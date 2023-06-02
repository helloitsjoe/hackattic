const fetch = require('node-fetch');

const data = Buffer.from('o5qZhdv+W8OOagAAOYoCQ7weDKfwDFBAQFAM8KcMHrw=', 'base64')

function readBytes(slice, bigEndian) {
  const byteArray = [...Int32Array.from(slice)].filter(Boolean).map((int) => {
    const foo = int.toString(2).padStart(8, '0')
    console.log('foo', foo);
    return foo
  })

  if (!bigEndian) {
    return byteArray.join('')
  }

  return byteArray.reverse().join('')
}

// 32 total array entries
const signed = readBytes(data.slice(0, 4), true)
console.log('signed', signed);
const int = parseInt(signed, 2);
console.log('dec', int);

// signed: 1295053963

const unsigned = readBytes(data.slice(4, 8), true)
console.log('unsigned', unsigned);
const uint = parseInt(unsigned, 2) >>> 0;
console.log('dec', uint);

// unsigned: 154963415

const shortBytes = readBytes(data.slice(8, 12), true)
console.log('shortBytes', shortBytes);
const short = parseInt(shortBytes, 2);
console.log('dec', short);

// short: 11398

const bytes = data.slice(12, 16)
const buffer = new ArrayBuffer(4);
const byteArray = new Uint8Array(buffer)
for (let i = 0; i < bytes.length; i++) {
  byteArray[i] = bytes[i]
}
console.log('buffer', buffer);
const view = new DataView(buffer);
// const float = readBytes(data.slice(12, 16))
const float = view.getFloat32(0, false)
console.log('float', float);
console.log('dec', parseInt(float, 2));

// float:

const doubleBytes = readBytes(data.slice(16, 24))
console.log('doubleBytes', doubleBytes);
const double = BigInt(`0b${doubleBytes}`);
console.log('dec', double);

// double: 4913111324006377280n

const doubleBigEndian = readBytes(data.slice(24, 32), true)
console.log('doubleBigEndian', doubleBigEndian);
const double_big_endian = BigInt(`0b${doubleBigEndian}`);
console.log('dec', double_big_endian);

// doubleBigEndian: 4913111324006377280n
const json = {
  int, uint, short, float, double: double.toString(), double_big_endian: double_big_endian.toString()
}
console.log('json', JSON.stringify(json));

fetch('https://hackattic.com/challenges/help_me_unpack/solve?access_token=b4d135b7935286bf', {method: 'POST', body: JSON.stringify(json)}).then((res) => {
  if (!res.ok) {
    throw new Error(res.status);
  }
  return res.json()
}).then(console.log)
