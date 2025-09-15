export interface AIProviderConfig {
  apiKey: string;
  model?: string | undefined;
  baseURL?: string | undefined;
  maxTokens?: number | undefined;
  temperature?: number | undefined;
}

export interface AnalysisRequest {
  tweets: string[];
  keyword: string;
  options?: {
    verbose?: boolean | undefined;
    analysisType?: 'default' | 'sentiment' | 'trends' | 'competitive' | undefined;
  } | undefined;
}

import { PromptManager, AnalysisType } from '../PromptManager';

export abstract class BaseAIProvider {
  protected config: AIProviderConfig;
  protected promptManager: PromptManager;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.promptManager = new PromptManager();
  }

  abstract getName(): string;
  abstract getDefaultModel(): string;
  abstract getSupportedModels(): string[];
  abstract analyzeTweets(request: AnalysisRequest): Promise<string>;
  
  protected validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error(`API key is required for ${this.getName()} provider`);
    }
  }

  protected createAnalysisPrompt(
    tweets: string[], 
    keyword: string, 
    analysisType: AnalysisType = 'default'
  ): string {
    return this.promptManager.getPrompt(
      analysisType,
      {
        keyword,
        tweets,
        tweet_count: tweets.length
      },
      this.getName().toLowerCase(),
      this.config.model
    );
  }

  // Legacy method for backward compatibility
  protected createLegacyAnalysisPrompt(tweets: string[], keyword: string): string {
    return this.createAnalysisPrompt(tweets, keyword, 'default');
  }
}