# Reactivity

idae-idbql is state-agnostic. Use Svelte 5 runes (`$derived`, `$state`) or idae-stator for reactive updates.

## Svelte 5 Runes Example

```svelte
<script lang="ts">
import { createIdbqDb } from '@medyll/idae-idbql';

const { idbql } = createIdbqDb(model, 1).create('my_app_db');

let adults = $derived(idbql.users.where({ age: { $gte: 18 } }));
</script>

{#each adults.value as user}
	<p>{user.name}</p>
{/each}
```

## idae-stator Example

```typescript
import { createIdbqDb } from '@medyll/idae-idbql';

const { idbql } = createIdbqDb(model, 1, { engine: 'stator' }).create('my_app_db');

const query = idbql.users.where({ role: 'admin' });
query.onchange((oldValue, newValue) => {
	console.log('Data updated:', newValue);
});
```