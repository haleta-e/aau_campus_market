const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const { app } = require('../src/server');

describe('AAU Campus Market Backend API Tests', () => {
  let server;
  let baseUrl;

  before(async () => {
    return new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    return new Promise((resolve) => {
      if (server) {
        server.close(resolve);
      } else {
        resolve();
      }
    });
  });

  test('GET / should return 200 and running status', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert.strictEqual(data.message, 'AAU Campus Market API is running');
  });

  test('GET /health should return status object', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.ok(res.status === 200 || res.status === 500);
    const data = await res.json();
    assert.ok(data.status === 'ok' || data.status === 'error');
    assert.ok(data.database === 'connected' || data.database === 'disconnected');
  });
});
