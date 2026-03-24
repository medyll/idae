# Examples (Draft)

Example: Initialize machine

```ts
import { machine } from '$lib/main/machine';
await machine.init({ dbName: 'demo', version: 1, model: testScheme });
await machine.start();
```

See src/lib/demo/testScheme.ts for a full example schema.
