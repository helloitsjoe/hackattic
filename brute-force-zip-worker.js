const { parentPort, workerData } = require('node:worker_threads');
const cp = require('node:child_process');

console.log('workerData', workerData);

const CORES = 6;

function bruteForce(mod) {
  // return new Promise((resolve, reject) => {
  // Password is 4-6 characters long, ascii

  // console.log('mod', mod);
  // Lowercase and numeric
  const total = 26 + 10;
  const chunk = Math.floor(total / CORES);
  const offset = mod * chunk;
  // console.log('offset', offset);
  // console.log('chunk', chunk);
  // console.log('mod', mod);

  const start = 48 + offset;
  const end = 48 + offset + chunk;

  // console.log('start', start);
  // console.log('end', end);

  // console.log('start, end', start, end);

  for (let i = start; i < end; i++) {
    if (i > 57 && i < 97) continue;
    for (let j = 48; j < 122; j++) {
      if (j > 57 && j < 97) continue;
      for (let k = 48; k < 122; k++) {
        if (k > 57 && k < 97) continue;
        for (let l = 48; l < 122; l++) {
          if (l > 57 && l < 97) continue;
          const pw =
            String.fromCharCode(i) +
            String.fromCharCode(j) +
            String.fromCharCode(k) +
            String.fromCharCode(l);

          try {
            const secret = cp.execSync(
              `unzip -qq -P ${pw} -o ./temp/file.zip -d ./temp/unzip`
            );
            parentPort.postMessage(`secret ${secret}`);
          } catch (err) {
            parentPort.postMessage(err.message);
          }
        }
      }
    }
  }
}

const secretIsFound = bruteForce(workerData);
console.log('secretIsFound', secretIsFound);

if (secretIsFound) {
  parentPort.postMessage(secretIsFound);
}
