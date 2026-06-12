/**
 * Seed AI collections with demo data
 * Catalogs, statuses, models, companions, tags
 */
import type { Connection } from 'mongoose';

interface SeedAiDataOptions {
  org: string;
  mongoUri: string;
  clearFirst?: boolean;
}

export async function seedAiData({ org, mongoUri, clearFirst = true }: SeedAiDataOptions): Promise<void> {
  console.log(`[seedAiData] Seeding AI collections for org=${org}`);
  
  // This would connect to the appropriate database and seed AI collections
  // For now, this is a placeholder implementation
  // The actual implementation would:
  // 1. Connect to the AI database
  // 2. Clear existing data if clearFirst is true
  // 3. Insert catalog records (ai_provider, ai_model, ai_mood, ai_voice, etc.)
  // 4. Insert status records (ai_chat_session_status, ai_message_status, etc.)
  // 5. Insert demo companions
  // 6. Insert demo tags
  // 7. Insert default user prompts
  
  console.log(`[seedAiData] AI seed data implementation pending - collections are ready for use`);
}

// AI catalog data that would be seeded
const AI_CATALOGS = {
  ai_provider: [
    { code: 'ollama', name: 'Ollama', endpoint: 'http://localhost:11434' },
    { code: 'anthropic', name: 'Anthropic', endpoint: 'https://api.anthropic.com' },
  ],
  
  ai_model: [
    { code: 'llama3', name: 'Llama 3', fks: { ai_provider: 'ollama' }, supports_tools: false },
    { code: 'mistral', name: 'Mistral', fks: { ai_provider: 'ollama' }, supports_tools: false },
    { code: 'claude-3-haiku', name: 'Claude 3 Haiku', fks: { ai_provider: 'anthropic' }, supports_tools: true },
  ],
  
  ai_chat_session_status: [
    { code: 'idle', name: 'Idle', order: 10 },
    { code: 'streaming', name: 'Streaming', order: 20 },
    { code: 'done', name: 'Done', order: 30 },
    { code: 'error', name: 'Error', order: 40 },
  ],
  
  ai_message_status: [
    { code: 'streaming', name: 'Streaming', order: 10 },
    { code: 'done', name: 'Done', order: 20 },
    { code: 'error', name: 'Error', order: 30 },
  ],
  
  ai_tool_call_status: [
    { code: 'pending', name: 'Pending', order: 10 },
    { code: 'running', name: 'Running', order: 20 },
    { code: 'done', name: 'Done', order: 30 },
    { code: 'error', name: 'Error', order: 40 },
    { code: 'cancelled', name: 'Cancelled', order: 50 },
  ],

  // Phase 1b/2b agent tool surface (AgentRouter buildTools, §12-13). hitl=true
  // gates a tool behind the confirm/cancel resume flow (delete/restore).
  ai_tool: [
    { code: 'find', name: 'Find', description: 'Query records in a collection.', hitl: false, order: 10 },
    { code: 'get_by_id', name: 'Get by id', description: 'Get a single record by its id.', hitl: false, order: 20 },
    { code: 'count', name: 'Count', description: 'Count records matching a query.', hitl: false, order: 30 },
    { code: 'distinct', name: 'Distinct', description: 'Distinct values of a field.', hitl: false, order: 40 },
    { code: 'aggregate', name: 'Aggregate', description: 'Run an aggregation pipeline.', hitl: false, order: 50 },
    { code: 'create', name: 'Create', description: 'Insert a new record.', hitl: false, order: 60 },
    { code: 'update_by_id', name: 'Update', description: 'Update a record by id.', hitl: false, order: 70 },
    { code: 'delete_by_id', name: 'Delete', description: 'Soft-delete a record by id.', hitl: true, order: 80 },
    { code: 'restore', name: 'Restore', description: 'Restore a soft-deleted record.', hitl: true, order: 90 },
  ],
};

const AI_DEMO_COMPANIONS = [
  {
    code: 'general-assistant',
    name: 'General Assistant',
    system_prompt: 'You are a helpful AI assistant.',
    fks: { ai_model: 'llama3' },
    is_active: true,
    order: 10,
  },
  {
    code: 'code-expert',
    name: 'Code Expert',
    system_prompt: 'You are an expert programmer who provides clear, concise code examples.',
    fks: { ai_model: 'mistral' },
    is_active: true,
    order: 20,
  },
];

const AI_DEMO_TAGS = [
  { code: 'work', name: 'Work', color: '#4285F4', icon: 'briefcase', order: 10 },
  { code: 'personal', name: 'Personal', color: '#34A853', icon: 'user', order: 20 },
  { code: 'learning', name: 'Learning', color: '#FBBC05', icon: 'graduation-cap', order: 30 },
  { code: 'fun', name: 'Fun', color: '#EA4335', icon: 'gamepad', order: 40 },
];