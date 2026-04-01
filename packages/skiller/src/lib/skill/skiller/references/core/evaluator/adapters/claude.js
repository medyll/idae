import { BaseAdapter } from './base.js';

/**
 * Anthropic Claude API adapter
 */
export class ClaudeAdapter extends BaseAdapter {
  constructor(config = {}) {
    super(config);
    this.name = config.name || 'claude';
    this.model = config.model || 'claude-sonnet-4-20250514';
    this.apiKey = process.env.ANTHROPIC_API_KEY;
  }

  isReady() {
    return !!this.apiKey;
  }

  async send(systemPrompt, userPrompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options.maxTokens || 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }
}
