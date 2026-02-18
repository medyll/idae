// Import the legacy script and call its registration helper so tests run under Vitest
import { registerVitestTests } from '../scripts/test-server-slots.js';
import { describe, it, expect } from 'vitest';

registerVitestTests(describe, it, expect);
