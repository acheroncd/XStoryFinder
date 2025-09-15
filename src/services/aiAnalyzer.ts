
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const analyzeTweets = async (tweets: string[], keyword: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are an expert social media trend analyst. Please analyze the following collection of tweets about "${keyword}".

Please provide a comprehensive analysis with the following sections:

🎯 **KEY THEMES**
Identify the main discussion themes and topics (3-5 key themes)

📊 **SENTIMENT ANALYSIS** 
Analyze the overall sentiment (positive/negative/neutral) with percentages if possible

👥 **KEY INSIGHTS**
Notable patterns, trending opinions, or emerging narratives

📝 **EXECUTIVE SUMMARY**
A concise summary of findings (150-200 words)

Tweet Collection (${tweets.length} tweets):
${tweets.map((tweet, index) => `${index + 1}. ${tweet}`).join('\n')}

Please format your response with clear sections and emojis as shown above.`;

    console.log('   🤖 Sending request to Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from AI model');
    }
    
    return text;
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific Gemini API errors
      if (error.message.includes('API_KEY')) {
        throw new Error('Gemini API authentication failed. Please check your GEMINI_API_KEY in .env file.');
      } else if (error.message.includes('quota')) {
        throw new Error('Gemini API quota exceeded. Please try again later or check your billing.');
      } else if (error.message.includes('SAFETY')) {
        throw new Error('Content was blocked by Gemini safety filters. Try a different keyword.');
      }
      throw new Error(`AI Analysis error: ${error.message}`);
    }
    throw error;
  }
};
