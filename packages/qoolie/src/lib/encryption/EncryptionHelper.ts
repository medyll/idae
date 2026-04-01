/**
 * Encryption Helper using AES-GCM
 */

import type { EncryptionConfig, EncryptedData } from './CryptoTypes.js';
import { deriveKey } from './KeyDerivation.js';

/**
 * EncryptionHelper - encrypts and decrypts data using AES-GCM
 */
export class EncryptionHelper {
  private config: Required<EncryptionConfig>;
  private key: CryptoKey | null = null;

  constructor(config: EncryptionConfig) {
    this.config = {
      enabled: config.enabled ?? true,
      password: config.password,
      salt: config.salt,
      iterations: config.iterations ?? 100000,
      keyLength: config.keyLength ?? 32,
    };
  }

  /**
   * Initialize encryption key (must be called before encrypt/decrypt)
   */
  async init(): Promise<void> {
    this.key = await deriveKey(
      this.config.password,
      this.config.salt,
      this.config.iterations,
      this.config.keyLength
    );
  }

  /**
   * Encrypt data
   */
  async encrypt(data: any): Promise<EncryptedData> {
    if (!this.key) {
      throw new Error('Encryption key not initialized. Call init() first.');
    }

    const encoder = new TextEncoder();
    const plaintext = encoder.encode(JSON.stringify(data));

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt using AES-GCM
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      this.key,
      plaintext
    );

    return {
      ciphertext: ciphertext as ArrayBuffer,
      iv: iv.buffer,
      salt: this.config.salt,
      algorithm: 'AES-GCM',
    };
  }

  /**
   * Decrypt data
   */
  async decrypt(encryptedData: EncryptedData): Promise<any> {
    if (!this.key) {
      throw new Error('Encryption key not initialized. Call init() first.');
    }

    // Decrypt using AES-GCM
    const plaintext = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: encryptedData.iv,
      },
      this.key,
      encryptedData.ciphertext
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(plaintext));
  }

  /**
   * Check if encryption is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Update password and reinitialize key
   */
  async updatePassword(password: string): Promise<void> {
    this.config.password = password;
    await this.init();
  }

  /**
   * Rotate salt (for key rotation)
   */
  rotateSalt(): string {
    const newSalt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    this.config.salt = newSalt;
    return newSalt;
  }
}
