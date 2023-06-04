const fetch = require('node-fetch');

const data = Buffer.from('q6Gxg9ef68+CQQAA0s6CQ7KsetX8GGNAQGMY/NV6rLI=', 'base64')

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
console.log('int', int);

// signed: 1295053963

const unsigned = readBytes(data.slice(4, 8))
console.log('unsigned', unsigned);
const uint = parseInt(unsigned, 2) >>> 0;
console.log('uint', uint);

// unsigned: 154963415

const shortBytes = readBytes(data.slice(8, 12))
console.log('shortBytes', shortBytes);
const short = (parseInt(shortBytes, 2) << 16) >> 16;
console.log('short', short);

// short: 11398

const fBytes = data.slice(12, 16)
const fBuffer = new ArrayBuffer(4);
const fView = new DataView(fBuffer);
fBytes.forEach((b, i) => {
  fView.setUint8(i, b)
})
const float = fView.getFloat32(0, true)
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

// double: 

const bedBytes = data.slice(24, 32)
const bedBuf = new ArrayBuffer(8)
const bedView = new DataView(bedBuf);

bedBytes.forEach((b, i) => {
  bedView.setUint8(i, b)
})

const big_endian_double = dView.getFloat64(0, true)
console.log('big_endian_double', big_endian_double);

// bigEndianDouble: 

const json = { int, uint, short, float, double, big_endian_double }
console.log('json', JSON.stringify(json));

fetch('https://hackattic.com/challenges/help_me_unpack/solve?access_token=b4d135b7935286bf&playground=1', {method: 'POST', body: JSON.stringify(json)}).then((res) => {
  if (!res.ok) {
    throw new Error(res.status);
  }
  return res.json()
}).then(console.log)
