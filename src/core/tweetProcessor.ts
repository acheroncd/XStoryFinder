
import { Tweet } from '../types';
import { AIAnalyzer } from '../services/aiAnalyzer';

export const processTweets = async (tweets: Tweet[]): Promise<string[]> => {
  const uniqueTweets = new Map<string, string>();
  tweets.forEach(tweet => {
    if (!uniqueTweets.has(tweet.text)) {
      uniqueTweets.set(tweet.text, tweet.id);
    }
  });

  const tweetTexts = Array.from(uniqueTweets.keys());

  // Filter tweets using AI
  const analyzer = new AIAnalyzer();
  const filteredTweets = await analyzer.filterTweets(tweetTexts);

  return filteredTweets;
};
