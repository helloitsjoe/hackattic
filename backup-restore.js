const path = require('path');
const { execSync } = require('child_process');
const { fetch, BASE_URL } = require('./utils');
const { Client } = require('pg');
const { writeFileSync, rmSync } = require('fs');

const getUrl = new URL(`${BASE_URL}/backup_restore/problem`);
getUrl.searchParams.set('access_token', process.env.ACCESS_TOKEN);

const postUrl = new URL(`${BASE_URL}/backup_restore/solve`);
postUrl.searchParams.set('access_token', process.env.ACCESS_TOKEN);

const client = new Client({
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST || '0.0.0.0',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DB,
});

(async function () {
  await client.connect();

  const encoded = await fetch(getUrl);
  const db = Buffer.from(encoded.dump, 'base64');

  // load db into postgres
  try {
    rmSync('temp/db.dump');
  } catch (err) {
    console.log('err', err);
  }
  writeFileSync('temp/db.dump.gz', db);

  // Expects postgres DB to be running
  execSync('docker exec my-db gunzip /workdir/db.dump.gz');
  execSync(
    'docker exec my-db psql -U postgres -d postgres -f /workdir/db.dump'
  );

  const res = await client.query(
    `SELECT * FROM criminal_records WHERE status = 'alive'`
  );

  console.log('res', res.rows);

  // extract SSNs for anyone 'alive'
  const alive_ssns = res.rows.map(({ ssn }) => ssn);
  console.log('alive_ssns', alive_ssns);

  const response = await fetch(postUrl, {
    method: 'POST',
    body: JSON.stringify({ alive_ssns }),
  });

  console.log('response', response);
  await client.end();
})();
