/**
 * Test for multi-store reactivity consistency (S1-02)
 * 
 * This test verifies that reactive state updates consistently propagate
 * when multiple stores are modified in sequence or in parallel.
 * 
 * Run with: npx vitest run src/lib/collection/collection-multistore.test.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createIdbqDb } from '../idbqlCore/idbqlCore.js';
import { getIdbqlEvent } from '../state/idbqlEvent.svelte.js';
import 'fake-indexeddb/auto';

const idbqModel = {
  users: {
    keyPath: '++id',
    model: {} as any,
  },
  messages: {
    keyPath: '++id',
    model: {} as any,
  },
  chats: {
    keyPath: '++id',
    model: {} as any,
  },
} as const;

describe('CollectionCore - Multi-store Reactivity (S1-02)', () => {
  let idbqStore = createIdbqDb<typeof idbqModel>(idbqModel, 1);
  const { idbql, idbqlState } = idbqStore.create('multistore-test-db');

  beforeEach(async () => {
    // Clear all stores
    for (const store of ['users', 'messages', 'chats'] as const) {
      const items = await idbql[store].getAll();
      for (const item of items as any[]) {
        await idbql[store].delete(item.id);
      }
    }
    // Reset event state
    getIdbqlEvent().dataState = {};
  });

  it('should maintain consistent state after sequential multi-store updates', async () => {
    // Add to users
    const user = await idbql.users.add({ name: 'Alice', email: 'alice@test.com' });
    
    // Add to messages
    const message = await idbql.messages.add({ 
      userId: (user as any).id, 
      text: 'Hello',
      timestamp: Date.now()
    });
    
    // Add to chats
    const chat = await idbql.chats.add({ 
      userId: (user as any).id,
      messageId: (message as any).id,
      title: 'First chat'
    });

    // Verify all stores have consistent reactive state
    const usersState = getIdbqlEvent().dataState['users'];
    const messagesState = getIdbqlEvent().dataState['messages'];
    const chatsState = getIdbqlEvent().dataState['chats'];

    expect(usersState).toHaveLength(1);
    expect(messagesState).toHaveLength(1);
    expect(chatsState).toHaveLength(1);

    // Verify data integrity
    expect(usersState[0].name).toBe('Alice');
    expect(messagesState[0].text).toBe('Hello');
    expect(chatsState[0].title).toBe('First chat');
  });

  it('should handle parallel updates to multiple stores', async () => {
    // Fire off parallel operations to different stores
    const [user1, user2, message1, chat1] = await Promise.all([
      idbql.users.add({ name: 'Bob', email: 'bob@test.com' }),
      idbql.users.add({ name: 'Carol', email: 'carol@test.com' }),
      idbql.messages.add({ userId: 1, text: 'Parallel message', timestamp: Date.now() }),
      idbql.chats.add({ userId: 1, messageId: 1, title: 'Parallel chat' }),
    ]);

    // Verify all stores updated correctly
    const usersState = getIdbqlEvent().dataState['users'];
    const messagesState = getIdbqlEvent().dataState['messages'];
    const chatsState = getIdbqlEvent().dataState['chats'];

    expect(usersState).toHaveLength(2);
    expect(messagesState).toHaveLength(1);
    expect(chatsState).toHaveLength(1);

    expect(usersState.map((u: any) => u.name)).toEqual(expect.arrayContaining(['Bob', 'Carol']));
  });

  it('should maintain consistency when updating same entity across stores', async () => {
    // Create initial data
    const user = await idbql.users.add({ name: 'Dave', email: 'dave@test.com' });
    const userId = (user as any).id;

    await idbql.messages.add({ userId, text: 'Message 1', timestamp: Date.now() });
    await idbql.messages.add({ userId, text: 'Message 2', timestamp: Date.now() });

    // Update user
    await idbql.users.update(userId, { name: 'Dave Updated' });

    // Verify user was updated in reactive state
    const usersState = getIdbqlEvent().dataState['users'];
    const updatedUser = usersState.find((u: any) => u.id === userId);
    
    expect(updatedUser).toBeDefined();
    expect(updatedUser.name).toBe('Dave Updated');
  });

  it('should handle deleteWhere across multiple stores consistently', async () => {
    // Create test data
    await idbql.users.add({ name: 'Eve', email: 'eve@test.com', temp: true });
    await idbql.users.add({ name: 'Frank', email: 'frank@test.com', temp: true });
    await idbql.users.add({ name: 'Grace', email: 'grace@test.com', temp: false });

    await idbql.messages.add({ userId: 1, text: 'Temp message 1', temp: true });
    await idbql.messages.add({ userId: 2, text: 'Temp message 2', temp: true });
    await idbql.messages.add({ userId: 3, text: 'Keep message', temp: false });

    // Delete all temp items from both stores
    await Promise.all([
      idbql.users.deleteWhere({ temp: true }),
      idbql.messages.deleteWhere({ temp: true }),
    ]);

    // Verify correct items remain
    const usersState = getIdbqlEvent().dataState['users'];
    const messagesState = getIdbqlEvent().dataState['messages'];

    expect(usersState).toHaveLength(1);
    expect(usersState[0].name).toBe('Grace');

    expect(messagesState).toHaveLength(1);
    expect(messagesState[0].text).toBe('Keep message');
  });

  it('should handle rapid updateWhere on multiple stores', async () => {
    // Create test data
    await idbql.users.add({ name: 'User1', status: 'pending', category: 'A' });
    await idbql.users.add({ name: 'User2', status: 'pending', category: 'A' });
    await idbql.users.add({ name: 'User3', status: 'pending', category: 'B' });

    await idbql.messages.add({ userId: 1, text: 'Msg1', status: 'pending', category: 'A' });
    await idbql.messages.add({ userId: 2, text: 'Msg2', status: 'pending', category: 'A' });
    await idbql.messages.add({ userId: 3, text: 'Msg3', status: 'pending', category: 'B' });

    // Update all category A items in both stores
    await Promise.all([
      idbql.users.updateWhere({ category: 'A' }, { status: 'approved' }),
      idbql.messages.updateWhere({ category: 'A' }, { status: 'approved' }),
    ]);

    // Verify updates applied correctly
    const usersState = getIdbqlEvent().dataState['users'];
    const messagesState = getIdbqlEvent().dataState['messages'];

    const approvedUsers = usersState.filter((u: any) => u.status === 'approved');
    const approvedMessages = messagesState.filter((m: any) => m.status === 'approved');

    expect(approvedUsers).toHaveLength(2);
    expect(approvedMessages).toHaveLength(2);
  });

  it('should handle batch operations across multiple stores', async () => {
    // Batch add to multiple stores - use CollectionCore directly for batch methods
    const [users, messages] = await Promise.all([
      (idbql.users as any).batchAdd([
        { name: 'Batch1', email: 'b1@test.com' },
        { name: 'Batch2', email: 'b2@test.com' },
        { name: 'Batch3', email: 'b3@test.com' },
      ]),
      (idbql.messages as any).batchAdd([
        { userId: 1, text: 'Batch msg 1' },
        { userId: 2, text: 'Batch msg 2' },
      ]),
    ]);

    expect(users).toHaveLength(3);
    expect(messages).toHaveLength(2);

    // Verify reactive state
    expect(getIdbqlEvent().dataState['users']).toHaveLength(3);
    expect(getIdbqlEvent().dataState['messages']).toHaveLength(2);
  });

  it('should maintain event order for causally related operations', async () => {
    const eventLog: any[] = [];
    
    // Temporarily intercept events
    const originalRegister = getIdbqlEvent().registerEvent.bind(getIdbqlEvent());
    getIdbqlEvent().registerEvent = function(event: any, data: any) {
      eventLog.push({ event, data, timestamp: Date.now() });
      return originalRegister(event, data);
    };

    // Perform causally related operations
    const user = await idbql.users.add({ name: 'Causal', email: 'causal@test.com' });
    const userId = (user as any).id;
    
    await idbql.messages.add({ userId, text: 'Causal message' });
    await idbql.users.update(userId, { lastMessageAt: Date.now() });

    // Verify event order
    expect(eventLog.length).toBeGreaterThanOrEqual(3);
    
    // First event should be user add
    expect(eventLog[0].event).toBe('add');
    expect(eventLog[0].data.collection).toBe('users');
    
    // Second event should be message add
    expect(eventLog[1].event).toBe('add');
    expect(eventLog[1].data.collection).toBe('messages');

    // Restore original
    getIdbqlEvent().registerEvent = originalRegister;
  });

  it('should not lose events under high concurrency', async () => {
    const operations = 50;
    const promises: Promise<any>[] = [];

    for (let i = 0; i < operations; i++) {
      const store = i % 3 === 0 ? 'users' : i % 3 === 1 ? 'messages' : 'chats';
      promises.push(
        idbql[store].add({ 
          name: `item-${i}`, 
          store,
          index: i 
        })
      );
    }

    await Promise.all(promises);

    // Verify all events were processed
    const usersCount = getIdbqlEvent().dataState['users']?.length || 0;
    const messagesCount = getIdbqlEvent().dataState['messages']?.length || 0;
    const chatsCount = getIdbqlEvent().dataState['chats']?.length || 0;

    expect(usersCount + messagesCount + chatsCount).toBe(operations);
  });

  it('should handle mixed read/write operations without race conditions', async () => {
    // Initial data
    await idbql.users.add({ name: 'Reader', email: 'reader@test.com', count: 0 });

    // Mix reads and writes
    const mixedOps = [];
    for (let i = 0; i < 20; i++) {
      if (i % 2 === 0) {
        // Write
        mixedOps.push(idbql.users.add({ name: `User-${i}`, email: `u${i}@test.com` }));
      } else {
        // Read
        mixedOps.push(idbql.users.getAll());
      }
    }

    await Promise.all(mixedOps);

    // Verify final state is consistent
    const usersState = getIdbqlEvent().dataState['users'];
    expect(usersState.length).toBe(11); // 1 initial + 10 adds
  });
});
