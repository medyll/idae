// Test setup for Vitest
import { indexedDB } from 'fake-indexeddb';

// Mock indexedDB globally
(global as any).indexedDB = indexedDB;

// Mock window for browser APIs
if (typeof window === 'undefined') {
  (global as any).window = {
    location: {
      origin: 'https://test.example.com',
    },
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}

// Mock import.meta.env for Node environment
(global as any).import = (global as any).import || {};
(global as any).import.meta = (global as any).import.meta || { env: {} };
