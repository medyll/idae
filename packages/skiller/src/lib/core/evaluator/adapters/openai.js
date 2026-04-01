import { BaseAdapter } from './base.js';

/**
 * OpenAI-compatible API adapter
 */
export class OpenAIAdapter extends BaseAdapter {
  constructor(config = {}) {
    super(config);
    this.name = config.name || 'openai';
    this.model = config.model || 'gpt-4o';
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = process.env.OPENAI_BASE_URL || config.endpoint || 'https://api.openai.com/v1';
  }

  isReady() {
    return !!this.apiKey;
  }

  async send(systemPrompt, userPrompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: options.maxTokens || 4096
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
}
