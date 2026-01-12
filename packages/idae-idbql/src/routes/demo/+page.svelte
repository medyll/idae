

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
import { state, derived, effect } from 'svelte';
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

const db = createIdbqDb(demoModel, 1);
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

effect(async () => {
  // Clean DB for demo
  for (const c of await idbql.clients.getAll()) await idbql.clients.delete(c.id);
  for (const n of await idbql.notes.getAll()) await idbql.notes.delete(n.id);
  // Insert fakes
  for (const c of fakeClients) await idbql.clients.put(c);
  for (const n of fakeNotes) await idbql.notes.put(n);
});

let selectedClientId = state(1);
let newClient = state({ name: '', email: '' });
let newNote = state({ content: '', date: '' });

const allClients = derived(() => idbqlState.clients.getAll());
const clientNotes = derived(() => idbqlState.notes.getAll().filter((n: Note) => n.clientId === selectedClientId));

async function addClient() {
  if (!newClient.name || !newClient.email) return;
  await idbql.clients.put({ name: newClient.name, email: newClient.email });
  newClient.name = '';
  newClient.email = '';
}
async function deleteClient(id: number) {
  await idbql.clients.delete(id);
  if (selectedClientId === id) selectedClientId = 0;
}
async function addNote() {
  if (!newNote.content || !selectedClientId) return;
  await idbql.notes.put({ clientId: selectedClientId, content: newNote.content, date: new Date() });
  newNote.content = '';
}
async function deleteNote(id: number) {
  await idbql.notes.delete(id);
}
</script>


<h1>Demo IDAE-IDBQL Svelte 5</h1>

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


