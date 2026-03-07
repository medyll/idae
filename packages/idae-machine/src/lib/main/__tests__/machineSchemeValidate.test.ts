import { describe, it, expect, beforeEach } from 'vitest';
import { MachineDb } from '../machineDb.js';
import { MachineSchemeFieldType } from '$lib/main/machine/MachineFieldType.js';

// Small test model
const model = {
  user: {
    keyPath: '++id',
    model: {},
    ts: {} as any,
    template: {
      index: 'id',
      presentation: 'email name',
      fields: {
        id: 'id (readonly)',
        email: 'email (required)',
        age: 'number',
        name: 'text (required)',
        password: 'text (required)',
        confirm: 'text',
        asyncField: 'asyncCheck',
      },
      fks: {},
    },
  },
} as any;

function createDb() {
  return new MachineDb(model);
}

describe('MachineSchemeValidate - advanced', () => {
  beforeEach(() => {
    // register an async validator type
    MachineSchemeFieldType.registerFieldType({
      id: 'asyncCheck',
      formatter: (v) => v,
      validator: async (value) => {
        // simulate async check
        return Promise.resolve(String(value) === 'ok');
      },
    });
  });

  it('valid email passes', async () => {
    const db = createDb();
    const validator = db.collection('user').validator;
    const r = await validator.validateField('email', 'alice@example.com');
    expect(r.isValid).toBe(true);
  });

  it('invalid email fails', async () => {
    const db = createDb();
    const validator = db.collection('user').validator;
    const r = await validator.validateField('email', 'not-an-email');
    expect(r.isValid).toBe(false);
  });

  it('number type validation', async () => {
    const db = createDb();
    const validator = db.collection('user').validator;
    const rGood = await validator.validateField('age', 42);
    const rBad = await validator.validateField('age', 'nope');
    expect(rGood.isValid).toBe(true);
    expect(rBad.isValid).toBe(false);
  });

  it('required field missing fails in form', async () => {
    const db = createDb();
    const validator = db.collection('user').validator;
    const out = await validator.validateForm({ age: 30 } as any);
    expect(out.isValid).toBe(false);
    expect(out.invalidFields).toContain('email');
    expect(out.invalidFields).toContain('name');
    expect(out.invalidFields).toContain('password');
  });

  it('async validator passes when value ok', async () => {
    const db = createDb();
    const validator = db.collection('user').validator;
    const r = await validator.validateField('asyncField', 'ok');
    expect(r.isValid).toBe(true);
  });

  it('async validator fails when value not ok', async () => {
    const db = createDb();
    const validator = db.collection('user').validator;
    const r = await validator.validateField('asyncField', 'bad');
    expect(r.isValid).toBe(false);
  });

  it('cross-field validator: password match passes', async () => {
    const db = createDb();
    const validator = db.collection('user').validator;
    const form = { email: 'a@b.com', name: 'A', password: 'p', confirm: 'p' } as any;
    const out = await validator.validateForm(form, {
      crossFieldValidators: [async (data) => {
        if (String(data.password) !== String(data.confirm)) return { isValid: false, errors: { confirm: 'mismatch' } };
        return true;
      }],
    });
    expect(out.isValid).toBe(true);
  });

  it('cross-field validator: password mismatch yields error map', async () => {
    const db = createDb();
    const validator = db.collection('user').validator;
    const form = { email: 'a@b.com', name: 'A', password: 'p', confirm: 'q' } as any;
    const out = await validator.validateForm(form, {
      crossFieldValidators: [async (data) => {
        if (String(data.password) !== String(data.confirm)) return { isValid: false, errors: { confirm: 'mismatch' } };
        return true;
      }],
    });
    expect(out.isValid).toBe(false);
    expect(out.errors).toHaveProperty('confirm');
  });

  it('validateFieldValue returns boolean', async () => {
    const db = createDb();
    const validator = db.collection('user').validator;
    const ok = await validator.validateFieldValue('email', 'x@x.com');
    const bad = await validator.validateFieldValue('email', 'x');
    expect(ok).toBe(true);
    expect(bad).toBe(false);
  });

  it('ignoreFields option skips validation', async () => {
    const db = createDb();
    const validator = db.collection('user').validator;
    const out = await validator.validateForm({} as any, { ignoreFields: ['email', 'name', 'password'] });
    // only required checked fields ignored, remaining optional fields ok -> should be valid
    expect(out.isValid).toBe(true);
  });

  it('complete valid form passes', async () => {
    const db = createDb();
    const validator = db.collection('user').validator;
    const form = { email: 'ok@ok.com', name: 'A', password: 'p', confirm: 'p', age: 21, asyncField: 'ok' } as any;
    const out = await validator.validateForm(form, {});
    expect(out.isValid).toBe(true);
  });

});
