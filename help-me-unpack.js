function readBytes(slice) {
  // 32 total array entries
  const byteArray = [...Int32Array.from(slice)].map((int) => {
    const byte = int.toString(2).padStart(8, '0');
    console.log('byte', byte);
    return byte;
  });

  return byteArray.join('');
}

module.exports = ({ bytes }) => {
  const data = Buffer.from(bytes, 'base64');

  // signed
  const signed = readBytes(data.slice(0, 4));
  console.log('signed', signed);
  const int = parseInt(signed, 2) | 0;
  console.log('int', int);

  // unsigned
  const unsigned = readBytes(data.slice(4, 8));
  console.log('unsigned', unsigned);
  const uint = parseInt(unsigned, 2) >>> 0;
  console.log('uint', uint);

  // short
  const shortBytes = readBytes(data.slice(8, 12));
  console.log('shortBytes', shortBytes);
  const short = (parseInt(shortBytes, 2) << 16) >> 16;
  console.log('short', short);

  // float
  const fBytes = data.slice(12, 16);
  const fBuffer = new ArrayBuffer(4);
  const fView = new DataView(fBuffer);
  fBytes.forEach((b, i) => {
    fView.setUint8(i, b);
  });
  const float = fView.getFloat32(0, true);
  console.log('float', float);

  // double
  const doubleBytes = data.slice(16, 24);
  const buf = new ArrayBuffer(8);
  const dView = new DataView(buf);
  doubleBytes.forEach((b, i) => {
    dView.setUint8(i, b);
  });
  const double = dView.getFloat64(0, true);
  console.log('double', double);

  // bigEndianDouble:
  const bedBytes = data.slice(24, 32);
  const bedBuf = new ArrayBuffer(8);
  const bedView = new DataView(bedBuf);
  bedBytes.forEach((b, i) => {
    bedView.setUint8(i, b);
  });
  const big_endian_double = dView.getFloat64(0, true);
  console.log('big_endian_double', big_endian_double);

  const json = { int, uint, short, float, double, big_endian_double };
  console.log('json', JSON.stringify(json));

  return json;
};
