import * as fs from 'fs';
import * as path from 'path';

export type AnalysisType = 'default' | 'sentiment' | 'trends' | 'competitive';

export interface PromptConfig {
  templates: Record<string, string>;
  variables: Record<string, string>;
  settings: {
    max_tweet_length: number;
    max_tweets_display: number;
    include_metadata: boolean;
    format_tweets_numbered: boolean;
  };
  provider_preferences: Record<string, any>;
}

export interface PromptVariables {
  keyword: string;
  tweet_count: number;
  tweets: string[];
  [key: string]: any;
}

export class PromptManager {
  private config!: PromptConfig;
  private templatesPath: string;
  private configPath: string;

  constructor() {
    this.templatesPath = path.join(__dirname, '../prompts/templates');
    this.configPath = path.join(__dirname, '../prompts/configs/prompt-config.json');
    this.loadConfig();
  }

  private loadConfig(): void {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf-8');
      this.config = JSON.parse(configData);
    } catch (error) {
      console.warn('Could not load prompt config, using defaults');
      this.config = this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): PromptConfig {
    return {
      templates: {
        default: 'social-media-analysis.md',
        sentiment: 'sentiment-focused.md',
        trends: 'trend-analysis.md',
        competitive: 'competitive-analysis.md'
      },
      variables: {
        keyword: '{{keyword}}',
        tweet_count: '{{tweet_count}}',
        tweets: '{{tweets}}'
      },
      settings: {
        max_tweet_length: 280,
        max_tweets_display: 100,
        include_metadata: false,
        format_tweets_numbered: true
      },
      provider_preferences: {}
    };
  }

  getPrompt(
    analysisType: AnalysisType = 'default',
    variables: PromptVariables,
    provider?: string,
    model?: string
  ): string {
    // Get template name based on analysis type, provider, and model preferences
    const templateName = this.getTemplateForAnalysis(analysisType, provider, model);
    
    // Load template content
    const template = this.loadTemplate(templateName);
    
    // Process tweets according to settings
    const processedTweets = this.processTweets(variables.tweets);
    
    // Replace variables in template
    return this.replaceVariables(template, {
      ...variables,
      tweets: processedTweets,
      tweet_count: variables.tweets.length
    });
  }

  private getTemplateForAnalysis(
    analysisType: AnalysisType,
    provider?: string,
    model?: string
  ): string {
    // Check for model-specific preferences first
    if (provider && model) {
      const modelPrefs = this.config.provider_preferences[provider]?.model_specific?.[model];
      if (modelPrefs?.preferred_template) {
        return modelPrefs.preferred_template;
      }
    }

    // Check for provider preferences
    if (provider) {
      const providerPrefs = this.config.provider_preferences[provider];
      if (providerPrefs?.preferred_template) {
        return providerPrefs.preferred_template;
      }
    }

    // Fall back to analysis type template
    return this.config.templates[analysisType] || this.config.templates.default || 'social-media-analysis.md';
  }

  private loadTemplate(templateName: string): string {
    try {
      const templatePath = path.join(this.templatesPath, templateName);
      return fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
      console.warn(`Could not load template ${templateName}, using fallback`);
      return this.getFallbackTemplate();
    }
  }

  private getFallbackTemplate(): string {
    return `You are an expert social media trend analyst. Please analyze the following collection of tweets about "{{keyword}}".

Please provide a comprehensive analysis with the following sections:

🎯 **KEY THEMES**
Identify the main discussion themes and topics (3-5 key themes)

📊 **SENTIMENT ANALYSIS** 
Analyze the overall sentiment (positive/negative/neutral) with percentages if possible

👥 **KEY INSIGHTS**
Notable patterns, trending opinions, or emerging narratives

📝 **EXECUTIVE SUMMARY**
A concise summary of findings (150-200 words)

Tweet Collection ({{tweet_count}} tweets):
{{tweets}}

Please format your response with clear sections and emojis as shown above.`;
  }

  private processTweets(tweets: string[]): string {
    const settings = this.config.settings;
    let processedTweets = tweets.slice(0, settings.max_tweets_display);

    // Truncate tweets if needed
    if (settings.max_tweet_length > 0) {
      processedTweets = processedTweets.map(tweet => 
        tweet.length > settings.max_tweet_length 
          ? tweet.substring(0, settings.max_tweet_length) + '...'
          : tweet
      );
    }

    // Format tweets
    if (settings.format_tweets_numbered) {
      return processedTweets
        .map((tweet, index) => `${index + 1}. ${tweet}`)
        .join('\n');
    } else {
      return processedTweets
        .map(tweet => `- ${tweet}`)
        .join('\n');
    }
  }

  private replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      const replacement = value !== undefined ? String(value) : '';
      result = result.replace(new RegExp(placeholder, 'g'), replacement);
    });

    return result;
  }

  getAvailableTemplates(): string[] {
    try {
      return fs.readdirSync(this.templatesPath)
        .filter(file => file.endsWith('.md'))
        .map(file => file.replace('.md', ''));
    } catch (error) {
      return ['default'];
    }
  }

  getAnalysisTypes(): AnalysisType[] {
    return ['default', 'sentiment', 'trends', 'competitive'];
  }

  getProviderPreferences(provider: string, model?: string): any {
    const providerPrefs = this.config.provider_preferences[provider];
    if (!providerPrefs) return {};

    if (model && providerPrefs.model_specific?.[model]) {
      return { ...providerPrefs, ...providerPrefs.model_specific[model] };
    }

    return providerPrefs;
  }
}