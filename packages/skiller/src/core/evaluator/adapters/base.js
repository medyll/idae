/**
 * Base adapter interface for LLM providers
 * @abstract
 */
export class BaseAdapter {
  /**
   * @param {Object} config - Adapter configuration
   */
  constructor(config = {}) {
    if (new.target === BaseAdapter) {
      throw new Error('BaseAdapter is abstract and cannot be instantiated directly');
    }
    this.config = config;
    this.name = config.name || 'base';
  }

  /**
   * Send a prompt to the LLM and get a response
   * @param {string} systemPrompt - System instructions
   * @param {string} userPrompt - User message
   * @param {Object} options - Additional options
   * @returns {Promise<string>} Model response
   */
  async send(systemPrompt, userPrompt, options = {}) {
    throw new Error('Method "send" must be implemented by subclass');
  }

  /**
   * Validate that the adapter is properly configured
   * @returns {boolean} True if adapter is ready
   */
  isReady() {
    throw new Error('Method "isReady" must be implemented by subclass');
  }

  /**
   * Get adapter metadata
   * @returns {Object} Adapter info
   */
  getMetadata() {
    return {
      name: this.name,
      type: this.constructor.name,
      config: this.config
    };
  }
}
