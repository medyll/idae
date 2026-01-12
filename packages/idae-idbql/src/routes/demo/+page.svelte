<svelte:options runes />
<script module lang="ts">
import type { IdbqModel } from '$lib/idbqlCore/types.js';

export type Chat = {
  id?:              number;
  chatId?:          string;
  title?:           string;
  models?:          string[];
  created_at?:      Date;
  dateLastMessage?: Date;
  context?:         number[];
};

export type ChatMessage = {
  id?:        string;
  chatId:     string;
  messageId?: string;
  content?:   string;
  images?:    string[];
  status?:    'done' | 'sent' | 'streaming' | 'error';
  context?:   number[];
  model?:     string;
};
</script>
<script lang="ts">
import { onMount } from 'svelte';
import { createIdbqDb } from '$lib/idbqlCore/idbqlCore.js';


const demoModel: IdbqModel = {
  messages: {
    keyPath: '++id, chatId, created_at',
    ts:      {} as ChatMessage,
    model:   {},
    template: {
      index:        '',
      presentation: '',
      fields:       {},
      fks:          {}
    }
  },
  chat:     {
    keyPath:  '&chatId, created_at, dateLastMessage',
    ts:       {} as Chat,
    model:    {},
    template: {
      index:        '',
      presentation: '',
      fields:       {},
      fks:          {}
    }
  }
} as const;

const db = createIdbqDb(demoModel, 3);
const { idbql, idbqlState } = db.create('demo-db');

// --- FAKES ---
const fakeChats = [
  { chatId: '1', title: 'General', created_at: new Date(), dateLastMessage: new Date() },
  { chatId: '2', title: 'Support', created_at: new Date(), dateLastMessage: new Date() },
];
const fakeMessages = [
  { chatId: '1', content: 'Hello from Alice', status: 'done' },
  { chatId: '2', content: 'Hi from Bob', status: 'sent' },
  { chatId: '1', content: 'Hey from Charlie', status: 'streaming' },
];

// --- INIT ---
onMount(async () => {
  // Clean DB for demo
  for (const c of await idbql.chat.getAll()) await idbql.chat.delete(c.chatId);
  for (const m of await idbql.messages.getAll()) await idbql.messages.delete(m.id);
  // Insert fakes
  for (const c of fakeChats) await idbql.chat.put(c);
  for (const m of fakeMessages) await idbql.messages.put(m);
});

// --- REACTIVITE ---
let selectedUserId = $state(1);
let newUser = $state({ name: '', isActive: true });
let newMessage = $state({ content: '' });

const activeUsers = $derived((): Chat[] => idbqlState.chat.getAll().filter((c: Chat) => c.title && c.title.length > 0));
const userMessages = $derived((): ChatMessage[] => idbqlState.messages.getAll().filter((m: ChatMessage) => m.chatId === String(selectedUserId)));

async function addUser() {
  if (!newUser.name) return;
  const chatId = Date.now().toString();
  await idbql.chat.put({ chatId, title: newUser.name, created_at: new Date(), dateLastMessage: new Date() });
  newUser.name = '';
  newUser.isActive = true;
}
async function deleteUser(chatId: string) {
  await idbql.chat.delete(chatId);
  if (String(selectedUserId) === chatId) selectedUserId = 0;
}
async function addMessage() {
  if (!newMessage.content || !selectedUserId) return;
  await idbql.messages.put({ chatId: String(selectedUserId), content: newMessage.content, status: 'done' });
  newMessage.content = '';
}
async function deleteMessage(id: string) {
  await idbql.messages.delete(id);
}
</script>

<h1>Demo IDAE-IDBQL Svelte 5</h1>


<section>
  <h2>Chats (réactif)</h2>
  <ul>
    {#each activeUsers() as chat}
      <li>
        <strong>{(chat as Chat).title}</strong>
        <button onclick={() => deleteUser((chat as Chat).chatId!)}>Supprimer</button>
        <button onclick={() => selectedUserId = Number((chat as Chat).chatId!)} disabled={String(selectedUserId) === (chat as Chat).chatId}>
          Voir messages
        </button>
      </li>
    {/each}
  </ul>
  <form onsubmit={e => { e.preventDefault(); addUser(); }} style="margin-top:1em">
    <input bind:value={newUser.name} placeholder="Nom du chat" required />
    <button type="submit">Ajouter chat</button>
  </form>
</section>

<section style="margin-top:2em">
  <h2>Messages du chat sélectionné (réactif)</h2>
  <select bind:value={selectedUserId}>
    <option value={0}>-- Choisir un chat --</option>
    {#each activeUsers() as chat}
      <option value={(chat as Chat).chatId}>{(chat as Chat).title}</option>
    {/each}
  </select>
  <ul>
    {#each userMessages() as msg}
      <li>
        {(msg as ChatMessage).content}
        <button onclick={() => deleteMessage((msg as ChatMessage).id!)}>Supprimer</button>
      </li>
    {/each}
  </ul>
  <form onsubmit={e => { e.preventDefault(); addMessage(); }} style="margin-top:1em">
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
