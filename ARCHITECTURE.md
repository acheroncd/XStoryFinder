# X/Twitter Story Finder & AI Analyzer - Architecture

This document outlines the architecture and design for a CLI tool that fetches tweets based on a user-provided keyword, analyzes them with an AI model, and presents a summary.

## 1. Project Goal

To create a Command Line Interface (CLI) tool that enables users to input a keyword, fetch recent, relevant tweets from X (formerly Twitter), and receive a concise, AI-generated analysis and summary of those tweets, after filtering out irrelevant and duplicate content.

## 2. Core Features

-   **Keyword Input**: The application will accept a search keyword as a command-line argument.
-   **Tweet Fetching**: It will interact with the X (Twitter) API to retrieve a collection of tweets matching the keyword.
-   **Data Cleaning & Deduplication**: It will filter out retweets, replies, and tweets with identical content to ensure the quality of the data sent for analysis.
-   **AI-Powered Analysis**: The cleaned tweet data will be sent to a generative AI model (e.g., Google's Gemini) for in-depth analysis.
-   **Summarized Output**: The AI will return a structured analysis, which may include:
    -   **Key Themes**: The main topics and opinions discussed in the tweets.
    -   **Sentiment Analysis**: The overall sentiment (positive, negative, neutral) of the conversation.
    -   **Key Influencers**: Users who are driving the conversation.
    -   **Executive Summary**: A brief, consolidated summary of the findings.
-   **CLI Display**: The final report will be presented in a clean, readable format in the terminal.

## 3. Technology Stack

-   **Language**: **TypeScript** - For type safety and building a well-structured, maintainable application.
-   **Runtime**: **Node.js** - The standard for building server-side and command-line applications with JavaScript/TypeScript.
-   **Package Manager**: **npm** (or yarn) - For managing project dependencies.
-   **X (Twitter) API Client**: **`twitter-api-v2`** - A modern, powerful, and well-maintained library for interacting with the Twitter API v2.
-   **AI Client**: **`@google/generative-ai`** - The official Google SDK for interacting with the Gemini API.
-   **CLI Argument Parsing**: **`commander`** - A popular library for creating a professional and easy-to-use command-line interface.
-   **Environment Variables**: **`dotenv`** - To manage API keys and other secrets securely, keeping them out of the source code.

## 4. Project Structure

A modular structure will be used to separate concerns, making the codebase easier to understand, test, and extend.

```
/XStoryFinder
├── .env                # Stores API keys and secrets (add to .gitignore)
├── .gitignore          # Specifies files for Git to ignore
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript compiler configuration
└── src/
    ├── index.ts        # Main application entry point; orchestrates the workflow
    ├── services/
    │   ├── twitterClient.ts # Encapsulates all logic for the X API
    │   └── aiAnalyzer.ts    # Encapsulates all logic for the AI analysis API
    ├── core/
    │   └── tweetProcessor.ts # Handles data cleaning, deduplication, and formatting
    └── types/
        └── index.ts        # Contains TypeScript type definitions (e.g., Tweet, AnalysisResult)
```

## 5. Workflow

1.  **Initialization**
    -   The user runs the tool from the command line (e.g., `npm start -- --keyword "some topic"`).
    -   `src/index.ts`, the entry point, uses `commander` to parse the keyword.
    -   `dotenv` loads the environment variables (e.g., `X_API_KEY`, `GEMINI_API_KEY`) from the `.env` file.

2.  **Fetch Tweets**
    -   `index.ts` calls a function in `services/twitterClient.ts`, passing the keyword.
    -   `twitterClient.ts` uses the `twitter-api-v2` library to send a search request to the X API.
    -   The API query will be optimized to exclude noise, using parameters like `-is:retweet` and specifying a language (e.g., `lang:en`).

3.  **Process & Clean Data**
    -   The raw list of tweets is passed from `index.ts` to `core/tweetProcessor.ts`.
    -   The `tweetProcessor.ts` module performs the following actions:
        -   **Deduplication**: Uses a `Set` with tweet IDs to ensure each tweet is unique.
        -   **Filtering**: Applies additional filters to remove retweets or other unwanted content.
        -   **Formatting**: Extracts the core text from each tweet and compiles a clean list of strings.

4.  **AI Analysis**
    -   `index.ts` sends the cleaned list of tweet texts to `services/aiAnalyzer.ts`.
    -   `aiAnalyzer.ts` constructs a carefully engineered prompt to guide the AI. For example:
        > You are an expert social media trend analyst. Please analyze the following collection of tweets about "[keyword]". Identify the main discussion themes, the overall sentiment (positive/negative/neutral), and provide an executive summary of no more than 200 words.
        >
        > Tweet Collection:
        > - [Text of tweet 1]
        > - [Text of tweet 2]
        > - ...
    -   This prompt is then sent to the Gemini API.

5.  **Output Result**
    -   `aiAnalyzer.ts` receives the structured analysis from the Gemini API.
    -   `index.ts` formats this report and prints it to the console. To improve the user experience, status messages like "Fetching tweets..." and "AI analysis in progress..." will be displayed during the process.

## Next Steps

With this architecture approved, the next phase is to set up the project environment and begin implementing the modules, starting with the configuration and API clients.
