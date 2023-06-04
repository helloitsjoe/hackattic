const fetch = require('node-fetch');

const data = Buffer.from('OIdYirCeqdNc6gAAYb2jQ8c827AGeRJAQBJ5BrDbPMc=', 'base64')

function readBytes(slice, bigEndian = true) {
  const byteArray = [...Int32Array.from(slice)].map((int) => {
    const foo = int.toString(2).padStart(8, '0')
    console.log('foo', foo);
    return foo
  })

  if (bigEndian) {
    return byteArray.reverse().join('')
  }

  return byteArray.join('')
}

// 32 total array entries
const signed = readBytes(data.slice(0, 4))
console.log('signed', signed);
const int = parseInt(signed, 2) | 0;
console.log('dec', int);

// signed: 1295053963

const unsigned = readBytes(data.slice(4, 8))
console.log('unsigned', unsigned);
const uint = parseInt(unsigned, 2) >>> 0;
console.log('dec', uint);

// unsigned: 154963415

const shortBytes = readBytes(data.slice(8, 12))
console.log('shortBytes', shortBytes);
const short = (parseInt(shortBytes, 2) << 16) >> 16;
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
const float = view.getFloat32(0, true)
console.log('float', float);

// float:

const doubleBytes = data.slice(16, 24)
const buf = new ArrayBuffer(8);
const dView = new DataView(buf);

doubleBytes.forEach((b, i) => {
  dView.setUint8(i, b)
})

const double = dView.getFloat64(0, true)
console.log('double', double);


// console.log('doubleBytes', doubleBytes);
// const doubleByteArray = new Uint16Array(doubleBytes)
// const doubleView = new DataView(doubleByteArray.buffer, 0);
// for (let i = 0; i < doubleBytes.length; i++) {
//   console.log('doubleBytes[i]', doubleBytes[i]);
//   doubleView.setInt16(i, doubleBytes[i], true)
// }
// console.log('doubleByteArray', doubleByteArray);
// console.log('doubleBuffer', doubleByteArray.buffer);
// console.log('doubleView', doubleView);
// const double = doubleView.getFloat64(0, true)
// console.log('double', double);

// const doubleBytes = readBytes(data.slice(16, 24))
// console.log('doubleBytes', doubleBytes);
// const doubleBig = BigInt(`0b${doubleBytes}`);
// const doubleArr = new Float64Array(1)
// doubleArr[0] = doubleBytes;
// const double = doubleArr[0]
// console.log('dec', double);

// double: 4913111324006377280n

const bedBytes = data.slice(24, 32)
const bedBuf = new ArrayBuffer(8)
const bedView = new DataView(bedBuf);

bedBytes.forEach((b, i) => {
  bedView.setUint8(i, b)
})

const big_endian_double = dView.getFloat64(0, true)
console.log('big_endian_double', big_endian_double);

// bigEndianDouble: 4913111324006377280n
const json = { int, uint, short, float, double, big_endian_double }
console.log('json', JSON.stringify(json));

fetch('https://hackattic.com/challenges/help_me_unpack/solve?access_token=b4d135b7935286bf', {method: 'POST', body: JSON.stringify(json)}).then((res) => {
  if (!res.ok) {
    throw new Error(res.status);
  }
  return res.json()
}).then(console.log)
