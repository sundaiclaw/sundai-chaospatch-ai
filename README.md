# ChaosPatch AI

ChaosPatch AI converts release notes into failure drills, early warning checks, and a rollback gameplan using Compute Community LLMs.

## What it does
Paste a planned release/change log and get a concrete pre-deploy drill: top failure paths, detection signals, and a 30-minute mitigation plan.

## How to Run (from zero)
1. Prerequisites: Node.js 18+ and a Compute Community API key.
2. `git clone https://github.com/sundaiclaw/sundai-chaospatch-ai.git`
3. `cd sundai-chaospatch-ai`
4. `npm install`
5. `CC_API_KEY=... CC_BASE_URL=https://computecommunity.com/sundai-server/v1 CC_MODEL=MiniMaxAI/MiniMax-M2.5 npm start`
6. Open `http://localhost:3000`

## Limitations / known gaps
- Single prompt pass (no multi-agent debate yet)
- No persistent history/auth
- Assumes English release notes
