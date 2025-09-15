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
  } | undefined;
}

export abstract class BaseAIProvider {
  protected config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
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

  protected createAnalysisPrompt(tweets: string[], keyword: string): string {
    return `You are an expert social media trend analyst. Please analyze the following collection of tweets about "${keyword}".

Please provide a comprehensive analysis with the following sections:

🎯 **KEY THEMES**
Identify the main discussion themes and topics (3-5 key themes)

📊 **SENTIMENT ANALYSIS** 
Analyze the overall sentiment (positive/negative/neutral) with percentages if possible

👥 **KEY INSIGHTS**
Notable patterns, trending opinions, or emerging narratives

📝 **EXECUTIVE SUMMARY**
A concise summary of findings (150-200 words)

Tweet Collection (${tweets.length} tweets):
${tweets.map((tweet, index) => `${index + 1}. ${tweet}`).join('\n')}

Please format your response with clear sections and emojis as shown above.`;
  }
}