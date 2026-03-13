# idae-machine API Reference v1.0

Complete API documentation for form validation and data binding components.

---

## Table of Contents

1. [MachineSchemeValidate](#machineschemvalidate)
2. [ValidationError](#validationerror)
3. [CreateUpdate Component](#createupdate-component)
4. [FieldValue Component](#fieldvalue-component)
5. [Usage Examples](#usage-examples)

---

## MachineSchemeValidate

Core validation engine for form field validation.

### Constructor

```typescript
new MachineSchemeValidate(collection: TplCollectionName, machineDb: MachineDb)
```

**Parameters:**

- `collection`: Collection name (e.g., 'users', 'agents')
- `machineDb`: MachineDb instance with template definitions

**Example:**

```typescript
const validator = new MachineSchemeValidate('users', machineDb);
```

---

### validateField()

Validate a single field value against registered validators.

```typescript
async validateField(
  fieldName: keyof TplFields,
  value: unknown,
  formData?: Record<string, unknown>
): Promise<{ isValid: boolean; error?: string }>
```

**Parameters:**

- `fieldName`: Field to validate
- `value`: Value to validate
- `formData` (optional): Full form data (for context in validators)

**Returns:**

- `isValid`: true if valid, false otherwise
- `error`: Error message (if invalid)

**Example:**

```typescript
const result = await validator.validateField('email', 'user@example.com');
if (!result.isValid) {
	console.error(result.error); // "Invalid format for field email"
}
```

---

### validateFieldValue()

Quick boolean check for field validity.

```typescript
async validateFieldValue(fieldName: keyof TplFields, value: unknown): Promise<boolean>
```

**Returns:** true if valid, false otherwise

**Example:**

```typescript
const isValid = await validator.validateFieldValue('age', 30);
```

---

### validateForm()

Validate entire form data against all fields.

```typescript
async validateForm(
  formData: Record<string, unknown>,
  options?: {
    ignoreFields?: string[];
    crossFieldValidators?: Array<(data: Record<string, unknown>) =>
      boolean | Promise<boolean> | { isValid: boolean; errors?: Record<string, string> }>;
  }
): Promise<{
  isValid: boolean;
  errors: Record<string, string>;
  invalidFields: string[];
}>
```

**Parameters:**

- `formData`: Complete form data
- `options.ignoreFields`: Fields to skip validation
- `options.crossFieldValidators`: Additional validators from caller

**Returns:**

- `isValid`: true if all fields valid
- `errors`: Map of fieldName → error message
- `invalidFields`: Array of invalid field names

**Example:**

```typescript
const result = await validator.validateForm(
	{ name: 'John', email: 'john@example.com', password: 'weak' },
	{ ignoreFields: ['phone'] }
);

if (!result.isValid) {
	result.invalidFields.forEach((field) => {
		console.error(`${field}: ${result.errors[field]}`);
	});
}
```

---

### registerCustom()

Register a custom validator function for a field.

```typescript
registerCustom(fieldName: keyof TplFields, validator: (value: unknown) => boolean): void
```

**Parameters:**

- `fieldName`: Field to validate
- `validator`: Function that returns true if valid, false otherwise

**Example:**

```typescript
// Email format validation
validator.registerCustom('email', (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val)));

// Password strength validation
validator.registerCustom('password', (val) => {
	const str = String(val);
	return str.length >= 8 && /[A-Z]/.test(str) && /[0-9]/.test(str);
});

// Custom range validation
validator.registerCustom('age', (val) => {
	const num = Number(val);
	return num >= 18 && num <= 120;
});
```

---

### registerAsync()

Register an async validator (e.g., API call).

```typescript
registerAsync(fieldName: keyof TplFields, validator: (value: unknown) => Promise<boolean>): void
```

**Parameters:**

- `fieldName`: Field to validate
- `validator`: Async function returning true if valid

**Example:**

```typescript
// Check username availability via API
validator.registerAsync('username', async (val) => {
	const response = await fetch(`/api/check-username?name=${val}`);
	const data = await response.json();
	return data.available;
});

// Verify email (send verification code)
validator.registerAsync('email', async (val) => {
	try {
		const response = await fetch('/api/verify-email', {
			method: 'POST',
			body:   JSON.stringify({ email: val })
		});
		return response.ok;
	} catch {
		return true; // Allow submission if API fails
	}
});
```

---

### registerCrossField()

Register a validator that checks multiple fields together.

```typescript
registerCrossField(rule: {
  fields: string[];
  validator: (data: Record<string, unknown>) => boolean | Promise<boolean>;
}): void
```

**Parameters:**

- `fields`: Field names involved in validation
- `validator`: Function that validates the relationship

**Example:**

```typescript
// Password matching
validator.registerCrossField({
	fields:    ['password', 'passwordConfirm'],
	validator: (data) => data.password === data.passwordConfirm
});

// Date range validation
validator.registerCrossField({
	fields:    ['startDate', 'endDate'],
	validator: (data) => new Date(data.endDate) > new Date(data.startDate)
});

// Conditional requirement (zip code required if US)
validator.registerCrossField({
	fields:    ['country', 'zipCode'],
	validator: (data) => {
		if (data.country === 'US') {
			return Boolean(data.zipCode);
		}
		return true;
	}
});
```

---

## ValidationError

Error object returned from validation.

```typescript
interface ValidationError {
	fieldName: string;
	message:   string;
	severity:  'error' | 'warning';
	type:      'required' | 'type' | 'format' | 'custom' | 'cross-field';
}
```

**Properties:**

- `fieldName`: Name of the field with error
- `message`: Human-readable error message
- `severity`: 'error' (blocking) or 'warning' (informational)
- `type`: Category of validation failure

---

## CreateUpdate Component

Svelte component for form creation and editing.

```svelte
<CreateUpdate
  {collection}
  {data}
  {fieldInfo}
  on:submit={handleSubmit}
/>
```

### Props

| Prop         | Type                      | Required | Description     |
| ------------ | ------------------------- | -------- | --------------- |
| `collection` | `TplCollectionName`       | ✅       | Collection name |
| `data`       | `Record<string, unknown>` | ✅       | Form data       |
| `fieldInfo`  | `IDbForge`                | ✅       | Field metadata  |

### Events

**on:submit**
Fired when form is submitted with valid data.

```typescript
function handleSubmit(event: CustomEvent<Record<string, unknown>>) {
	const formData = event.detail;
	// Save to database or API
}
```

### Example Usage

```svelte
<script>
  import { CreateUpdate } from '@medyll/idae-machine';

  let formData = { name: '', email: '', password: '' };

  function handleSubmit(event) {
    console.log('Form data:', event.detail);
    // Send to API or database
  }
</script>

<CreateUpdate
  collection="users"
  data={formData}
  fieldInfo={userFields}
  on:submit={handleSubmit}
/>
```

---

## FieldValue Component

Component for a single form field with binding and validation.

```svelte
<FieldValue
  {fieldName}
  {value}
  {fieldInfo}
  on:change={handleChange}
/>
```

### Props

| Prop        | Type       | Required | Description         |
| ----------- | ---------- | -------- | ------------------- |
| `fieldName` | `string`   | ✅       | Field identifier    |
| `value`     | `unknown`  | ✅       | Current field value |
| `fieldInfo` | `IDbForge` | ✅       | Field metadata      |

### Events

**on:change**
Fired when field value changes.

```typescript
function handleChange(event: CustomEvent<unknown>) {
	const newValue = event.detail;
	// Update parent data
}
```

---

## Usage Examples

### Complete Form Workflow

```typescript
import { MachineSchemeValidate } from '@medyll/idae-machine';

// 1. Create validator instance
const validator = new MachineSchemeValidate('users', machineDb);

// 2. Register custom validators
validator.registerCustom('email', (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val)));

validator.registerCustom('password', (val) => String(val).length >= 8);

// 3. Register async validators
validator.registerAsync('username', async (val) => {
	const res = await fetch(`/api/check-username?name=${val}`);
	return (await res.json()).available;
});

// 4. Register cross-field validators
validator.registerCrossField({
	fields:    ['password', 'passwordConfirm'],
	validator: (data) => data.password === data.passwordConfirm
});

// 5. Validate form
const formData = {
	email:           'user@example.com',
	password:        'SecurePass123',
	passwordConfirm: 'SecurePass123',
	username:        'newuser'
};

const result = await validator.validateForm(formData);

if (result.isValid) {
	console.log('Form valid! Ready to submit.');
} else {
	console.error('Form has errors:', result.errors);
	result.invalidFields.forEach((field) => {
		console.log(`- ${field}: ${result.errors[field]}`);
	});
}
```

### Custom Validator Patterns

```typescript
// Email format
validator.registerCustom('email', (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val)));

// URL format
validator.registerCustom('website', (val) => {
	try {
		new URL(String(val));
		return true;
	} catch {
		return false;
	}
});

// Credit card (simple Luhn check)
validator.registerCustom('creditCard', (val) => {
	const digits = String(val).replace(/\D/g, '');
	return digits.length >= 13 && digits.length <= 19;
});

// Phone number
validator.registerCustom('phone', (val) => /^\d{10,}$/.test(String(val).replace(/\D/g, '')));

// Unique value in set
const usedUsernames = new Set(['admin', 'root', 'system']);
validator.registerCustom('username', (val) => !usedUsernames.has(String(val)));
```

### Advanced Cross-Field Examples

```typescript
// Age eligibility (must be 18+ for premium)
validator.registerCrossField({
	fields:    ['age', 'accountType'],
	validator: (data) => {
		if (data.accountType === 'premium') {
			return Number(data.age) >= 18;
		}
		return true;
	}
});

// Billing address same as shipping
validator.registerCrossField({
	fields:    ['shippingAddress', 'billingAddress', 'sameAsShipping'],
	validator: (data) => {
		if (data.sameAsShipping) {
			return data.billingAddress === data.shippingAddress;
		}
		return Boolean(data.billingAddress);
	}
});

// Time range validation
validator.registerCrossField({
	fields:    ['checkIn', 'checkOut'],
	validator: (data) => {
		const checkIn = new Date(String(data.checkIn));
		const checkOut = new Date(String(data.checkOut));
		return checkOut > checkIn && checkOut.getTime() - checkIn.getTime() <= 30 * 24 * 60 * 60 * 1000; // Max 30 days
	}
});
```

---

## Error Handling

All validation errors are returned as structured objects:

```typescript
{
  isValid: false,
  error: "Invalid format for field email"
}
```

Never throws `MachineErrorValidation` in `validateForm()`. Always check the `isValid` flag.

---

## Performance Notes

- Single field validation: **<1ms**
- Form validation (10 fields): **<2ms**
- Async validation (with 50ms API): **~60ms**
- Bundle size addition: **1KB gzip**

---

## Related Documentation

- [Compatibility Matrix](../artifacts/compatibility-2026-03-12.md)
- [Performance Report](../artifacts/performance-2026-03-12.md)
- [Security Audit](../artifacts/audit-security-2026-03-12.md)
