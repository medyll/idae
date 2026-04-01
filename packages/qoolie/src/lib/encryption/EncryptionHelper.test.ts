import { describe, it, expect, beforeEach } from 'vitest';
import { EncryptionHelper } from './EncryptionHelper';
import { generateSalt } from './KeyDerivation';

describe('EncryptionHelper', () => {
  let helper: EncryptionHelper;

  beforeEach(async () => {
    helper = new EncryptionHelper({
      password: 'test-password-123',
      salt: 'test-salt-456',
    });
    await helper.init();
  });

  it('should create an EncryptionHelper instance', () => {
    expect(helper).toBeInstanceOf(EncryptionHelper);
  });

  it('should encrypt and decrypt data', async () => {
    const data = { id: 1, name: 'Alice', secret: 'sensitive-info' };

    const encrypted = await helper.encrypt(data);
    expect(encrypted).toBeDefined();
    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.algorithm).toBe('AES-GCM');

    const decrypted = await helper.decrypt(encrypted);
    expect(decrypted).toEqual(data);
  });

  it('should encrypt different data with different IVs', async () => {
    const data = { id: 1 };

    const encrypted1 = await helper.encrypt(data);
    const encrypted2 = await helper.encrypt(data);

    // IVs should be different even for same data
    // Compare byte lengths and content
    const iv1 = new Uint8Array(encrypted1.iv);
    const iv2 = new Uint8Array(encrypted2.iv);
    expect(iv1.length).toBe(12);
    expect(iv2.length).toBe(12);
    
    // Check that at least some bytes are different
    let different = false;
    for (let i = 0; i < iv1.length; i++) {
      if (iv1[i] !== iv2[i]) {
        different = true;
        break;
      }
    }
    expect(different).toBe(true);
  });

  it('should throw error if not initialized', async () => {
    const uninitHelper = new EncryptionHelper({
      password: 'test',
      salt: 'salt',
    });

    await expect(uninitHelper.encrypt({})).rejects.toThrow(
      'Encryption key not initialized'
    );
  });

  it('should check if encryption is enabled', () => {
    expect(helper.isEnabled()).toBe(true);

    const disabledHelper = new EncryptionHelper({
      enabled: false,
      password: 'test',
      salt: 'salt',
    });
    expect(disabledHelper.isEnabled()).toBe(false);
  });

  it('should update password', async () => {
    const data = { secret: 'test' };
    
    // Encrypt with old password
    const encrypted = await helper.encrypt(data);
    const decryptedOld = await helper.decrypt(encrypted);
    expect(decryptedOld).toEqual(data);

    // Update password and re-encrypt
    await helper.updatePassword('new-password');
    const encryptedNew = await helper.encrypt(data);
    const decryptedNew = await helper.decrypt(encryptedNew);
    expect(decryptedNew).toEqual(data);
  });

  it('should rotate salt', () => {
    const oldSalt = helper['config'].salt;
    const newSalt = helper.rotateSalt();

    expect(newSalt).toBeDefined();
    expect(newSalt).not.toEqual(oldSalt);
    expect(newSalt.length).toBe(32); // 16 bytes = 32 hex chars
  });

  it('should generate unique salts', () => {
    const salt1 = generateSalt();
    const salt2 = generateSalt();

    expect(salt1).not.toEqual(salt2);
  });

  it('should generate salt of correct length', () => {
    const salt = generateSalt(32);
    expect(salt.length).toBe(64); // 32 bytes = 64 hex chars
  });

  it('should handle complex nested objects', async () => {
    const data = {
      user: {
        id: 1,
        profile: {
          name: 'Alice',
          settings: {
            theme: 'dark',
            notifications: true,
          },
        },
        tags: ['admin', 'user'],
      },
      metadata: {
        createdAt: new Date('2024-01-01').toISOString(),
      },
    };

    const encrypted = await helper.encrypt(data);
    const decrypted = await helper.decrypt(encrypted);

    expect(decrypted).toEqual(data);
  });

  it('should handle arrays', async () => {
    const data = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];

    const encrypted = await helper.encrypt(data);
    const decrypted = await helper.decrypt(encrypted);

    expect(decrypted).toEqual(data);
  });
});
