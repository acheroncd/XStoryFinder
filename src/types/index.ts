
export interface Tweet {
  id: string;
  text: string;
  author_id?: string | undefined;
  created_at?: string | undefined;
  username?: string | undefined;
  public_metrics?: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
  } | undefined;
}

export interface AnalysisResult {
  keyThemes: string[];
  sentiment: {
    overall: 'positive' | 'negative' | 'neutral';
    breakdown?: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
  insights: string[];
  summary: string;
}
