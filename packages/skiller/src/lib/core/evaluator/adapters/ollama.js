import { BaseAdapter } from './base.js';

/**
 * Ollama local LLM adapter
 */
export class OllamaAdapter extends BaseAdapter {
  constructor(config = {}) {
    super(config);
    this.name = config.name || 'ollama';
    this.model = config.model || 'qwen2.5:7b';
    this.endpoint = process.env.OLLAMA_HOST || config.endpoint || 'http://localhost:11434';
  }

  isReady() {
    return true; // Ollama is local, no API key needed
  }

  async send(systemPrompt, userPrompt, options = {}) {
    const response = await fetch(`${this.endpoint}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
        options: {
          num_predict: options.maxTokens || 4096
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.message?.content || '';
  }
}
