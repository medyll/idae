<script lang="ts">
import { onMount } from 'svelte';
import { createIdbqDb } from '$lib/idbqlCore/idbqlCore.js';

// --- MODELE ---
const demoModel = {
  users: {
    keyPath: 'id',
    ts: {} as { id: number; name: string; isActive: boolean },
  },
  messages: {
    keyPath: 'id',
    ts: {} as { id: number; userId: number; content: string },
  },
};

const db = createIdbqDb<typeof demoModel>(demoModel, 1);
const { idbql, idbqlState } = db.create('demo-db');

// --- FAKES ---
const fakeUsers = [
  { id: 1, name: 'Alice', isActive: true },
  { id: 2, name: 'Bob', isActive: false },
  { id: 3, name: 'Charlie', isActive: true },
];
const fakeMessages = [
  { id: 1, userId: 1, content: 'Hello from Alice' },
  { id: 2, userId: 2, content: 'Hi from Bob' },
  { id: 3, userId: 3, content: 'Hey from Charlie' },
];

// --- INIT ---
onMount(async () => {
  // Clean DB for demo
  for (const u of await idbql.users.getAll()) await idbql.users.delete(u.id);
  for (const m of await idbql.messages.getAll()) await idbql.messages.delete(m.id);
  // Insert fakes
  for (const u of fakeUsers) await idbql.users.put(u);
  for (const m of fakeMessages) await idbql.messages.put(m);
});

// --- REACTIVITE ---
const activeUsers = $derived(() => idbqlState.users.where({ isActive: true }));
let selectedUserId: number = 1;
const userMessages = $derived(() => idbqlState.messages.where({ userId: selectedUserId }));

// --- FORMULAIRES ---
let newUser = { name: '', isActive: true };
let newMessage = { content: '' };

async function addUser() {
  if (!newUser.name) return;
  const id = Date.now();
  await idbql.users.put({ id, ...newUser });
  newUser = { name: '', isActive: true };
}
async function toggleActive(id: number, isActive: boolean) {
  await idbql.users.put({ id, isActive: !isActive });
}
async function deleteUser(id: number) {
  await idbql.users.delete(id);
  if (selectedUserId === id) selectedUserId = 0;
}
async function addMessage() {
  if (!newMessage.content || !selectedUserId) return;
  const id = Date.now();
  await idbql.messages.put({ id, userId: selectedUserId, content: newMessage.content });
  newMessage = { content: '' };
}
async function deleteMessage(id: number) {
  await idbql.messages.delete(id);
}
</script>

<h1>Demo IDAE-IDBQL Svelte 5</h1>

<section>
  <h2>Utilisateurs actifs (réactif)</h2>
  <ul>
    {#each $activeUsers as user}
      <li>
        <strong>{user.name}</strong>
        <button on:click={() => toggleActive(user.id, user.isActive)}>
          {user.isActive ? 'Désactiver' : 'Activer'}
        </button>
        <button on:click={() => deleteUser(user.id)}>Supprimer</button>
        <button on:click={() => selectedUserId = user.id} disabled={selectedUserId === user.id}>
          Voir messages
        </button>
      </li>
    {/each}
  </ul>
  <form on:submit|preventDefault={addUser} style="margin-top:1em">
    <input bind:value={newUser.name} placeholder="Nom" required />
    <label><input type="checkbox" bind:checked={newUser.isActive}/> Actif</label>
    <button type="submit">Ajouter utilisateur</button>
  </form>
</section>

<section style="margin-top:2em">
  <h2>Messages de l'utilisateur sélectionné (réactif)</h2>
  <select bind:value={selectedUserId}>
    <option value={0}>-- Choisir un utilisateur --</option>
    {#each $activeUsers as user}
      <option value={user.id}>{user.name}</option>
    {/each}
  </select>
  <ul>
    {#each $userMessages as msg}
      <li>
        {msg.content}
        <button on:click={() => deleteMessage(msg.id)}>Supprimer</button>
      </li>
    {/each}
  </ul>
  <form on:submit|preventDefault={addMessage} style="margin-top:1em">
    <input bind:value={newMessage.content} placeholder="Nouveau message" required />
    <button type="submit" disabled={!selectedUserId}>Envoyer</button>
  </form>
</section>

<style>
  h1 { margin-bottom: 1.5em; }
  section { border: 1px solid #ccc; padding: 1em; border-radius: 8px; }
  ul { list-style: none; padding: 0; }
  li { margin-bottom: 0.5em; }
  button { margin-left: 0.5em; }
  form input { margin-right: 0.5em; }
</style>
