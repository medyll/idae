# Custom Operators

You can add custom operators via idae-query and use them in idae-idbql queries.

## Example

```typescript
import { Operators } from '@medyll/idae-query';

Operators.addCustomOperator('isEven', (field, value, data) => data[field] % 2 === 0);

const evenUsers = idbql.users.where({ age: { isEven: true } });
```