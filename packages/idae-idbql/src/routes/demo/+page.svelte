

<script module lang="ts">
import type { IdbqModel } from '$lib/idbqlCore/types.js';

export type Client = {
  id?: number;
  name: string;
  email: string;
};

export type Note = {
  id?: number;
  clientId: number;
  content: string;
  date: Date;
};
</script>

<script lang="ts">
//import { state, derived, effect } from 'svelte/runes';
import { createIdbqDb } from '$lib/idbqlCore/idbqlCore.js';

const demoModel: IdbqModel = {
  clients: {
    keyPath: '++id',
    ts:      {} as Client,
    model:   {},
    template: {
      index:        '',
      presentation: '',
      fields:       {},
      fks:          {}
    }
  },
  notes: {
    keyPath: '++id, clientId',
    ts:      {} as Note,
    model:   {},
    template: {
      index:        '',
      presentation: '',
      fields:       {},
      fks:          {}
    }
  }
} as const;

const db = createIdbqDb(demoModel, 4);
const { idbql, idbqlState } = db.create('demo-db');

// --- FAKES ---
const fakeClients = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
];
const fakeNotes = [
  { clientId: 1, content: 'Premier contact', date: new Date() },
  { clientId: 2, content: 'Appel téléphonique', date: new Date() },
];

onMount(() => {
  (async () => {
    // Clean DB for demo
    if (typeof window === 'undefined' || !idbql.clients || !idbql.notes) return;
    for (const c of await idbql.clients.getAll()) await idbql.clients.delete(c.id);
    for (const n of await idbql.notes.getAll()) await idbql.notes.delete(n.id);
    for (const c of fakeClients) await idbql.clients.put(c);
    for (const n of fakeNotes) await idbql.notes.put(n);
  })();
});

let selectedClientId = $state(1);
let newClient = $state({ name: '', email: '' });
let newNote = $state({ content: '', date: '' });

const allClients = $derived(() => {
  if (typeof window === 'undefined') return [];
  return idbqlState.clients.getAll();
});
const clientNotes = $derived(() => {
  if (typeof window === 'undefined') return [];
  return idbqlState.notes.getAll().filter((n: Note) => n.clientId === selectedClientId);
});

async function addClient() {
  if (!newClient.name || !newClient.email) return;
  await idbqlState.clients.put({ name: newClient.name, email: newClient.email });
  newClient.name = '';
  newClient.email = '';
}
async function deleteClient(id: number) {
  await idbqlState.clients.delete(id);
  if (selectedClientId === id) selectedClientId = 0;
}
async function addNote() {
  if (!newNote.content || !selectedClientId) return;
  await idbqlState.notes.put({ clientId: selectedClientId, content: newNote.content, date: new Date() });
  newNote.content = '';
}
async function deleteNote(id: number) {
  await idbqlState.notes.delete(id);
}
import { onMount } from 'svelte';

let timerActive = $state(false);
let timerCount = $state(0);

onMount(() => {
  // Test de réactivité : ajoute un client toutes les 2s, 3 fois
  timerActive = true;
  let count = 0;
  const interval = setInterval(async () => {
    count++;
    timerCount = count;
    await idbqlState.clients.put({ name: `TimerClient${count}`, email: `timer${count}@demo.com` });
    if (count >= 3) {
      clearInterval(interval);
      timerActive = false;
    }
  }, 2000);
  return () => clearInterval(interval);
});
</script>

  if (!idbqlState.clients || typeof idbqlState.clients.getAll !== 'function') return [];

<h1>Demo IDAE-IDBQL Svelte 5</h1>

<section style="background:#ffe;padding:0.5em 1em;margin-bottom:1em">
  <strong>Test de réactivité automatique :</strong>
  <span>
    {#if timerActive}
      Ajout automatique de clients toutes les 2s… ({timerCount}/3)
    {:else}
      Test terminé. Les clients ajoutés par timer doivent apparaître ci-dessous sans reload.
    {/if}
  </span>
</section>

  if (!idbqlState.notes || typeof idbqlState.notes.getAll !== 'function') return [];
<section>
  <h2>Clients (réactif)</h2>
  <ul>
    {#each allClients() as client}
      <li>
        <strong>{client.name}</strong> ({client.email})
        <button onclick={() => deleteClient(client.id!)}>Supprimer</button>
        <button onclick={() => selectedClientId = client.id!} disabled={selectedClientId === client.id}>
          Voir notes
        </button>
      </li>
    {/each}
  </ul>
  <form onsubmit={e => { e.preventDefault(); addClient(); }} style="margin-top:1em">
    <input bind:value={newClient.name} placeholder="Nom du client" required />
    <input bind:value={newClient.email} placeholder="Email" required />
    <button type="submit">Ajouter client</button>
  </form>
</section>

<section style="margin-top:2em">
  <h2>Notes du client sélectionné</h2>
  <ul>
    {#each clientNotes() as note}
      <li>
        <span>{note.content}</span> <em>({note.date && new Date(note.date).toLocaleString()})</em>
        <button onclick={() => deleteNote(note.id!)}>Supprimer</button>
      </li>
    {/each}
  </ul>
  <form onsubmit={e => { e.preventDefault(); addNote(); }} style="margin-top:1em">
    <input bind:value={newNote.content} placeholder="Contenu de la note" required />
    <button type="submit">Ajouter note</button>
  </form>
</section>


