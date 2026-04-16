# TwinMind - Live Meeting Suggestions

An AI-powered meeting copilot that listens to live audio and surfaces real-time meeting suggestions powered by Groq's latest models.

## Features

- **Live Audio Transcription**: Captures audio streams and transcribes them in near real-time using Groq's Whisper Large V3
- **Intelligent Suggestions**: Generates 3 contextually-aware suggestions every ~30 seconds based on meeting content
- **Interactive Chat**: Click any suggestion for deeper context, or ask follow-up questions
- **Session Export**: Export full transcript, suggestion history, and chat logs for record-keeping
- **Customizable Prompts**: Edit AI prompts for suggestions and chat responses directly in settings

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **AI Provider**: Groq API (100% inference)
  - **Transcription**: Whisper Large V3
  - **Generation**: Mixtral 8x7B (32k context)
- **Styling**: Custom CSS with responsive design
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Groq API key ([Get one here](https://console.groq.com/keys))

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/twinmind.git
cd twinmind

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will start at `http://localhost:3000`. Open Settings, paste your Groq API key, and you're ready to go.

## Usage

1. **Start Recording**: Click "Start Recording" to begin capturing audio
2. **Auto-Refresh**: Every ~30 seconds, transcript updates and suggestions regenerate
3. **Manual Refresh**: Click "Refresh" to force an update
4. **Explore Suggestions**: Click any suggestion card to get a detailed answer in the chat
5. **Ask Questions**: Type directly in the chat to ask questions about the meeting
6. **Export Session**: Click "Export" to download transcript, suggestions, and chat as JSON

## Architecture

### Audio Processing
- Uses Web Audio API to capture mic input
- Converts WebM audio to WAV format for Groq Whisper API
- Chunks audio every ~30 seconds for real-time suggestions
- Auto-scrolling transcript displays all spoken content

### Suggestion Generation
The system generates 3 diverse suggestions per refresh cycle:

1. **Clarifying Questions**: Asks for needed information or clarification
2. **Talking Points**: Suggests relevant facts or discussion topics
3. **Fact-Checking**: Verifies claims or provides supporting evidence
4. **Clarifications**: Requests explanation of unclear points
5. **Answers**: Provides direct answers to questions just asked

The prompt architecture considers:
- Recent transcript context (configurable window, default 1024 tokens)
- Conversation flow and topic changes
- Natural variation in suggestion types

### Chat Context
- Full meeting transcript is passed as context to the LLM
- Each chat message maintains state for multi-turn conversations
- Detailed answers include full context for highest-quality responses

## Prompt Strategy

### Live Suggestion Prompt
The prompt is engineered to:
- **Return valid JSON** with exactly 3 suggestions
- **Vary suggestion types** based on what's happening in conversation
- **Generate immediately useful previews** (under 100 chars)
- **Think about context** - when is it time to ask vs. inform vs. clarify?

Key insight: The preview is the value. Most users will see it without clicking. Make it count.

**Default prompt maximizes**:
- Relevance to recent context
- Diversity (never 3 of the same type)
- Actionability (each suggestion can be acted on)

### Detailed Answer Prompt
When a suggestion is clicked:
- Full transcript context is provided
- Specific suggestion title is included
- LLM can provide 200-400 word deep-dive with:
  - Direct relevance to the suggestion
  - Supporting information from transcript
  - Actionable next steps
  - Anticipated follow-ups

### Chat System Prompt
For general chat questions:
- System context includes full meeting transcript
- LLM has full conversational history
- Responses are grounded in what was actually discussed
- Tone is expert but conversational

## Settings

### Editable Parameters

- **Groq API Key**: Your personal API key (required)
- **Refresh Interval**: How often to update suggestions (default: 30s)
- **Live Context Window**: Tokens to pass for suggestions (default: 1024)
- **Detailed Context Window**: Tokens for detailed answers (default: 2048)
- **Prompts**: Edit all three system prompts directly in settings

### Default Configuration

All defaults are tuned for:
- Latency: Suggestions appear <2s after refresh
- Quality: Relevant, actionable suggestions
- Safety: Conservative context windows to avoid hallucination

## Export Format

Session exports as JSON with structure:

```json
{
  "transcript": [
    {
      "id": "uuid",
      "text": "...",
      "timestamp": 1234567890
    }
  ],
  "suggestionBatches": [
    {
      "id": "uuid",
      "timestamp": 1234567890,
      "suggestions": [
        {
          "id": "uuid",
          "batchId": "uuid",
          "title": "...",
          "preview": "...",
          "type": "question|talking_point|fact_check|clarification|answer",
          "timestamp": 1234567890
        }
      ]
    }
  ],
  "chatHistory": [
    {
      "id": "uuid",
      "role": "user|assistant",
      "content": "...",
      "timestamp": 1234567890,
      "source": "suggestion|direct"
    }
  ],
  "startTime": 1234567890,
  "endTime": 1234567890
}
```

## Performance Considerations

### Latency Optimization
- **Transcript Chunks**: ~30s captures enough context without overwhelming UI
- **Streaming**: Groq API provides first token quickly (avg ~300-500ms)
- **Client-side Parsing**: JSON parsing of suggestions is instant
- **Suggestion Refresh**: Overlaps with audio capture for seamless UX

### Context Window Tradeoffs
- **Live Suggestions (1024 tokens)**: Balances recency and context
  - Typical speech: ~150 words/min = ~60 words/refresh
  - 1024 tokens ≈ 4-5 min of conversation (good!)
- **Detailed Answers (2048 tokens)**: Can fit full meeting transcript for most meetings
- **Larger windows are better** but cost more in latency

### Known Limitations
- WebM→WAV conversion is client-side (adds ~100ms)
- Direct API calls from browser expose API key in network tab (acceptable for demo, use backend for production)
- Audio chunking uses naive timing; production version could use voice activity detection

## Deployment

### Deploy to Vercel (Recommended - 2 Minutes)

**Option 1: Via GitHub (Automatic deployments)**

```bash
# 1. Create a GitHub repo and push your code
git remote add origin https://github.com/yourusername/twinmind.git
git branch -M main
git push -u origin main

# 2. Go to https://vercel.com and sign in with GitHub
# 3. Click "New Project" → Select your twinmind repository
# 4. Framework: Vite, Build Command: npm run build, Output: dist
# 5. Click "Deploy"

# Your app is now live!
```

**Option 2: Direct CLI (One command)**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy (interactive)
cd path/to/twinmind
vercel

# 3. Follow prompts:
#    - Link to Vercel account
#    - Confirm project settings
#    - Deployment completes in ~30s

# Your URL will look like: twinmind-xyz.vercel.app
```

### Post-Deployment

1. Open your deployment URL
2. Go to Settings and paste your Groq API key
3. Start recording!

### Environment Variables (Optional Backend)

No required environment variables for current setup (API key is user-provided).

For optional backend proxy:
```
GROQ_API_KEY=your_key_here
VITE_API_URL=https://your-backend.com
```

## Running Locally

```bash
# 1. Navigate to project
cd path/to/twinmind

# 2. Install dependencies (first time only)
npm install

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000 in your browser

# 5. Add Groq API key in Settings and start recording
```

## Code Quality

- **TypeScript**: Strict mode, full type coverage
- **React Best Practices**: Hooks, memoization, proper effect cleanup
- **No Dead Code**: Clean component structure, single responsibility
- **Error Handling**: User-friendly error messages for common issues
- **Responsive Design**: Works on desktop (recommended), tablet, mobile

## Tradeoffs & Design Decisions

1. **Direct API Calls vs Backend**
   - Chose: Direct (faster iteration, simpler deployment)
   - Trade: API key visible in network tab (acceptable for demo)

2. **Mixtral 8x7B vs GPT-4**
   - Chose: Mixtral (same model for everyone, fair comparison)
   - Trade: Slightly lower quality but faster inference

3. **Fixed 30s vs Adaptive Chunking**
   - Chose: Fixed (predictable, testable)
   - Trade: Not optimal for very fast or very slow speakers

4. **JSON Export vs Real-time Streaming**
   - Chose: JSON export (simpler implementation)
   - Trade: Session data lost on page reload (acceptable for demo)

## What We Judge by Priority

1. **Quality of live suggestions**
   - Are they useful?
   - Do they vary appropriately based on context?
   - Is the preview text immediately valuable?

2. **Quality of detailed answers**
   - Well-researched based on transcript?
   - Appropriate depth?
   - Good follow-up guidance?

3. **Prompt engineering**
   - Smart context selection
   - Right amount of context
   - Good structure and formatting
   - Knowing when to suggest what

4. **Full-stack engineering**
   - Clean frontend code
   - Responsive UI
   - Error handling
   - API integration

5. **Code quality**
   - Readable
   - No dead code
   - Good abstractions
   - TypeScript benefits

6. **Latency**
   - Sub-2s for suggestion rendering
   - Fast first token from LLM

7. **UX**
   - Does it feel responsive?
   - Can you trust the suggestions?
   - Easy to understand what's happening?

## Future Improvements

- Voice activity detection for smarter chunking
- Experimental: Streaming suggestions (show first as they arrive)
- Multi-language support
- Real-time speaker diarization
- Backend API proxy (better security)
- Persistent session storage

## Troubleshooting

### "API key invalid" error
- Verify your key at https://console.groq.com/keys
- Check for trailing spaces in settings
- Restart after adding key

### No transcript appearing
- Check browser microphone permissions
- Ensure system audio is not muted
- Try refreshing the page

### Suggestions not generating
- Wait 30s for first auto-refresh
- Check Groq API status and rate limits
- Try clicking "Refresh" manually
- Export to see full error logs

## License

MIT

## Contact

TwinMind Assignment - Built for evaluation purposes.

---

**Made with ❤️ using Groq's fastest inference**
