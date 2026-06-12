<!--
InputAiPrompt.svelte
AI chat input field type — textarea + send/abort buttons
@role ai-prompt-field
@prop {object} session - Chat session record (id, code)
@prop {string} bind:value - Input text
@prop {boolean} disabled - Disable input
-->
<script lang="ts">
    import { machine } from '$lib/main/machine.js';
    import { streamIntoRecord } from '$lib/ai/streamIntoRecord.js';
    import { generateCode } from '$lib/utils/generateCode.js';

    let { session, value = '' }: { session: { id: number; code: string }; value?: string } = $props();
    let abort: AbortController | null = $state(null);
    const streaming = $derived(!!abort);

    async function submit() {
        const content = value.trim();
        if (!content || streaming) return;
        
        value = '';
        const col = machine.collection('ai_message');

        // 1. Create user message
        await col.create({
            code: generateCode(),
            ai_chat_session: session.code,
            role: 'user',
            content,
            ai_message_status: 'done'
        });
        
        // 2. Create assistant placeholder
        const asst = await col.create({
            code: generateCode(),
            ai_chat_session: session.code,
            role: 'assistant',
            content: '',
            ai_message_status: 'streaming'
        });
        
        await machine.collection('ai_chat_session').update(session.id, {
            ai_chat_session_status: 'streaming'
        });

        // 3. Stream into the placeholder
        abort = new AbortController();
        try {
            const final = await streamIntoRecord({
                collection: 'ai_message',
                recordId: asst.id,
                field: 'content',
                slug: `ai/chat-session/${session.id}/send`,
                body: { content },
                signal: abort.signal,
            });
            
            await col.update(asst.id, {
                ai_message_status: 'done',
                tokens: countTokens(final)
            });
        } catch (e: any) {
            await col.update(asst.id, {
                ai_message_status: 'error',
                error: e?.message ?? 'stream failed'
            });
        } finally {
            abort = null;
            await machine.collection('ai_chat_session').update(session.id, {
                ai_chat_session_status: 'idle'
            });
        }
    }

    function onKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    }

    // Simple token counter (approximation)
    function countTokens(text: string): number {
        return Math.ceil(text.length / 4);
    }
</script>

<ai-prompt>
    <textarea
        bind:value
        onkeydown={onKeydown}
        placeholder="Message…"
        rows="1"
        disabled={streaming}
    ></textarea>
    
    {#if streaming}
        <button onclick={() => abort?.abort()}>Stop</button>
    {:else}
        <button onclick={submit} disabled={!value.trim()}>Send</button>
    {/if}
</ai-prompt>

<style>
    @layer components {
        :global(ai-prompt) {
            display: flex;
            gap: var(--space-2);
            width: 100%;
            align-items: flex-end;
        }
        
        :global(ai-prompt textarea) {
            flex: 1;
            resize: none;
            field-sizing: content;
            max-height: 200px;
        }
    }
</style>