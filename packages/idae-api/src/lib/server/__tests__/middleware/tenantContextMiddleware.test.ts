import { describe, it, expect } from 'vitest';
import { tenantContextMiddleware } from '../../middleware/tenantContextMiddleware';
import { createMocks } from 'node-mocks-http';

// Helper to run middleware
function runMiddleware(mw, req, res) {
  return new Promise((resolve) => {
    mw(req, res, () => resolve());
  });
}

describe('tenantContextMiddleware', () => {
  it('injects tenantId from user by default', async () => {
    const { req, res } = createMocks();
    req.user = { tenantId: 't1' };
    await runMiddleware(tenantContextMiddleware(), req, res);
    expect(req.tenantId).toBe('t1');
    expect(req.tenant).toEqual({ id: 't1' });
  });

  it('returns 403 if required and missing', async () => {
    const { req, res } = createMocks();
    req.user = {};
    let called = false;
    res.status = (code) => { res._status = code; return res; };
    await new Promise((resolve, reject) => {
      res.json = (obj) => {
        res._json = obj; called = true;
        if (typeof res._status === 'undefined') res._status = 403;
        res.end && res.end();
        resolve();
      };
      setTimeout(() => reject(new Error('timeout')), 1000);
      runMiddleware(tenantContextMiddleware({ required: true }), req, res);
    });
    expect(res._status).toBe(403);
    expect(res._json).toHaveProperty('error');
    expect(called).toBe(true);
  });

  it('uses custom tenantKey', async () => {
    const { req, res } = createMocks();
    req.user = { orgId: 'org42' };
    await runMiddleware(tenantContextMiddleware({ tenantKey: 'orgId' }), req, res);
    expect(req.tenantId).toBe('org42');
  });

  it('calls setTenantFilter if available', async () => {
    const { req, res } = createMocks();
    req.user = { tenantId: 't2' };
    req.connectedCollection = { setTenantFilter: vi.fn() };
    await runMiddleware(tenantContextMiddleware(), req, res);
    expect(req.connectedCollection.setTenantFilter).toHaveBeenCalledWith('t2');
  });
});
