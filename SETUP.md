# Quick Setup Guide

## You're Almost Ready! 🎉

The dependencies are already installed. Here's what you need to do:

### 1. Add Your Anthropic API Key

Open the `.env` file and replace `your_api_key_here` with your actual Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
PORT=3000
```

**Don't have an API key?**
- Go to https://console.anthropic.com/
- Sign up or log in
- Navigate to API Keys
- Create a new key

### 2. Run the App

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3000
- Frontend app on http://localhost:5173

### 3. Open Your Browser

Navigate to **http://localhost:5173**

## What You Can Do

1. **Create Ideas**: Click "New Idea" to capture your creative thoughts
2. **Generate Content**: Transform ideas into warm, conversational written content
3. **Create Video Scripts**: Choose a platform (TikTok, Instagram, YouTube, LinkedIn)
4. **View Storyboards**: See detailed scene breakdowns with timelines

## GitHub Repository

Your code is already pushed to GitHub on branch:
`claude/personal-content-creation-app-01JVCDqCFpVjVt7P4wJJJ3Aq`

## Need Help?

The app uses:
- SQLite for local storage (automatically created)
- React + Vite for the frontend
- Node.js + Express for the backend
- Anthropic Claude API for AI content generation

Enjoy creating amazing content! 🚀
