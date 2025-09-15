import { AIProviderFactory, ProviderConfiguration, ProviderType } from './providers/AIProviderFactory';
import { BaseAIProvider } from './providers/BaseAIProvider';

export type AnalysisType = 'default' | 'sentiment' | 'trends' | 'competitive';

export interface AnalyzerOptions {
  provider?: ProviderType | undefined;
  model?: string | undefined;
  verbose?: boolean | undefined;
  analysisType?: AnalysisType | undefined;
}

export class AIAnalyzer {
  private provider: BaseAIProvider;

  constructor(options: AnalyzerOptions = {}) {
    const config = this.createProviderConfig(options);
    this.provider = AIProviderFactory.createProvider(config);
  }

  async analyzeTweets(tweets: string[], keyword: string, options: AnalyzerOptions = {}): Promise<string> {
    try {
      console.log(`   🤖 Sending request to ${this.provider.getName()} AI...`);
      
      const result = await this.provider.analyzeTweets({
        tweets,
        keyword,
        options: {
          verbose: options.verbose || undefined,
          analysisType: options.analysisType || undefined
        }
      });

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`AI Analysis error: ${error.message}`);
      }
      throw error;
    }
  }

  getProviderName(): string {
    return this.provider.getName();
  }

  getProviderModel(): string {
    return this.provider.getDefaultModel();
  }

  static getSupportedProviders(): ProviderType[] {
    return AIProviderFactory.getSupportedProviders();
  }

  static getProviderInfo() {
    return AIProviderFactory.getProviderInfo();
  }

  private createProviderConfig(options: AnalyzerOptions): ProviderConfiguration {
    const provider = options.provider || this.getDefaultProvider();
    
    // Get API key based on provider
    const apiKey = this.getApiKeyForProvider(provider);
    
    return {
      provider,
      apiKey,
      model: options.model || undefined,
      maxTokens: 2000,
      temperature: 0.7
    };
  }

  private getDefaultProvider(): ProviderType {
    // Check which provider has API key available
    if (process.env.GEMINI_API_KEY) {
      return 'gemini';
    } else if (process.env.OPENROUTER_API_KEY) {
      return 'openrouter';
    }
    
    // Default to gemini if no keys found (will throw error later)
    return 'gemini';
  }

  private getApiKeyForProvider(provider: ProviderType): string {
    switch (provider) {
      case 'gemini':
        return process.env.GEMINI_API_KEY || '';
      case 'openrouter':
        return process.env.OPENROUTER_API_KEY || '';
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
}

// Backward compatibility function
export const analyzeTweets = async (tweets: string[], keyword: string, options: AnalyzerOptions = {}): Promise<string> => {
  const analyzer = new AIAnalyzer(options);
  return analyzer.analyzeTweets(tweets, keyword, options);
};