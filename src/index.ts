
import { Command } from 'commander';
import dotenv from 'dotenv';
import { getTweets } from './services/twitterClient';
import { processTweets } from './core/tweetProcessor';
import { analyzeTweets } from './services/aiAnalyzer';

dotenv.config();

const program = new Command();

program
  .version('1.0.0')
  .description('X/Twitter Story Finder & AI Analyzer')
  .option('-k, --keyword <type>', 'Keyword to search for on Twitter')
  .parse(process.argv);

const options = program.opts();

const main = async () => {
  if (!options.keyword) {
    console.error('Error: Keyword is required.');
    program.help();
    process.exit(1);
  }

  try {
    console.log(`Fetching tweets for keyword: "${options.keyword}"...`);
    const tweets = await getTweets(options.keyword);

    if (tweets.length === 0) {
      console.log('No tweets found for the given keyword.');
      return;
    }

    console.log('Processing and cleaning tweets...');
    const processedTweets = processTweets(tweets);

    console.log('AI analysis in progress...');
    const analysis = await analyzeTweets(processedTweets);

    console.log('\n--- AI Analysis Report ---');
    console.log(analysis);
    console.log('--------------------------\n');
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
};

main();
