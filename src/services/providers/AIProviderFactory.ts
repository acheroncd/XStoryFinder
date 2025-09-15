import { BaseAIProvider, AIProviderConfig } from './BaseAIProvider';
import { GeminiProvider } from './GeminiProvider';
import { OpenRouterProvider } from './OpenRouterProvider';

export type ProviderType = 'gemini' | 'openrouter';

export interface ProviderConfiguration {
  provider: ProviderType;
  apiKey: string;
  model?: string | undefined;
  baseURL?: string | undefined;
  maxTokens?: number | undefined;
  temperature?: number | undefined;
}

export class AIProviderFactory {
  static createProvider(config: ProviderConfiguration): BaseAIProvider {
    const providerConfig: AIProviderConfig = {
      apiKey: config.apiKey,
      model: config.model,
      baseURL: config.baseURL,
      maxTokens: config.maxTokens,
      temperature: config.temperature
    };

    switch (config.provider) {
      case 'gemini':
        return new GeminiProvider(providerConfig);
      case 'openrouter':
        return new OpenRouterProvider(providerConfig);
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
  }

  static getSupportedProviders(): ProviderType[] {
    return ['gemini', 'openrouter'];
  }

  static getProviderInfo(): Record<ProviderType, { name: string; description: string; defaultModel: string }> {
    return {
      gemini: {
        name: 'Google Gemini',
        description: 'Google\'s advanced AI model with strong reasoning capabilities',
        defaultModel: 'gemini-1.5-flash'
      },
      openrouter: {
        name: 'OpenRouter',
        description: 'Access to multiple AI models including Claude, GPT-4, Llama, and more',
        defaultModel: 'anthropic/claude-3.5-sonnet'
      }
    };
  }

  static validateProviderConfig(config: ProviderConfiguration): void {
    if (!config.provider) {
      throw new Error('Provider type is required');
    }

    if (!this.getSupportedProviders().includes(config.provider)) {
      throw new Error(`Unsupported provider: ${config.provider}. Supported providers: ${this.getSupportedProviders().join(', ')}`);
    }

    if (!config.apiKey) {
      throw new Error(`API key is required for ${config.provider} provider`);
    }
  }
}