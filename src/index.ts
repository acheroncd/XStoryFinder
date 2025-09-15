#!/usr/bin/env node
import { Command } from 'commander';
import dotenv from 'dotenv';
import { getTweets } from './services/twitterClient';
import { processTweets } from './core/tweetProcessor';
import { analyzeTweets } from './services/aiAnalyzer';

// Load environment variables
dotenv.config();

// Validate required environment variables
const validateEnvironment = (): void => {
  const requiredEnvVars = ['X_BEARER_TOKEN', 'GEMINI_API_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n💡 Please check your .env file and ensure all required API keys are set.');
    console.error('   You can copy .env.example to .env and fill in your API keys.');
    process.exit(1);
  }
};

const program = new Command();

program
  .name('xstoryfinder')
  .version('1.0.0')
  .description('🔍 X/Twitter Story Finder & AI Analyzer\n\nFetch tweets by keyword and get AI-powered analysis and insights.')
  .option('-k, --keyword <keyword>', 'Keyword to search for on Twitter')
  .option('-l, --limit <number>', 'Maximum number of tweets to fetch (default: 50)', '50')
  .option('-v, --verbose', 'Enable verbose logging')
  .addHelpText('after', `
Examples:
  $ npm start -- --keyword "artificial intelligence"
  $ npm start -- -k "climate change" -l 100
  $ npm start -- --keyword "web3" --verbose
  
Environment Setup:
  Make sure to set your API keys in the .env file:
  - X_BEARER_TOKEN: Your Twitter API Bearer Token
  - GEMINI_API_KEY: Your Google Gemini API Key
`)
  .parse(process.argv);

const options = program.opts();

const main = async () => {
  // Validate environment variables first
  validateEnvironment();
  
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
    const processedTweets = processTweets(tweets);
    
    if (options.verbose) {
      console.log(`   📝 Processed ${processedTweets.length} unique tweets`);
    }

    console.log('🤖 AI analysis in progress...');
    const analysis = await analyzeTweets(processedTweets, options.keyword);

    console.log('\n' + '='.repeat(50));
    console.log('📊 AI ANALYSIS REPORT');
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