// Encryption module exports

export { EncryptionHelper } from './EncryptionHelper.js';
export { deriveKey, generateSalt } from './KeyDerivation.js';

export type {
  EncryptionConfig,
  EncryptedData,
  CryptoKeyPair,
} from './CryptoTypes.js';
