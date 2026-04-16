# Quick Start Guide - TwinMind Live Suggestions

## 30-Second Setup

### 1. Get Groq API Key (2 min)
- Visit https://console.groq.com/keys
- Click "Create API Key"
- Copy the key

### 2. Run Locally (3 min)
```bash
cd c:\Users\DeLL\OneDrive\Desktop\TwinMind
npm run dev
# Browser opens: http://localhost:3000
```

### 3. Configure (1 min)
- Open app in browser
- Settings popup appears
- Paste your Groq API key
- Click "Save Settings"

### 4. Test (5 min)
- Click "Start Recording" (blue button)
- Talk for 30 seconds about anything
- Wait for suggestions to appear (or click "Refresh")
- Click a suggestion to see detailed answer
- Type a follow-up question

**Total time: ~11 minutes to see it working!**

## What to Expect

### ✅ Working Features
- **Transcript**: Auto-appends spoken text (updated every 30s)
- **Live Suggestions**: 3 new suggestions appear every 30s
- **Suggestion Cards**: Shows short preview, type badge (question/talking-point/etc)
- **Chat on Click**: Clicking suggestion adds it to chat with detailed answer
- **Direct Chat**: Type questions to AI
- **Export**: Download full session as JSON with timestamps
- **Settings**: Edit all prompts, tune parameters

### 🎯 Prompt Quality Examples

**Live Suggestions** (from 30s of audio):
```
1. [Question] "Who's responsible for this?"
   Preview: "Clarify ownership before proceeding"
   
2. [Talking Point] "Similar case at Acme Corp"
   Preview: "Handled with 20% cost savings...
   
3. [Fact-Check] "Verify Q1 timeline"
   Preview: "Usually takes 6 weeks, not 4"
```

**Detailed Answer** (when you click suggestion):
```
Full response (200-400 words) with:
- Context from what was discussed
- Actionable next steps
- Related information
- Suggestions for follow-up
```

## Deployment Options

### Option A: Vercel (Recommended - 2 minutes)

```bash
# Already has git history!
git remote add origin https://github.com/your-username/twinmind.git
git push

# Go to https://vercel.com
# Click "New Project" → Select twinmind repo → Deploy
# 🎉 Your URL: twinmind-xxx.vercel.app
```

### Option B: Netlify

```bash
netlify deploy --prod --dir=dist
```

### Option C: GitHub Pages

Available at: `https://github.com/yourusername/twinmind`

## Testing Scenarios

### Scenario 1: Technical Meeting
```
Talk about: "We're thinking about migrating our database 
from MongoDB to PostgreSQL. Cost is about 50k, timeline 
is 8 weeks, but we might get 30% faster queries."

Expected suggestions:
- Question about team capacity
- Talking point on migration risks
- Clarification on success metrics
```

### Scenario 2: Customer Call
```
Talk about: "The customer complained about slow API 
response times. They're seeing 5-10 second latency, 
but we thought we fixed that last month."

Expected suggestions:
- Question about what changed since last month
- Fact-check on the performance metrics
- Suggestion to review recent deployments
```

### Scenario 3: Product Discussion
```
Talk about: "Should we support dark mode? Users keep 
asking for it. Probably takes 2-3 weeks for the team."

Expected suggestions:
- Question about user demand / priority
- Talking point about user retention
- Clarification on accessibility requirements
```

## Settings to Try

### Experiment 1: More Frequent Updates
```
Refresh Interval: 15000 (15 seconds)
→ More suggestions, less context per update
→ Better for fast-paced meetings
```

### Experiment 2: More Context
```
Live Context Window: 2048 (vs 1024 default)
→ Better for complex topics
→ Slight latency increase
```

### Experiment 3: Custom Prompts
```
Edit prompts in Settings to test different styles:
- More formal vs conversational tone
- More suggestions vs deeper dives
- Technical vs business focus
```

## Files to Review

For evaluation team:

1. **src/App.tsx**: Main app logic (audio capture, state management, API calls)
2. **src/services/promptService.ts**: Default prompts (the heart of quality!)
3. **src/services/groqService.ts**: Groq API integration
4. **README.md**: Full documentation and architecture
5. **src/types/index.ts**: Type definitions (TypeScript safety)

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| No mic permission | Check browser permissions for this site |
| "Invalid API key" | Verify key at groq.com and paste again |
| No suggestions | Wait 30s after recording starts, or click Refresh |
| Suggestions are slow | Check internet speed, try shorter context window |
| Chat not responding | Check Groq API status, verify API key quota |

## What We're Evaluating

1. **Suggestion Quality** (40%)
   - Are they relevant and useful?
   - Do they vary by context?
   - Is preview text immediately valuable?

2. **Answer Quality** (20%)
   - Well-researched using transcript?
   - Appropriate detail level?
   - Clear next steps?

3. **Prompt Engineering** (20%)
   - Smart context use?
   - Right amount of info?
   - Good structure?

4. **Code Quality** (10%)
   - Clean, readable TypeScript?
   - Good component design?
   - Error handling?

5. **UX Responsiveness** (10%)
   - Fast inference?
   - Polished interface?
   - Trustworthy feel?

## Feedback Loop

1. **Try the app** with your own meeting audio
2. **Export a session** (click Export button)
3. **Review the JSON** - see suggestions and responses
4. **Edit a prompt** in Settings and test again
5. **Notice the difference** in suggestion quality

Each prompt tweak affects the output. This is where the skill shows!

## Next: Deploy to a Public URL

To share with TwinMind team:

```bash
# Option 1: Vercel (fastest)
git push to GitHub
→ Deploy button in Vercel
→ 🎉 https://your-twinmind.vercel.app

# Option 2: Direct deployment
vercel --prod
→ 🎉 Instant live URL

# Option 3: Other platforms
netlify deploy --prod
fly deploy
```

Then share: **https://your-twinmind-url.vercel.app**

---

**Ready to impress?** Let's go! 🚀

Email/Notes for Evaluator:
```
Deployed at: [your URL]
GitHub: github.com/your-username/twinmind
API Key: Provide your own (secure!)
Test Scenarios: See below in exported JSON
```
