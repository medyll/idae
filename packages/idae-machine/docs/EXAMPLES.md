# idae-machine Usage Examples

Quick-start examples for common validation scenarios.

---

## Installation & Setup

```bash
npm install @medyll/idae-machine
```

```typescript
import { MachineSchemeValidate } from '@medyll/idae-machine';

const validator = new MachineSchemeValidate('collection-name', machineDb);
```

---

## Basic Field Validation

### Example 1: Email Format

```typescript
validator.registerCustom('email', (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val)));

const result = await validator.validateField('email', 'user@example.com');
console.log(result); // { isValid: true }
```

### Example 2: Password Strength

```typescript
validator.registerCustom('password', (val) => {
	const str = String(val);
	return str.length >= 8 && /[A-Z]/.test(str) && /[a-z]/.test(str) && /[0-9]/.test(str);
});

const result = await validator.validateField('password', 'Weak123');
// { isValid: false, error: "..." }

const result = await validator.validateField('password', 'StrongPass123');
// { isValid: true }
```

### Example 3: Number Range

```typescript
validator.registerCustom('age', (val) => {
	const num = Number(val);
	return num >= 0 && num <= 150;
});

await validator.validateField('age', 25); // Valid
await validator.validateField('age', 200); // Invalid
```

---

## Async Validators

### Example 4: Username Availability (API Check)

```typescript
validator.registerAsync('username', async (val) => {
	const response = await fetch(`/api/check-username?name=${val}`);
	if (!response.ok) return true; // Allow if API fails
	const data = await response.json();
	return data.available;
});

// During form submission, this will call the API
const result = await validator.validateField('username', 'johndoe');
```

### Example 5: Email Uniqueness (Database Check)

```typescript
validator.registerAsync('email', async (val) => {
	try {
		const response = await fetch('/api/check-email', {
			method: 'POST',
			body:   JSON.stringify({ email: val })
		});
		const { unique } = await response.json();
		return unique;
	} catch (error) {
		console.error('API error:', error);
		return true; // Graceful fallback
	}
});
```

---

## Cross-Field Validation

### Example 6: Password Confirmation

```typescript
validator.registerCrossField({
	fields:    ['password', 'passwordConfirm'],
	validator: (data) => data.password === data.passwordConfirm
});

const validForm = {
	password:        'SecurePass123',
	passwordConfirm: 'SecurePass123'
};

const invalidForm = {
	password:        'SecurePass123',
	passwordConfirm: 'Different123'
};

await validator.validateForm(validForm);
// { isValid: true, errors: {}, invalidFields: [] }

await validator.validateForm(invalidForm);
// { isValid: false, errors: { __form: "..." }, ... }
```

### Example 7: Date Range

```typescript
validator.registerCrossField({
	fields:    ['checkIn', 'checkOut'],
	validator: (data) => new Date(data.checkOut) > new Date(data.checkIn)
});

const booking = {
	checkIn:  '2026-03-20',
	checkOut: '2026-03-25'
};

await validator.validateForm(booking);
// { isValid: true, ... }
```

### Example 8: Conditional Requirement

```typescript
// ZIP code required only for US addresses
validator.registerCrossField({
	fields:    ['country', 'zipCode'],
	validator: (data) => {
		if (data.country === 'US') {
			return Boolean(data.zipCode && String(data.zipCode).length > 0);
		}
		return true; // ZIP not required for other countries
	}
});

const usAddress = { country: 'US', zipCode: '12345' };
const frAddress = { country: 'FR', zipCode: '' };

await validator.validateForm(usAddress); // Valid
await validator.validateForm(frAddress); // Valid
```

---

## Complete Registration Form

```typescript
// Setup validator
const validator = new MachineSchemeValidate('users', machineDb);

// 1. Email format
validator.registerCustom('email', (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val)));

// 2. Password strength
validator.registerCustom('password', (val) => {
	const str = String(val);
	return str.length >= 8 && /[A-Z]/.test(str) && /[0-9]/.test(str);
});

// 3. Username availability (async)
validator.registerAsync('username', async (val) => {
	const res = await fetch(`/api/users/check-username?name=${val}`);
	return (await res.json()).available;
});

// 4. Password matching
validator.registerCrossField({
	fields:    ['password', 'passwordConfirm'],
	validator: (data) => data.password === data.passwordConfirm
});

// Validate registration form
const formData = {
	username:        'newuser',
	email:           'newuser@example.com',
	password:        'SecurePass123',
	passwordConfirm: 'SecurePass123'
};

const result = await validator.validateForm(formData);

if (result.isValid) {
	// Submit to API
	await fetch('/api/users/register', {
		method: 'POST',
		body:   JSON.stringify(formData)
	});
} else {
	// Display errors
	console.error('Validation errors:');
	result.invalidFields.forEach((field) => {
		console.error(`  ${field}: ${result.errors[field]}`);
	});
}
```

---

## Form Component Integration (Svelte)

```svelte
<script>
  import { CreateUpdate } from '@medyll/idae-machine';
  import { MachineSchemeValidate } from '@medyll/idae-machine';

  let formData = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    country: '',
    zipCode: ''
  };

  const validator = new MachineSchemeValidate('users', machineDb);

  // Setup validators
  validator.registerCustom('email', (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val))
  );

  validator.registerAsync('username', async (val) => {
    const res = await fetch(`/api/check?name=${val}`);
    return (await res.json()).available;
  });

  validator.registerCrossField({
    fields: ['password', 'passwordConfirm'],
    validator: (data) => data.password === data.passwordConfirm
  });

  async function handleSubmit(event) {
    const result = await validator.validateForm(event.detail);

    if (result.isValid) {
      // Save user
      console.log('Saving:', event.detail);
    } else {
      // Show errors
      console.error('Form errors:', result.errors);
    }
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

## Error Handling

```typescript
async function validateAndHandle(fieldName, value) {
	const result = await validator.validateField(fieldName, value);

	if (!result.isValid) {
		// Handle validation error
		showError(fieldName, result.error);
		return false;
	}

	clearError(fieldName);
	return true;
}

async function submitForm(data) {
	const result = await validator.validateForm(data);

	if (!result.isValid) {
		// Handle form-level errors
		result.invalidFields.forEach((field) => {
			showFieldError(field, result.errors[field]);
		});
		return false;
	}

	// Form is valid, proceed with submission
	return true;
}
```

---

## Advanced: Custom Validation Messages

```typescript
function registerEmailValidator(validator) {
	validator.registerCustom('email', (val) => {
		const email = String(val);

		// Basic format check
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return false;
		}

		// Block disposable email domains
		const disposableDomains = ['tempmail.com', 'throwaway.email'];
		const domain = email.split('@')[1];
		if (disposableDomains.includes(domain)) {
			return false;
		}

		return true;
	});
}

function registerPasswordValidator(validator) {
	validator.registerCustom('password', (val) => {
		const pwd = String(val);

		// Length check
		if (pwd.length < 12) {
			return false;
		}

		// Complexity check
		const hasUpper = /[A-Z]/.test(pwd);
		const hasLower = /[a-z]/.test(pwd);
		const hasNumber = /[0-9]/.test(pwd);
		const hasSpecial = /[!@#$%^&*]/.test(pwd);

		return hasUpper && hasLower && hasNumber && hasSpecial;
	});
}
```

---

## Performance Tips

1. **Debounce async validators** to reduce API calls:

   ```typescript
   const debounce = (fn, ms) => {
   	let timeout;
   	return (...args) => {
   		clearTimeout(timeout);
   		return new Promise((resolve) => {
   			timeout = setTimeout(() => resolve(fn(...args)), ms);
   		});
   	};
   };

   const debouncedCheck = debounce(async (val) => {
   	const res = await fetch(`/api/check?name=${val}`);
   	return (await res.json()).available;
   }, 300);

   validator.registerAsync('username', debouncedCheck);
   ```

2. **Cache validation results** for expensive checks:

   ```typescript
   const cache = new Map();
   validator.registerAsync('email', async (val) => {
   	if (cache.has(val)) return cache.get(val);
   	const result = await checkEmail(val);
   	cache.set(val, result);
   	return result;
   });
   ```

3. **Validate on blur** instead of keystroke:
   ```typescript
   <input
     name="email"
     on:blur={() => validateField('email', formData.email)}
   />
   ```

---

## See Also

- [API Reference](./API.md)
- [Performance Report](../artifacts/performance-2026-03-12.md)
- [Compatibility Matrix](../artifacts/compatibility-2026-03-12.md)
