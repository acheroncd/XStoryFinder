
import { TwitterApi } from 'twitter-api-v2';
import { Tweet } from '../types';

// Initialize Twitter client with proper environment variable name
const client = new TwitterApi(process.env.X_BEARER_TOKEN || '');

export const getTweets = async (keyword: string, limit: number = 50): Promise<Tweet[]> => {
  try {
    // Build search query to exclude retweets and replies
    const query = `${keyword} -is:retweet -is:reply lang:en`;
    
    console.log(`   🔍 Searching Twitter API with query: "${query}"`);
    
    // Make the actual API call
    const response = await client.v2.search(query, {
      max_results: Math.min(limit, 100), // Twitter API limit is 100 per request
      'tweet.fields': ['created_at', 'author_id', 'public_metrics', 'context_annotations'],
      'user.fields': ['username', 'name', 'verified'],
      expansions: ['author_id']
    });

    if (!response.data) {
      return [];
    }

    // Transform Twitter API response to our Tweet type
    const tweets: Tweet[] = response.data.data?.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      author_id: tweet.author_id || undefined,
      created_at: tweet.created_at || undefined,
      public_metrics: tweet.public_metrics || undefined,
      username: response.includes?.users?.find(user => user.id === tweet.author_id)?.username || undefined
    })) || [];

    return tweets;
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific Twitter API errors
      if (error.message.includes('401')) {
        throw new Error('Twitter API authentication failed. Please check your X_BEARER_TOKEN in .env file.');
      } else if (error.message.includes('429')) {
        throw new Error('Twitter API rate limit exceeded. Please try again later.');
      } else if (error.message.includes('403')) {
        throw new Error('Twitter API access forbidden. Please check your API permissions.');
      }
      throw new Error(`Twitter API error: ${error.message}`);
    }
    throw error;
  }
};
