import { AIProviderFactory, ProviderConfiguration, ProviderType } from './providers/AIProviderFactory';
import { BaseAIProvider } from './providers/BaseAIProvider';
import { Tweet } from '../types';

export type AnalysisType = 'default' | 'sentiment' | 'trends' | 'competitive' | 'filter';

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

  async filterTweets(tweets: Tweet[]): Promise<Tweet[]> {
    try {
      console.log(`   🤖 Sending request to ${this.provider.getName()} AI for filtering...`);
      
      const result = await this.provider.analyzeTweets({
        tweets,
        keyword: '', // Keyword is not needed for filtering
        options: {
          verbose: false,
          analysisType: 'filter'
        }
      });

      const jsonResult = JSON.parse(result);
      return jsonResult.relevant_tweets || [];
    } catch (error) {
      if (error instanceof Error) {
        console.error(`AI Filtering error: ${error.message}`);
        // In case of error, return original tweets to not block the process
        return tweets;
      }
      return tweets;
    }
  }

  async analyzeTweets(tweets: Tweet[], keyword: string, options: AnalyzerOptions = {}): Promise<string> {
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
      maxTokens: 4000,
      temperature: 0.5
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
export const analyzeTweets = async (tweets: Tweet[], keyword: string, options: AnalyzerOptions = {}): Promise<string> => {
  const analyzer = new AIAnalyzer(options);
  return analyzer.analyzeTweets(tweets, keyword, options);
};