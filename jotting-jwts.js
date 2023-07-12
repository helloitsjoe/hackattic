const app_url = process.env.APP_URL;

module.exports = async ({ jwt_secret }) => {
  const res = await fetch(app_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jwt_secret }),
  });
  if (!res.ok) {
    throw new Error(res.status);
  }

  const json = await res.json();
  console.log('json', json);

  return { app_url };
};
