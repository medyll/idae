<!--
AiChatSession.svelte
AI chat session frame - thin shell around DataList + DataField
@role ai-chat-session-frame
@prop {string} collection - Collection name (ai_chat_session)
@prop {number} collectionId - Session ID
-->
<script lang="ts">
    import { machine } from '$lib/main/machine.js';
    import DataList from '$lib/data-ui/data/DataList.svelte';
    import DataRecord from '$lib/data-ui/data/DataRecord.svelte';
    import InputAiPrompt from '$lib/data-ui/input/InputAiPrompt.svelte';

    let { collection, collectionId }: { collection: string; collectionId: number } = $props();

    // Session record — reactive (records getter, never flatten — invariant 10)
    const sessionStore = $derived(machine.store('ai_chat_session', { id: collectionId }));
    const session = $derived(sessionStore.records[0]);
</script>

<ai-chat-session-frame>
    {#if session}
        <!-- Message list = DataList, ordered by base dateCreated, filtered by FK code -->
        <DataList
            collection="ai_message"
            where={{ ai_chat_session: session.code }}
            sortBy={{ field: 'dateCreated', direction: 'asc' }}
            infiniteScroll
        >
            {#snippet item({ record })}
                {@const msg = record as Record<string, any>}
                <ai-chat-session-message data-role={msg.role} data-status={msg.ai_message_status}>
                    <DataRecord collection="ai_message" data={msg} mode="show" showFields={['content']} showLabel={false} />

                    {#if msg.role === 'tool' && msg.ai_tool_call}
                        <!-- Tool-execution log (S45-00 ai_tool_call) — status-driven styling via data-status -->
                        <ai-chat-session-message-tool>
                            <DataList collection="ai_tool_call" where={{ code: msg.ai_tool_call }} infiniteScroll={false} />
                        </ai-chat-session-message-tool>
                    {/if}
                </ai-chat-session-message>
            {/snippet}
        </DataList>

        <!-- Input bar — owns AbortController + create-user/create-assistant/stream orchestration -->
        <InputAiPrompt session={{ id: session.id as number, code: session.code as string }} />
    {/if}
</ai-chat-session-frame>

<style>
    @layer components {
        :global(ai-chat-session-frame) {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
        }

        :global(ai-chat-session-message) {
            display: flex;
            flex-direction: column;
            gap: var(--space-1, 0.25rem);
            padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
            border-radius: var(--radius-2, 0.5rem);
        }

        :global(ai-chat-session-message[data-role='user']) {
            align-self: flex-end;
            background: var(--color-surface-accent, #e8f0fe);
        }

        :global(ai-chat-session-message[data-role='assistant']) {
            align-self: flex-start;
            background: var(--color-surface-2, #f3f3f3);
        }

        :global(ai-chat-session-message[data-role='tool']) {
            align-self: flex-start;
            background: var(--color-surface-3, #f9f6e8);
            font-size: var(--font-size-sm, 0.85rem);
        }

        :global(ai-chat-session-message[data-status='streaming']) {
            opacity: 0.7;
        }

        :global(ai-chat-session-message[data-status='error']) {
            border: 1px solid var(--color-danger, #e53e3e);
        }

        :global(ai-chat-session-message-tool) {
            display: block;
            margin-top: var(--space-1, 0.25rem);
        }
    }
</style>