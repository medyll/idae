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
    import FieldAiPrompt from '$lib/data-ui/field/snippets/FieldAiPrompt.svelte';

    let { collection, collectionId }: { collection: string; collectionId: number } = $props();

    // Session record — reactive (records getter, never flatten — invariant 10)
    const sessionStore = $derived(machine.store('ai_chat_session', { id: collectionId }));
    const session = $derived(sessionStore.records[0]);

    /**
     * HITL confirm/cancel (CHAT.md §13.4-13.5). Cancel patches ai_tool_call_status
     * to 'cancelled' first; both then POST the confirm route to resume the
     * suspended agent loop. The route persists the resumed turn server-side —
     * sync delivers the updated ai_message/ai_tool_call records to this client.
     */
    async function respondToolCall(session: Record<string, any>, toolCall: Record<string, any>, cancel: boolean) {
        if (cancel) {
            await machine.collection('ai_tool_call').update(toolCall.id, { ai_tool_call_status: 'cancelled' });
        }

        const toolCallId = String(toolCall.code).slice(String(session.code).length + 1);
        const res = await fetch(`/api/ai/agent/${session.code}/confirm/${toolCallId}`, { method: 'POST' });

        const reader = res.body?.getReader();
        while (reader) {
            const { done } = await reader.read();
            if (done) break;
        }
    }
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
            {#snippet dataRecord({ data })}
                {@const msg = data as Record<string, any>}
                <ai-chat-session-message data-role={msg.role} data-status={msg.ai_message_status}>
                    <DataRecord collection="ai_message" data={msg} mode="show" showFields={['content']} showLabel={false} />

                    {#if msg.role === 'tool' && msg.ai_tool_call}
                        <!-- Tool-execution log (S45-00 ai_tool_call) — status-driven styling via data-status -->
                        <ai-chat-session-message-tool>
                            <DataList collection="ai_tool_call" where={{ code: msg.ai_tool_call }} infiniteScroll={false}>
                                {#snippet dataRecord({ data: toolCallData })}
                                    {@const toolCall = toolCallData as Record<string, any>}
                                    <DataRecord
                                        collection="ai_tool_call"
                                        data={toolCall}
                                        mode="show"
                                        showFields={['ai_tool', 'ai_tool_call_status', 'args', 'result', 'error']}
                                        showLabel={false}
                                    />

                                    {#if toolCall.ai_tool_call_status === 'pending' && session}
                                        <!-- HITL confirm/cancel (CHAT.md §13-14) -->
                                        <group-tool-confirm>
                                            <button class="control-tool-confirm" onclick={() => respondToolCall(session!, toolCall, false)}>Confirm</button>
                                            <button class="control-tool-cancel" onclick={() => respondToolCall(session!, toolCall, true)}>Cancel</button>
                                        </group-tool-confirm>
                                    {/if}
                                {/snippet}
                            </DataList>
                        </ai-chat-session-message-tool>
                    {/if}
                </ai-chat-session-message>
            {/snippet}
        </DataList>

        <!-- Input bar — owns AbortController + create-user/create-assistant/stream orchestration -->
        <FieldAiPrompt mode="update" session={{ id: session.id as number, code: session.code as string }} />
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

        :global(group-tool-confirm) {
            display: flex;
            gap: var(--space-2, 0.5rem);
            margin-top: var(--space-1, 0.25rem);
        }

        :global(.control-tool-confirm) {
            color: var(--color-success, #2f9e44);
            border-color: var(--color-success, #2f9e44);
        }

        :global(.control-tool-cancel) {
            color: var(--color-danger, #e53e3e);
            border-color: var(--color-danger, #e53e3e);
        }
    }
</style>