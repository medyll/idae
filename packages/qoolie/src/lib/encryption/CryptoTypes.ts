/**
 * Encryption types
 */

export interface EncryptionConfig {
  /** Enable encryption */
  enabled?: boolean;
  /** Password for key derivation */
  password: string;
  /** Salt for PBKDF2 (should be stored securely) */
  salt: string;
  /** Iterations for PBKDF2 (default: 100000) */
  iterations?: number;
  /** Key length in bytes (default: 32 for AES-256) */
  keyLength?: number;
}

export interface EncryptedData {
  /** Encrypted ciphertext */
  ciphertext: ArrayBuffer;
  /** Initialization vector */
  iv: ArrayBuffer;
  /** Salt used for key derivation */
  salt: string;
  /** Algorithm identifier */
  algorithm: string;
}

export type CryptoKeyPair = {
  encryptionKey: CryptoKey;
};
