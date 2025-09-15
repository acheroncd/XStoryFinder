import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAIProvider, AIProviderConfig, AnalysisRequest } from './BaseAIProvider';

export class GeminiProvider extends BaseAIProvider {
  private client: GoogleGenerativeAI;

  constructor(config: AIProviderConfig) {
    super(config);
    this.validateConfig();
    this.client = new GoogleGenerativeAI(config.apiKey);
  }

  getName(): string {
    return 'Gemini';
  }

  getDefaultModel(): string {
    return 'gemini-1.5-flash';
  }

  getSupportedModels(): string[] {
    return [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro',
      'gemini-pro-vision'
    ];
  }

  async analyzeTweets(request: AnalysisRequest): Promise<string> {
    try {
      const model = this.client.getGenerativeModel({ 
        model: this.config.model || this.getDefaultModel() 
      });
      
      const prompt = this.createAnalysisPrompt(request.tweets, request.keyword);
      
      if (request.options?.verbose) {
        console.log(`   🤖 Using ${this.getName()} model: ${this.config.model || this.getDefaultModel()}`);
      }
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini model');
      }
      
      return text;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown): void {
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        throw new Error('Gemini API authentication failed. Please check your GEMINI_API_KEY.');
      } else if (error.message.includes('quota')) {
        throw new Error('Gemini API quota exceeded. Please try again later or check your billing.');
      } else if (error.message.includes('SAFETY')) {
        throw new Error('Content was blocked by Gemini safety filters. Try a different keyword.');
      }
      throw new Error(`Gemini AI error: ${error.message}`);
    }
  }
}