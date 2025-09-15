
import { TwitterApi } from 'twitter-api-v2';
import { Tweet } from '../types';

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || '');

export const getTweets = async (keyword: string): Promise<Tweet[]> => {
  // Placeholder implementation
  console.log(`Searching for tweets with keyword: ${keyword}`);
  // In a real implementation, you would make an API call like this:
  // const response = await client.v2.search('from:twitterdev -is:retweet', { 'media.fields': 'url' });
  // For now, we return mock data.
  return [
    { id: '1', text: `This is a sample tweet about ${keyword}.` },
    { id: '2', text: `Another example tweet talking about ${keyword}.` },
    { id: '3', text: `This is a sample tweet about ${keyword}.` }, // Duplicate for testing
  ];
};
