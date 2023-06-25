const fs = require('node:fs');
const { Worker } = require('node:worker_threads');

const CORES = 6;

module.exports = async ({ zip_url }) => {
  let secretFound = false;

  console.log('zip_url', zip_url);
  const res = await fetch(zip_url);
  const zip = await res.blob();

  const buf = await zip.arrayBuffer();

  fs.writeFileSync('./temp/file.zip', Buffer.from(buf));

  const workers = {};

  for (let i = 0; i < CORES; i++) {
    const worker = new Worker('./brute-force-zip-worker.js', { workerData: i });
    workers[worker.id] = i;

    worker.on('message', (message) => {
      if (message.startsWith('secret')) {
        secretFound = true;
        console.log('secret found!', message);
      }
      console.log('message', message);
    });

    // worker.on('exit', (code) => {
    //   console.log(`Process ${worker.process.pid} exited with code ${code}`);
    //   const i = workerIds[worker.id];
    //   console.log('worker.id', worker.id, 'i', i);
    //   const newWorker = cluster.fork({ i });
    //   workerIds[newWorker.id] = i;
    // });
  }

  await new Promise((r) => setTimeout(r, 30000));
  console.log('here?');

  if (secretFound) {
    console.log('secretFound', secretFound);
    const secret = fs.readFileSync('./temp/unzip/secret.txt');
    console.log('secret written', secret);
    return { secret };
  }
  return { secret: null };
};
