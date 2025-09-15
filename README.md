# 🔍 XStoryFinder - X/Twitter Story Finder & AI Analyzer

A powerful CLI tool that fetches tweets based on keywords and provides AI-powered analysis and insights using Google's Gemini AI.

## ✨ Features

- 🐦 **Tweet Fetching**: Search and retrieve tweets from X (Twitter) using keywords
- 🧹 **Data Cleaning**: Automatic filtering of retweets, replies, and duplicate content
- 🤖 **AI Analysis**: Advanced sentiment analysis and theme identification using Google Gemini
- 📊 **Rich Insights**: Key themes, sentiment breakdown, and executive summaries
- 🎯 **CLI Interface**: Easy-to-use command-line interface with helpful options
- 🔧 **Configurable**: Customizable tweet limits and verbose logging

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- X (Twitter) API Bearer Token
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/acheroncd/XStoryFinder.git
   cd XStoryFinder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   X_BEARER_TOKEN="your_twitter_bearer_token_here"
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

### Getting API Keys

#### X (Twitter) API Bearer Token
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new project/app
3. Generate a Bearer Token in your app settings
4. Copy the Bearer Token to your `.env` file

#### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key to your `.env` file

## 📖 Usage

### Basic Usage

```bash
# Search for tweets about "artificial intelligence"
npm start -- --keyword "artificial intelligence"

# Short form
npm start -- -k "climate change"
```

### Advanced Options

```bash
# Limit the number of tweets
npm start -- --keyword "web3" --limit 100

# Enable verbose logging
npm start -- --keyword "machine learning" --verbose

# Combine options
npm start -- -k "blockchain" -l 50 -v
```

### Available Commands

```bash
# Development mode with auto-reload
npm run dev

# Build the project
npm run build

# Type checking
npm run lint

# Clean build
npm run build:clean
```

## 🏗️ Architecture

The project follows a modular architecture:

```
/XStoryFinder
├── src/
│   ├── index.ts              # Main CLI entry point
│   ├── services/
│   │   ├── twitterClient.ts  # X API integration
│   │   └── aiAnalyzer.ts     # Gemini AI integration
│   ├── core/
│   │   └── tweetProcessor.ts # Data cleaning & processing
│   └── types/
│       └── index.ts          # TypeScript type definitions
├── .env                      # Environment variables (create from .env.example)
├── package.json              # Project configuration
└── tsconfig.json             # TypeScript configuration
```

## 📊 Sample Output

```
🔍 Fetching tweets for keyword: "artificial intelligence"...
✅ Found 47 tweets
🧹 Processing and cleaning tweets...
🤖 AI analysis in progress...

==================================================
📊 AI ANALYSIS REPORT
==================================================

🎯 **KEY THEMES**
1. Machine Learning Applications in Healthcare
2. AI Ethics and Regulation Discussions
3. Breakthrough in Natural Language Processing
4. AI Job Market and Career Opportunities
5. Open Source AI Tools and Frameworks

📊 **SENTIMENT ANALYSIS**
Overall sentiment: Positive (65%)
- Positive: 65% - Excitement about AI advancements
- Neutral: 25% - Factual discussions and news
- Negative: 10% - Concerns about job displacement

👥 **KEY INSIGHTS**
- Strong enthusiasm for AI applications in healthcare
- Growing concern about ethical AI development
- Increased interest in AI education and careers
- Active discussion about open-source AI tools

📝 **EXECUTIVE SUMMARY**
The conversation around artificial intelligence shows predominantly positive sentiment, with significant focus on practical applications, particularly in healthcare. There's a balanced discussion between excitement for technological advancement and thoughtful consideration of ethical implications. The community appears engaged in both technical developments and broader societal impacts.

==================================================

✅ Analysis complete!
```

## 🛠️ Development

### Project Structure

- **`src/index.ts`**: Main application entry point with CLI setup
- **`src/services/twitterClient.ts`**: Handles X API interactions
- **`src/services/aiAnalyzer.ts`**: Manages Gemini AI analysis
- **`src/core/tweetProcessor.ts`**: Data cleaning and deduplication
- **`src/types/index.ts`**: TypeScript type definitions

### Adding New Features

1. **New Analysis Types**: Extend the `aiAnalyzer.ts` service
2. **Additional Data Sources**: Create new services in `src/services/`
3. **Enhanced Processing**: Modify `tweetProcessor.ts`
4. **CLI Options**: Update `src/index.ts` command configuration

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `X_BEARER_TOKEN` | Twitter API Bearer Token | ✅ |
| `GEMINI_API_KEY` | Google Gemini API Key | ✅ |

### CLI Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--keyword` | `-k` | Search keyword | Required |
| `--limit` | `-l` | Max tweets to fetch | 50 |
| `--verbose` | `-v` | Enable verbose logging | false |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**"Missing required environment variables"**
- Ensure your `.env` file exists and contains valid API keys
- Check that variable names match exactly: `X_BEARER_TOKEN` and `GEMINI_API_KEY`

**"Twitter API authentication failed"**
- Verify your Twitter Bearer Token is correct
- Ensure your Twitter Developer account has proper permissions

**"Gemini API quota exceeded"**
- Check your Google Cloud billing and quota limits
- Consider using a different API key or upgrading your plan

**"No tweets found"**
- Try different keywords or check if the topic has recent activity
- Verify your Twitter API access permissions

### Getting Help

- Check the [Issues](https://github.com/acheroncd/XStoryFinder/issues) page
- Review the [Architecture Documentation](ARCHITECTURE.md)
- Ensure all dependencies are properly installed

## 🙏 Acknowledgments

- [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api) for tweet data
- [Google Gemini AI](https://ai.google.dev/) for intelligent analysis
- [Commander.js](https://github.com/tj/commander.js/) for CLI interface
- [twitter-api-v2](https://github.com/PLhery/node-twitter-api-v2) for Twitter integration