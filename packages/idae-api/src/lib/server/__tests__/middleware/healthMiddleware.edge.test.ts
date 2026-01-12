import { describe, it, expect } from 'vitest';
import { healthHandler, readinessHandler } from '../../middleware/healthMiddleware';
import { createMocks } from 'node-mocks-http';

describe('healthMiddleware', () => {
  it('returns 200 and ok for /health', () => {
    const { req, res } = createMocks();
    let sent = false;
    res.json = (obj) => { res._json = obj; sent = true; res.end && res.end(); };
    res.status = (code) => { res._status = code; return res; };
    healthHandler(req, res);
    if (res._status === undefined) res._status = 200;
    expect(res._status).toBe(200);
    expect(res._json).toHaveProperty('status', 'ok');
    expect(sent).toBe(true);
  });

  it('returns 200 and ready for /ready', () => {
    const { req, res } = createMocks();
    let sent = false;
    res.json = (obj) => { res._json = obj; sent = true; res.end && res.end(); };
    res.status = (code) => { res._status = code; return res; };
    readinessHandler(req, res);
    if (res._status === undefined) res._status = 200;
    expect(res._status).toBe(200);
    // Accept either { status: 'ready' } or { ready: true }
    if (res._json.status) {
      expect(res._json).toHaveProperty('status', 'ready');
    } else {
      expect(res._json).toHaveProperty('ready', true);
    }
    expect(sent).toBe(true);
  });
});
