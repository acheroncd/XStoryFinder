#!/usr/bin/env node
import { Command } from 'commander';
import dotenv from 'dotenv';
import { getTweets } from './services/twitterClient';
import { processTweets } from './core/tweetProcessor';
import { AIAnalyzer, AnalyzerOptions } from './services/aiAnalyzer';
import { ProviderType } from './services/providers/AIProviderFactory';

// Load environment variables
dotenv.config();

// Validate required environment variables
const validateEnvironment = (provider?: ProviderType): void => {
  const requiredVars: string[] = ['X_BEARER_TOKEN'];
  
  // Add provider-specific API key requirements
  if (!provider || provider === 'gemini') {
    if (process.env.GEMINI_API_KEY) {
      requiredVars.push('GEMINI_API_KEY');
    }
  }
  
  if (!provider || provider === 'openrouter') {
    if (process.env.OPENROUTER_API_KEY) {
      requiredVars.push('OPENROUTER_API_KEY');
    }
  }
  
  // Check if at least one AI provider key is available
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;
  
  if (!hasGemini && !hasOpenRouter) {
    console.error('❌ Missing AI provider API keys. You need at least one of:');
    console.error('   - GEMINI_API_KEY (for Google Gemini)');
    console.error('   - OPENROUTER_API_KEY (for OpenRouter models)');
    console.error('\n💡 Please check your .env file and ensure at least one AI provider key is set.');
    process.exit(1);
  }
  
  // Check Twitter API key
  if (!process.env.X_BEARER_TOKEN) {
    console.error('❌ Missing required environment variable: X_BEARER_TOKEN');
    console.error('\n💡 Please set your Twitter API Bearer Token in the .env file.');
    process.exit(1);
  }
};

const listProviders = (): void => {
  console.log('🤖 Available AI Providers:\n');
  
  const providers = AIAnalyzer.getProviderInfo();
  const supportedProviders = AIAnalyzer.getSupportedProviders();
  
  supportedProviders.forEach(providerId => {
    const provider = providers[providerId];
    const hasKey = providerId === 'gemini' ? !!process.env.GEMINI_API_KEY : !!process.env.OPENROUTER_API_KEY;
    const status = hasKey ? '✅' : '❌';
    
    console.log(`${status} ${providerId}: ${provider.name}`);
    console.log(`   Description: ${provider.description}`);
    console.log(`   Default Model: ${provider.defaultModel}`);
    console.log(`   Status: ${hasKey ? 'API key configured' : 'API key missing'}\n`);
  });
};

const program = new Command();

program
  .name('xstoryfinder')
  .version('1.0.0')
  .description('🔍 X/Twitter Story Finder & AI Analyzer\n\nFetch tweets by keyword and get AI-powered analysis and insights.')
  .option('-k, --keyword <keyword>', 'Keyword to search for on Twitter')
  .option('-l, --limit <number>', 'Maximum number of tweets to fetch (default: 50)', '50')
  .option('-p, --provider <provider>', 'AI provider to use (gemini, openrouter)')
  .option('-m, --model <model>', 'Specific AI model to use')
  .option('-a, --analysis <type>', 'Analysis type (default, sentiment, trends, competitive)', 'default')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('--list-providers', 'List available AI providers and their status')
  .addHelpText('after', `
Examples:
  $ npm start -- --keyword "artificial intelligence"
  $ npm start -- -k "climate change" -l 100 -p openrouter
  $ npm start -- --keyword "web3" --model "anthropic/claude-3.5-sonnet"
  $ npm start -- -k "bitcoin" --analysis sentiment
  $ npm start -- --list-providers
  
AI Providers:
  - gemini: Google Gemini (requires GEMINI_API_KEY)
  - openrouter: OpenRouter multi-model access (requires OPENROUTER_API_KEY)
  
Analysis Types:
  - default: Comprehensive social media analysis
  - sentiment: Focused sentiment and emotion analysis
  - trends: Trend identification and viral content analysis
  - competitive: Brand and market competitive analysis
  
Environment Setup:
  Set your API keys in the .env file:
  - X_BEARER_TOKEN: Your Twitter API Bearer Token (required)
  - GEMINI_API_KEY: Your Google Gemini API Key (optional)
  - OPENROUTER_API_KEY: Your OpenRouter API Key (optional)
`)
  .parse(process.argv);

const options = program.opts();

const main = async () => {
  // Handle list providers command
  if (options.listProviders) {
    listProviders();
    return;
  }
  
  // Validate provider if specified
  if (options.provider && !AIAnalyzer.getSupportedProviders().includes(options.provider)) {
    console.error(`❌ Error: Unsupported provider "${options.provider}".`);
    console.error(`Supported providers: ${AIAnalyzer.getSupportedProviders().join(', ')}`);
    process.exit(1);
  }
  
  // Validate analysis type if specified
  const validAnalysisTypes = ['default', 'sentiment', 'trends', 'competitive'];
  if (options.analysis && !validAnalysisTypes.includes(options.analysis)) {
    console.error(`❌ Error: Unsupported analysis type "${options.analysis}".`);
    console.error(`Supported analysis types: ${validAnalysisTypes.join(', ')}`);
    process.exit(1);
  }
  
  // Validate environment variables
  validateEnvironment(options.provider);
  
  if (!options.keyword) {
    console.error('❌ Error: Keyword is required.');
    program.help();
    process.exit(1);
  }

  const limit = parseInt(options.limit, 10);
  if (isNaN(limit) || limit <= 0) {
    console.error('❌ Error: Limit must be a positive number.');
    process.exit(1);
  }

  try {
    console.log(`🔍 Fetching tweets for keyword: "${options.keyword}"...`);
    if (options.verbose) {
      console.log(`   📊 Limit: ${limit} tweets`);
    }
    
    const tweets = await getTweets(options.keyword, limit);

    if (tweets.length === 0) {
      console.log('❌ No tweets found for the given keyword.');
      console.log('💡 Try a different keyword or check your API credentials.');
      return;
    }

    console.log(`✅ Found ${tweets.length} tweets`);
    console.log('🧹 Processing and cleaning tweets...');
    const processedTweets = await processTweets(tweets);
    
    if (options.verbose) {
      console.log(`   📝 Processed ${processedTweets.length} unique tweets`);
    }

    console.log('🤖 AI analysis in progress...');
    
    // Create analyzer with specified options
    const analyzerOptions: AnalyzerOptions = {
      provider: options.provider,
      model: options.model,
      verbose: options.verbose,
      analysisType: options.analysis
    };
    
    const analyzer = new AIAnalyzer(analyzerOptions);
    const analysis = await analyzer.analyzeTweets(processedTweets, options.keyword, analyzerOptions);

    console.log('\n' + '='.repeat(50));
    console.log('📊 AI ANALYSIS REPORT');
    console.log(`🤖 Provider: ${analyzer.getProviderName()}`);
    console.log(`📋 Analysis Type: ${options.analysis || 'default'}`);
    console.log('='.repeat(50));
    console.log(analysis);
    console.log('='.repeat(50) + '\n');
    
    console.log('✅ Analysis complete!');
  } catch (error) {
    console.error('❌ An error occurred:', error instanceof Error ? error.message : error);
    if (options.verbose && error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
};

main();