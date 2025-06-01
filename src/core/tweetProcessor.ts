
import { Tweet } from '../types';
import { AIAnalyzer } from '../services/aiAnalyzer';

export const processTweets = async (tweets: Tweet[]): Promise<Tweet[]> => {
  const uniqueTweets = new Map<string, Tweet>();
  tweets.forEach(tweet => {
    if (!uniqueTweets.has(tweet.id)) {
      uniqueTweets.set(tweet.id, tweet);
    }
  });

  const uniqueTweetArray = Array.from(uniqueTweets.values());

  // Filter tweets using AI
  const analyzer = new AIAnalyzer();
  const filteredTweets = await analyzer.filterTweets(uniqueTweetArray);

  return filteredTweets;
};
