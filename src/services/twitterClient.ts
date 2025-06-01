
import { TwitterApi } from 'twitter-api-v2';
import { Tweet } from '../types';

// Initialize Twitter client with proper environment variable name
const client = new TwitterApi(process.env.X_BEARER_TOKEN || '');

export const getTweets = async (keyword: string, limit: number = 50): Promise<Tweet[]> => {
  try {
    // Build search query to exclude retweets and replies
    const query = `${keyword} -is:retweet -is:reply lang:en`;
    
    console.log(`   🔍 Searching Twitter API with query: "${query}"`);
    
    let allTweets: Tweet[] = [];
    let nextToken: string | undefined = undefined;
    let requests = 0;
    const maxRequests = 5; // To avoid infinite loops in case of issues

    while (allTweets.length < limit && requests < maxRequests) {
        const response = await client.v2.search(query, {
            max_results: Math.min(limit - allTweets.length, 100),
            'tweet.fields': ['created_at', 'author_id', 'public_metrics', 'context_annotations'],
            'user.fields': ['username', 'name', 'verified', 'public_metrics'],
            expansions: ['author_id'],
            next_token: nextToken
        });

        if (!response.data || !response.data.data) {
            break;
        }

        const users = response.includes?.users || [];
        const userMap = new Map(users.map(user => [user.id, user]));

        const tweets: Tweet[] = response.data.data.map(tweet => {
            const user = userMap.get(tweet.author_id!);
            return {
                id: tweet.id,
                text: tweet.text,
                author_id: tweet.author_id,
                created_at: tweet.created_at,
                username: user?.username,
                public_metrics: {
                    ...tweet.public_metrics,
                    impression_count: tweet.public_metrics?.impression_count || 0
                },
                author_followers_count: user?.public_metrics?.followers_count || 0
            };
        });

        allTweets = allTweets.concat(tweets);
        nextToken = response.data.meta?.next_token;
        requests++;

        if (!nextToken) {
            break;
        }
    }


    return allTweets.slice(0, limit);
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
