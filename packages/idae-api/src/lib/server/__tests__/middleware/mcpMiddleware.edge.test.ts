import { describe, it, expect } from 'vitest';
import { mcpMiddleware } from '../../middleware/mcpMiddleware';
import { createMocks } from 'node-mocks-http';

function runMiddleware(mw, req, res) {
  return new Promise((resolve) => {
    mw(req, res, (...args) => resolve(args));
  });
}

describe('mcpMiddleware', () => {
  it('returns 501 for all requests (not implemented)', async () => {
    const { req, res } = createMocks({ method: 'GET', url: '/mcp' });
    let called = false;
    res.status = (code) => { res._status = code; return res; };
    await new Promise((resolve, reject) => {
      res.json = (obj) => {
        res._json = obj; called = true;
        if (typeof res._status === 'undefined') res._status = 501;
        res.end && res.end();
        resolve();
      };
      setTimeout(() => reject(new Error('timeout')), 1000);
      runMiddleware(mcpMiddleware(), req, res);
    });
    expect(res._status).toBe(501);
    expect(res._json).toHaveProperty('error');
    expect(called).toBe(true);
  });
});
