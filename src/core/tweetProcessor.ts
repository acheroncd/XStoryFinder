
import { Tweet } from '../types';

export const processTweets = (tweets: Tweet[]): string[] => {
  const uniqueTweets = new Map<string, string>();
  tweets.forEach(tweet => {
    if (!uniqueTweets.has(tweet.text)) {
      uniqueTweets.set(tweet.text, tweet.id);
    }
  });
  return Array.from(uniqueTweets.keys());
};
