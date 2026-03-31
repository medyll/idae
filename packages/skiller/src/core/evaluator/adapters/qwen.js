import { BaseAdapter } from './base.js';

/**
 * Alibaba Qwen/DashScope API adapter
 */
export class QwenAdapter extends BaseAdapter {
  constructor(config = {}) {
    super(config);
    this.name = config.name || 'qwen';
    this.model = config.model || 'qwen-plus';
    this.apiKey = process.env.DASHSCOPE_API_KEY;
  }

  isReady() {
    return !!this.apiKey;
  }

  async send(systemPrompt, userPrompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('DASHSCOPE_API_KEY environment variable is not set');
    }

    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        input: {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        },
        parameters: {
          max_tokens: options.maxTokens || 4096
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Qwen API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.output?.text || '';
  }
}
