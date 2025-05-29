# 🔍 XStoryFinder - X/Twitter Story Finder & AI Analyzer

A powerful command-line interface (CLI) tool that fetches tweets based on keywords and provides comprehensive AI-powered analysis and insights using multiple AI providers including Google Gemini, OpenRouter (Claude, GPT-4, Llama), and more.

## ✨ Key Features

- 🐦 **Smart Tweet Fetching**: Search and retrieve relevant tweets from X (Twitter) using targeted keywords
- 🧹 **Intelligent Data Cleaning**: Automatic filtering of retweets, replies, and duplicate content for quality analysis
- 🤖 **Multi-Provider AI Analysis**: Comprehensive sentiment analysis and theme identification using multiple AI providers (Gemini, OpenRouter with Claude/GPT-4/Llama, etc.)
- 📊 **Rich Analytical Insights**: Detailed key themes, sentiment breakdowns, and executive summaries
- 🎯 **User-Friendly CLI**: Intuitive command-line interface with comprehensive help and options
- 🔧 **Highly Configurable**: Customizable tweet limits, verbose logging, and flexible search parameters

## 🚀 Quick Start

### System Requirements

- **Node.js** (v16 or higher) - JavaScript runtime environment
- **npm** or **yarn** - Package manager for dependency installation
- **X (Twitter) API Bearer Token** - For accessing Twitter's API services
- **AI Provider API Key** - At least one of the following:
  - **Google Gemini API Key** - For Google's Gemini AI models
  - **OpenRouter API Key** - For access to Claude, GPT-4, Llama, and other models

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
   
   # At least one AI provider key is required:
   GEMINI_API_KEY="your_gemini_api_key_here"
   OPENROUTER_API_KEY="your_openrouter_api_key_here"
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
3. Copy the API key to your `.env` file as `GEMINI_API_KEY`

#### OpenRouter API Key
1. Go to [OpenRouter](https://openrouter.ai/keys)
2. Sign up and create a new API key
3. Add credits to your account for model usage
4. Copy the API key to your `.env` file as `OPENROUTER_API_KEY`

## 📖 Usage Guide

### Basic Usage Examples

```bash
# Search for tweets about "artificial intelligence" (uses default provider)
npm start -- --keyword "artificial intelligence"

# Use specific AI provider
npm start -- -k "climate change" --provider openrouter

# Use specific model
npm start -- -k "web3" --model "anthropic/claude-3.5-sonnet"

# Use different analysis types
npm start -- -k "bitcoin" --analysis sentiment
npm start -- -k "startup trends" --analysis trends
npm start -- -k "apple vs samsung" --analysis competitive
```

### Advanced Options

```bash
# Limit the number of tweets with specific provider
npm start -- --keyword "web3" --limit 100 --provider gemini

# Enable verbose logging with specific model
npm start -- --keyword "machine learning" --verbose --model "openai/gpt-4o"

# Combine all options with analysis type
npm start -- -k "blockchain" -l 50 -v -p openrouter -m "anthropic/claude-3-opus" -a trends

# List available providers and their status
npm start -- --list-providers
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
│   │   ├── aiAnalyzer.ts     # AI analysis orchestration
│   │   ├── PromptManager.ts  # Prompt template management
│   │   └── providers/        # AI provider implementations
│   ├── core/
│   │   └── tweetProcessor.ts # Data cleaning & processing
│   ├── prompts/
│   │   ├── templates/        # Analysis prompt templates
│   │   └── configs/          # Prompt configuration files
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

1. **New Analysis Types**: 
   - Add templates in `src/prompts/templates/`
   - Update `src/prompts/configs/prompt-config.json`
   - Extend analysis type definitions
2. **Additional AI Providers**: Create new provider classes in `src/services/providers/`
3. **Enhanced Processing**: Modify `tweetProcessor.ts`
4. **Custom Prompts**: Edit template files or create new ones
5. **CLI Options**: Update `src/index.ts` command configuration

## 🤖 AI Providers

XStoryFinder supports multiple AI providers, giving you flexibility in choosing the best model for your analysis needs.

### Supported Providers

#### 🧠 Google Gemini
- **Models**: `gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-pro`
- **Strengths**: Fast, cost-effective, good reasoning
- **Setup**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

#### 🌐 OpenRouter
- **Models**: Access to 50+ models including:
  - **Anthropic Claude**: `anthropic/claude-3.5-sonnet`, `anthropic/claude-3-opus`
  - **OpenAI GPT**: `openai/gpt-4o`, `openai/gpt-4-turbo`
  - **Meta Llama**: `meta-llama/llama-3.1-405b-instruct`
  - **Mistral**: `mistralai/mistral-large`
  - **And many more...**
- **Strengths**: Model variety, competitive pricing, latest models
- **Setup**: Get API key from [OpenRouter](https://openrouter.ai/keys)

### Provider Selection

The tool automatically selects an available provider based on your API keys. You can also specify:

```bash
# Use specific provider
npm start -- -k "AI trends" --provider openrouter

# Use specific model
npm start -- -k "AI trends" --model "anthropic/claude-3.5-sonnet"

# List all available providers
npm start -- --list-providers
```

## 📊 Analysis Types

XStoryFinder offers specialized analysis templates optimized for different use cases:

### 🎯 Default Analysis
- **Usage**: `--analysis default` (default)
- **Focus**: Comprehensive social media analysis
- **Includes**: Key themes, sentiment, insights, and executive summary
- **Best for**: General purpose social media monitoring

### 💭 Sentiment Analysis
- **Usage**: `--analysis sentiment`
- **Focus**: Deep emotional and sentiment analysis
- **Includes**: Detailed sentiment breakdown, emotional themes, opinion dynamics
- **Best for**: Brand monitoring, crisis management, public opinion research

### 📈 Trend Analysis
- **Usage**: `--analysis trends`
- **Focus**: Viral content and trending pattern identification
- **Includes**: Viral content analysis, trend patterns, influencer impact, predictions
- **Best for**: Content strategy, trend forecasting, viral marketing

### 🏢 Competitive Analysis
- **Usage**: `--analysis competitive`
- **Focus**: Brand and market intelligence
- **Includes**: Brand mentions, market dynamics, competitive positioning
- **Best for**: Competitive intelligence, market research, brand positioning

### Example Usage

```bash
# Sentiment analysis for brand monitoring
npm start -- -k "your-brand" --analysis sentiment

# Trend analysis for content strategy
npm start -- -k "AI tools" --analysis trends -p openrouter

# Competitive analysis with specific model
npm start -- -k "smartphone market" --analysis competitive -m "anthropic/claude-3.5-sonnet"
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `X_BEARER_TOKEN` | Twitter API Bearer Token | ✅ |
| `GEMINI_API_KEY` | Google Gemini API Key | ⚠️ At least one AI provider |
| `OPENROUTER_API_KEY` | OpenRouter API Key | ⚠️ At least one AI provider |

### CLI Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--keyword` | `-k` | Search keyword | Required |
| `--limit` | `-l` | Max tweets to fetch | 50 |
| `--provider` | `-p` | AI provider (gemini, openrouter) | Auto-detect |
| `--model` | `-m` | Specific AI model to use | Provider default |
| `--analysis` | `-a` | Analysis type (default, sentiment, trends, competitive) | default |
| `--verbose` | `-v` | Enable verbose logging | false |
| `--list-providers` | | List available providers | |

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

**"Missing AI provider API keys"**
- Ensure your `.env` file contains at least one AI provider key
- Check variable names: `GEMINI_API_KEY` or `OPENROUTER_API_KEY`
- Use `--list-providers` to check provider status

**"Twitter API authentication failed"**
- Verify your Twitter Bearer Token is correct
- Ensure your Twitter Developer account has proper permissions

**"AI API quota exceeded"**
- Check your provider's billing and quota limits
- Try switching to a different provider: `--provider openrouter`
- Consider using a different model: `--model "gemini-1.5-flash"`

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
- [OpenRouter](https://openrouter.ai/) for multi-model AI access
- [Commander.js](https://github.com/tj/commander.js/) for CLI interface
- [twitter-api-v2](https://github.com/PLhery/node-twitter-api-v2) for Twitter integration
- [OpenAI SDK](https://github.com/openai/openai-node) for OpenRouter compatibility