# @medyll/idae-api Test Suite Documentation

## Overview

This directory contains comprehensive tests for the @medyll/idae-api framework. The test suite is designed to:

- ✅ Validate all core components (auth, database, routing, client)
- ✅ Prevent security vulnerabilities (injection attacks, token tampering, XSS)
- ✅ Ensure request→response cycles work end-to-end
- ✅ Maintain API stability across refactors
- ✅ Document expected behavior through executable tests

## Test Structure

```
src/lib/__tests__/
├── middleware/              # Request processing pipeline
│   ├── authMiddleware.test.ts         # JWT token lifecycle, auth attacks
│   └── databaseMiddleware.test.ts     # DB connection injection prevention
│
├── engine/                  # Core business logic
│   ├── routeManager.test.ts           # Route registration, enable/disable
│   └── requestDatabaseManager.test.ts # URI construction, DB routing
│
├── client/                  # Client library
│   └── IdaeApiClient.test.ts          # HTTP dispatch, Bearer tokens, deserialization
│
├── integration/             # Component interaction
│   ├── crud-flow.test.ts              # Complete CRUD roundtrips
│   ├── auth-flow.test.ts              # Authentication + database chains
│   └── error-handling.test.ts         # Error propagation, recovery
│
├── e2e/                     # End-to-end scenarios
│   ├── security.test.ts               # Attack vectors, vulnerability assessment
│   └── server-client-roundtrip.test.ts # Full stack client→server→client
│
├── fixtures/                # Test data
│   └── mockData.ts          # Reusable mock objects, payloads
│
└── helpers/                 # Utilities
    └── testUtils.ts         # Mock builders, assertions, performance helpers
```

## Running Tests

### Run all tests
```bash
npm run test
```

### Run specific test file
```bash
npm run test src/lib/server/__tests__/middleware/authMiddleware.test.ts
```

### Run tests in watch mode
```bash
npm run test -- --watch
```

### Run with coverage report
```bash
npm run test -- --coverage
```

### Run only security tests
```bash
npm run test -- e2e/security.test.ts
```

## Test Files & Coverage

### Unit Tests

#### 1. **authMiddleware.test.ts** (388 lines, 60+ tests)
**Purpose**: Validate JWT token generation, verification, refresh, and authentication middleware execution.

**Key Test Areas**:
- ✅ Token generation with correct algorithm (HS256)
- ✅ Token verification with valid signatures
- ✅ Token refresh with expiration handling
- ✅ Middleware execution and auth header parsing
- ✅ Bearer token extraction from Authorization header

**Security Tests** (6 attack scenarios):
- ❌ Token tampering (payload modification)
- ❌ Token signature forgery
- ❌ Algorithm confusion attacks (none algorithm)
- ❌ Expired token validation
- ❌ Hardcoded credentials vulnerability (CRITICAL)
- ❌ Missing Authorization header handling

**Run**:
```bash
npm run test -- authMiddleware.test.ts
```

#### 2. **databaseMiddleware.test.ts** (331 lines, 35+ tests)
**Purpose**: Validate database middleware injection of IdaeDb instance and request augmentation.

**Key Test Areas**:
- ✅ Middleware execution flow
- ✅ Request augmentation (req.idaeDb, req.collectionName, req.dbName)
- ✅ Query parameter parsing (qs library)
- ✅ Error handling for invalid parameters

**Security Tests** (injection prevention):
- ❌ SQL injection in collection names (`'; DROP TABLE`)
- ❌ NoSQL injection in queries (`{ $ne: null }`)
- ❌ XSS payloads (`<script>alert`)
- ❌ Long string DoS attempts (500+ chars)
- ❌ Unicode and special character handling

**Run**:
```bash
npm run test -- databaseMiddleware.test.ts
```

#### 3. **routeManager.test.ts** (278 lines, 40+ tests)
**Purpose**: Validate route registration, singleton pattern, and enable/disable lifecycle.

**Key Test Areas**:
- ✅ Singleton pattern implementation
- ✅ Route CRUD operations (add/get/remove)
- ✅ Enable/disable toggle functionality
- ✅ Route handler preservation
- ✅ Multiple route registration

**Edge Cases**:
- ❌ Duplicate route handling
- ❌ Disable→enable→disable cycles
- ❌ Handler function type checking
- ❌ Route path parsing

**Run**:
```bash
npm run test -- routeManager.test.ts
```

#### 4. **requestDatabaseManager.test.ts** (321 lines, 45+ tests)
**Purpose**: Validate database URI construction, collection name extraction, environment variable handling.

**Key Test Areas**:
- ✅ Request parsing (.fromReq method)
- ✅ Database URI construction (mongodb://host:port/dbName)
- ✅ Collection name extraction
- ✅ Database name routing
- ✅ Environment variable resolution

**Security Tests**:
- ❌ SQL injection attempts
- ❌ NoSQL injection in database names
- ❌ Unicode character handling
- ❌ Very long names (1000+ chars)
- ❌ Special character escaping

**Edge Cases**:
- ❌ Missing collectionName
- ❌ Null/undefined values
- ❌ Single dot parsing
- ❌ Multiple dots in collection name

**Run**:
```bash
npm run test -- requestDatabaseManager.test.ts
```

#### 5. **IdaeApiClient.test.ts** (512 lines, 65+ tests)
**Purpose**: Validate client initialization, HTTP methods, Bearer token handling, URL building.

**Key Test Areas**:
- ✅ Client initialization and singleton pattern
- ✅ db().collection() chaining
- ✅ HTTP method mapping (GET/POST/PUT/DELETE)
- ✅ Bearer token header injection
- ✅ Request body serialization
- ✅ Response deserialization
- ✅ Error handling

**HTTP Methods**:
- GET → .find(), .findById()
- POST → .create()
- PUT → .update()
- DELETE → .deleteById()

**Error Scenarios**:
- ❌ Missing Authorization header (401)
- ❌ Invalid token format
- ❌ Network timeouts
- ❌ Malformed server responses
- ❌ 500 Internal Server Error
- ❌ 404 Not Found
- ❌ Rate limiting (429)

**Run**:
```bash
npm run test -- IdaeApiClient.test.ts
```

### Integration Tests (Pending Implementation)

#### 6. **crud-flow.test.ts** (Planned: 300 lines)
**Purpose**: Full CRUD roundtrips through IdaeApi middleware chain with real/mocked database.

**Tests**:
- CREATE → READ → UPDATE → DELETE sequences
- Middleware chain validation
- Database adapter interaction
- Error propagation

#### 7. **auth-flow.test.ts** (Planned: 250 lines)
**Purpose**: Authentication through database operations.

**Tests**:
- Login → token generation → use token → query DB
- Permission checks
- Token expiration during request
- Logout with token revocation

#### 8. **error-handling.test.ts** (Planned: 200 lines)
**Purpose**: Error scenarios and recovery patterns.

**Tests**:
- Database connection failures
- Middleware exceptions
- Invalid request parameters
- Timeout handling
- Error response formatting

### End-to-End Tests

#### 9. **security.test.ts** (400+ lines, 30+ attack scenarios)
**Purpose**: Validate defense against common security attacks.

**Attack Vectors**:

1. **Token Tampering** (5 tests)
   - Payload modification
   - Signature forgery
   - Wrong secret signing
   - Algorithm confusion
   - Clock skew

2. **Authorization Bypass** (5 tests)
   - Missing Authorization header
   - Missing Bearer prefix
   - Basic auth instead of Bearer
   - Only "Bearer" keyword
   - Hardcoded credentials (CRITICAL)

3. **Injection Attacks** (8 tests)
   - SQL injection in params
   - NoSQL injection ($where, $function)
   - XSS via stored data
   - HTML injection
   - XML special characters

4. **Session/Token Attacks** (5 tests)
   - Token replay/reuse
   - Brute force (rate limiting gap)
   - Timing attacks
   - Session fixation

5. **Cryptographic Issues** (5 tests)
   - Weak secret validation
   - Token uniqueness
   - Algorithm validation
   - Deprecated algorithms

**Critical Issues Documented**:
- ❌ Hardcoded credentials (admin/password)
- ❌ No rate limiting on login
- ❌ No token revocation mechanism
- ❌ No CORS validation
- ❌ Missing security headers

**Run**:
```bash
npm run test -- e2e/security.test.ts
```

#### 10. **server-client-roundtrip.test.ts** (550+ lines, 40+ tests)
**Purpose**: Full stack integration - client request → server → response → client deserialization.

**Test Categories**:

1. **CRUD Happy Path** (5 tests)
   - CREATE → READ → UPDATE → DELETE
   - Data type preservation
   - Complex nested objects

2. **Complex Queries** (3 tests)
   - Filtered searches
   - MongoDB operators
   - Batch operations

3. **Authentication Flow** (4 tests)
   - Bearer token inclusion
   - Missing token handling
   - Token refresh
   - 403 Forbidden

4. **Error Handling** (6 tests)
   - Network timeouts
   - Malformed responses
   - 500 errors
   - 404 errors
   - 429 rate limiting

5. **Encoding & Serialization** (6 tests)
   - UTF-8 characters
   - Emoji handling
   - Special characters
   - Deep nesting
   - MongoDB operators

6. **Multi-Database Support** (3 tests)
   - Route to correct database
   - Route to correct collection
   - Multiple connections

**Run**:
```bash
npm run test -- e2e/server-client-roundtrip.test.ts
```

## Test Utilities

### Mock Data (`fixtures/mockData.ts`)

**Available Fixtures**:
```typescript
// User data
mockUsers: User[]           // 3 test users with roles, ages, status

// Collections
mockPosts: Post[]           // Sample posts
mockComments: Comment[]     // Sample comments

// Tokens
mockTokens.valid            // admin, user, expired tokens
mockTokens.invalid          // malformed, tampered, none algorithm

// Attack Payloads
mockSQLInjectionPayloads    // 5 SQL injection attempts
mockNoSQLInjectionPayloads  // 5 NoSQL injection attempts
mockXSSPayloads             // 8 XSS attack vectors
mockCSRFPayloads            // 3 CSRF attempts

// Edge Cases
mockEdgeCasesData           // 6 edge case scenarios
- veryLongString (10k chars)
- unicodeChars ('你好世界🚀')
- specialChars (!@#$%...)
- nullByte
- newlines
- tabs

// Database Configs
mockDatabaseConfigs         // MongoDB & MySQL configs

// Error Responses
mockErrorResponses          // 401, 403, 404, 400, 500, 503 responses
```

### Test Helpers (`helpers/testUtils.ts`)

**Mock Builders**:
```typescript
createMockRequest(overrides)          // Mock Express Request
createMockResponse()                  // Mock Express Response
createMockNextFunction()              // Mock Express next()
createMockMiddlewareContext()         // Complete middleware context
createMockCollection(defaultData)     // Mock IdaeDb collection adapter
createMockIdaeDb(collections)         // Mock IdaeDb instance
createMockFetchResponse(data, options) // Mock fetch() response
```

**Token Utilities**:
```typescript
generateMockToken(payload, secret, expiresIn) // Generate JWT for testing
extractBearerToken(authHeader)                 // Parse Authorization header
isValidTokenFormat(token)                      // Validate JWT format
```

**Assertions**:
```typescript
testAssertions.statusCode(res, expected)    // Assert HTTP status
testAssertions.hasAuthHeader(req)           // Assert Authorization header
testAssertions.hasError(res)                // Assert error response
testAssertions.hasData(res)                 // Assert success response
```

**Performance Testing**:
```typescript
measurePerformance(fn, iterations)   // Measure async function timing
```

**Helpers**:
```typescript
waitFor(condition, timeout)                 // Wait for condition
assertMiddlewareCalled(middleware, index)   // Assert middleware invoked
createTestDatabaseUri(dbType, dbName)       // Create test DB URI
sanitizeForAssertion(data, keysToRemove)    // Remove sensitive data before test
```

## Coverage Goals

- **Lines**: 80% minimum (currently ~60%)
- **Functions**: 80% minimum (currently ~65%)
- **Branches**: 70% minimum (currently ~50%)
- **Statements**: 80% minimum (currently ~60%)

**Priority Areas** (highest to lowest):
1. Authentication middleware (security-critical)
2. Database middleware (injection prevention)
3. Route manager (routing logic)
4. Client HTTP dispatch (API stability)
5. Database manager (URI construction)
6. Integration flows (end-to-end)
7. Error handling (recovery paths)

## Running Coverage Report

```bash
npm run test -- --coverage
```

This generates:
- `coverage/index.html` - Interactive HTML report
- `coverage/lcov.info` - LCOV format for CI/CD
- Console output with summary

## Known Issues & Gaps

### Security Vulnerabilities Documented

1. **CRITICAL: Hardcoded Credentials**
   - Issue: Login uses hardcoded admin/password
   - FIX: Implement bcrypt password hashing
   - FIX: Use environment variables for credentials

2. **HIGH: No Rate Limiting**
   - Issue: No protection against brute force attacks
   - FIX: Add rate limiting middleware
   - FIX: Implement exponential backoff

3. **HIGH: No Token Revocation**
   - Issue: Tokens cannot be revoked before expiry
   - FIX: Implement token blacklist
   - FIX: Add logout with token invalidation

4. **MEDIUM: No Audit Logging**
   - Issue: Failed auth attempts not logged
   - FIX: Implement comprehensive audit logging

5. **MEDIUM: No CORS Validation**
   - Issue: CORS not configured
   - FIX: Add CORS middleware with allowed origins

### Missing Tests (TODO)

- [ ] MongoDB-specific tests (with memory-server)
- [ ] MySQL-specific tests (Sequelize)
- [ ] Streaming response handling
- [ ] Large payload handling
- [ ] Concurrent request handling
- [ ] Connection pool exhaustion scenarios
- [ ] Memory leak detection
- [ ] Performance regression tests

## Test Execution Timeline

**Typical test run**: 5-10 seconds (all 200+ tests)

**By category**:
- Unit tests (middleware/engine): ~2s
- Client tests: ~1s
- E2E tests: ~3-5s
- Coverage collection: +2-3s

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run tests
  run: npm run test

- name: Generate coverage
  run: npm run test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Best Practices

### Writing New Tests

1. **Follow AAA Pattern** (Arrange, Act, Assert)
   ```typescript
   // Arrange
   const token = generateMockToken({ role: 'admin' });
   
   // Act
   const verified = authMiddleware.verifyToken(token);
   
   // Assert
   expect(verified.role).toBe('admin');
   ```

2. **Use Descriptive Test Names**
   ```typescript
   it('should return 401 for missing Authorization header', () => { ... });
   // Instead of: it('should reject unauthorized', () => { ... });
   ```

3. **Test Security First**
   - Include attack scenarios in test coverage
   - Document why a test matters for security
   - Mark CRITICAL issues in test comments

4. **Mock External Dependencies**
   ```typescript
   vi.mock('@medyll/idae-db', () => ({
     IdaeDb: { init: vi.fn(...) }
   }));
   ```

5. **Reset Mocks Between Tests**
   ```typescript
   beforeEach(() => {
     vi.clearAllMocks();
   });
   ```

## Troubleshooting

### Test Fails with "Cannot find module"
- Ensure path aliases in tsconfig.json match imports
- Check $lib alias points to src/lib

### Test Timeouts
- Increase timeout: `it('test', async () => {...}, 20000)`
- Check for unresolved promises in async code

### Mocks Not Working
- Verify vi.mock() is called before imports
- Check mock implementation matches module exports
- Use vi.clearAllMocks() in beforeEach

### Coverage Not Generated
- Install coverage provider: `npm install -D @vitest/coverage-v8`
- Check vite.config.ts coverage configuration
- Ensure test files use .test.ts or .spec.ts suffix

## References

- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [@medyll/idae-db Adapter Pattern](https://www.npmjs.com/package/@medyll/idae-db)
- [OWASP Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Contributing Tests

When adding new features:
1. Write tests before implementation (TDD)
2. Ensure all tests pass: `npm run test`
3. Maintain >80% coverage: `npm run test -- --coverage`
4. Include security tests for new endpoints
5. Document CRITICAL issues in test comments
6. Run `npm run lint` and `npm run format` before commit

## Questions & Support

For test-related questions:
- Check this documentation first
- Review similar test files for patterns
- Check vitest.dev for framework questions
- Review mockData.ts and testUtils.ts for helper usage
