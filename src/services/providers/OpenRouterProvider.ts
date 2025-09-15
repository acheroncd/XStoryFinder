import OpenAI from 'openai';
import { BaseAIProvider, AIProviderConfig, AnalysisRequest } from './BaseAIProvider';

export class OpenRouterProvider extends BaseAIProvider {
  private client: OpenAI;

  constructor(config: AIProviderConfig) {
    super(config);
    this.validateConfig();
    this.client = new OpenAI({
      baseURL: config.baseURL || 'https://openrouter.ai/api/v1',
      apiKey: config.apiKey,
      defaultHeaders: {
        'HTTP-Referer': 'https://github.com/acheroncd/XStoryFinder',
        'X-Title': 'XStoryFinder'
      }
    });
  }

  getName(): string {
    return 'OpenRouter';
  }

  getDefaultModel(): string {
    return 'anthropic/claude-3.5-sonnet';
  }

  getSupportedModels(): string[] {
    return [
      // Anthropic Claude models
      'anthropic/claude-3.5-sonnet',
      'anthropic/claude-3-opus',
      'anthropic/claude-3-sonnet',
      'anthropic/claude-3-haiku',
      
      // OpenAI models
      'openai/gpt-4o',
      'openai/gpt-4o-mini',
      'openai/gpt-4-turbo',
      'openai/gpt-3.5-turbo',
      
      // Google models
      'google/gemini-pro-1.5',
      'google/gemini-flash-1.5',
      
      // Meta models
      'meta-llama/llama-3.1-405b-instruct',
      'meta-llama/llama-3.1-70b-instruct',
      'meta-llama/llama-3.1-8b-instruct',
      
      // Mistral models
      'mistralai/mistral-large',
      'mistralai/mistral-medium',
      'mistralai/mistral-small',
      
      // Other popular models
      'cohere/command-r-plus',
      'perplexity/llama-3.1-sonar-large-128k-online',
      'qwen/qwen-2-72b-instruct'
    ];
  }

  async analyzeTweets(request: AnalysisRequest): Promise<string> {
    try {
      const model = this.config.model || this.getDefaultModel();
      const prompt = this.createAnalysisPrompt(
        request.tweets, 
        request.keyword, 
        request.options?.analysisType || 'default'
      );
      
      if (request.options?.verbose) {
        console.log(`   🤖 Using ${this.getName()} model: ${model}`);
      }
      
      const completion = await this.client.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens || 2000,
        temperature: this.config.temperature || 0.7,
      });

      const text = completion.choices[0]?.message?.content;
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from OpenRouter model');
      }
      
      return text;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown): void {
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new Error('OpenRouter API authentication failed. Please check your OPENROUTER_API_KEY.');
      } else if (error.message.includes('429')) {
        throw new Error('OpenRouter API rate limit exceeded. Please try again later.');
      } else if (error.message.includes('insufficient_quota')) {
        throw new Error('OpenRouter API quota exceeded. Please check your credits or billing.');
      } else if (error.message.includes('model_not_found')) {
        throw new Error(`OpenRouter model not found. Please check if the model "${this.config.model}" is available.`);
      }
      throw new Error(`OpenRouter AI error: ${error.message}`);
    }
  }
}