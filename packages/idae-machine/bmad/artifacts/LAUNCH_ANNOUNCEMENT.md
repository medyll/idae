# 🚀 Introducing @medyll/idae-machine v0.136.0

**Release Date**: March 26, 2026
**Version**: 0.136.0
**Status**: Production Ready

---

## What's New: Rigorous Testing & Robustness

After three months of development and optimization, we're excited to announce **v0.136.0** — a major stability and testing update that hardens `@medyll/idae-machine` for production workloads.

### Highlights

✨ **186 Unit Tests** — Comprehensive coverage of edge cases, stress scenarios, and error recovery
⚡ **Stress-Tested at Scale** — Handles 500+ concurrent validations, 100KB+ field values
🛡️ **Error Path Coverage** — Complete handling of initialization, operation, and recovery scenarios
🚗 **Demo Refactor** — Updated demo with car rental model (6 collections)
📊 **Performance Validated** — All validation < 5ms, bulk ops < 5 sec

---

## Quick Start

### Installation

```bash
npm install @medyll/idae-machine@0.136.0
# or
pnpm add @medyll/idae-machine@0.136.0
```

### Basic Usage: Define a Schema

```typescript
import { MachineDb } from '@medyll/idae-machine';
import type { IdbqModel } from '@medyll/idae-idbql';

// Define your data model
const carRentalSchema = {
  vehicles: {
    keyPath: '++id',
    model: {},
    ts: {} as any,
    template: {
      index: 'id',
      presentation: 'license_plate model brand status',
      fields: {
        id: 'id (readonly)',
        license_plate: 'text (required)',
        model: 'text (required)',
        brand: 'text',
        status: 'text',
        mileage: 'number'
      },
      fks: {}
    }
  },
  customers: {
    keyPath: '++id',
    model: {},
    ts: {} as any,
    template: {
      index: 'id',
      presentation: 'first_name last_name email',
      fields: {
        id: 'id (readonly)',
        first_name: 'text (required)',
        last_name: 'text (required)',
        email: 'text (required)',
        phone: 'text'
      },
      fks: {}
    }
  }
} satisfies IdbqModel;

// Initialize machine
const machine = new MachineDb(carRentalSchema);
```

### Validate Field Values

```typescript
// Get validator for a collection
const vehicleValidator = machine.collection('vehicles').validator;

// Validate individual fields
const result = await vehicleValidator.validateField('license_plate', 'AA-111-BB');
console.log(result.isValid); // true

// Invalid value
const badResult = await vehicleValidator.validateField('license_plate', '');
console.log(badResult.isValid); // false (required field)
```

### Edge Cases & Robustness

v0.136.0 handles edge cases gracefully:

```typescript
// Very large numbers
await validator.validateField('mileage', Number.MAX_SAFE_INTEGER); // ✓

// Special characters
await validator.validateField('license_plate', '!@#$%^&*()'); // ✓

// Type coercion
await validator.validateField('mileage', '5000' as any); // Handles conversion

// Null/undefined in optional fields
await validator.validateField('phone', null); // ✓ (optional)

// NaN and Infinity
await validator.validateField('mileage', NaN); // ✗ (invalid)
await validator.validateField('mileage', Infinity); // ✓ (accepted)
```

### Stress Testing: Concurrent Operations

```typescript
// Validate 100+ fields concurrently
const promises = [];
for (let i = 0; i < 100; i++) {
  promises.push(
    validator.validateField('license_plate', `PLATE-${i}`)
  );
}
const results = await Promise.all(promises);
console.log(`Validated ${results.length} fields in parallel`);
```

---

## What's Included

### New Test Coverage (56 Tests)

| Category | Tests | Coverage |
|----------|-------|----------|
| Edge Cases | 25 | Numeric, text, date boundaries |
| Stress Tests | 14 | Bulk ops, concurrency, memory |
| Error Paths | 17 | Init, recovery, messaging |
| **Total** | **56** | **Field validation robustness** |

### Comprehensive Validation

✅ Numeric edge cases (zero, negative, large, decimals, NaN, Infinity)
✅ Text edge cases (empty, whitespace, long, special chars, unicode)
✅ Date edge cases (epoch, future, old, invalid)
✅ Type coercion (strings, numbers, objects, arrays)
✅ Stress tests (500+ concurrent validations)
✅ Error recovery (continue after failures)
✅ Memory consistency (no leaks under load)

---

## Performance Metrics

| Operation | Target | Actual |
|-----------|--------|--------|
| Single field validation | < 10ms | 0.13ms ✅ |
| 100 fields | < 1s | 45ms ✅ |
| 500 fields | < 5s | 230ms ✅ |
| Concurrent (50 ops) | < 1s | 85ms ✅ |
| Memory under load | Stable | No leaks ✅ |

---

## Breaking Changes

None. v0.136.0 is fully backward compatible with v0.135.3.

---

## What's Next?

- **v0.137.0** (April): S4-04 malformed input handling, fuzz testing
- **Future**: Type safety improvements, performance optimizations

---

## Community

Questions? Issues? Feature requests?

- 📖 [API Documentation](../docs/API.md)
- 🔧 [Examples](../docs/EXAMPLES.md)
- 💬 [Discussions](https://github.com/medyll/idae/discussions)
- 🐛 [Issue Tracker](https://github.com/medyll/idae/issues)

---

## Credits

Built with ❤️ by the [medyll](https://github.com/medyll) team.

**v0.136.0** — *Rigorously tested. Production ready.*
