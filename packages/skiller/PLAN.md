# Skill Evaluation & Optimization Layer — Plan

## 🎯 Objective

Add an **evaluation and optimization layer** to `@medyll/skiller` without breaking existing functionality.

---

## 1. Updated Architecture (Non-Breaking)

The project structure remains intact, adding a hidden `.skiller/` directory for runtime evaluation data.

```
packages/skiller/
├── lib/skill/skiller/SKILL.md    # Existing entry point (updated)
├── src/
│   ├── cli/
│   │   ├── create-skill.js       # Existing (Updated to add test suites)
│   │   ├── test-skill.js         # NEW: The evaluator engine
│   │   └── view-report.js        # NEW: Chrome trigger
│   ├── core/
│   │   ├── evaluator/            # Logic for multi-model testing
│   │   └── reporter/             # HTML template generator
│   ├── index.mjs                 # Updated exports
│   ├── cli.mjs                   # Updated with new commands
│   └── registry.json             # Targets config
├── .skiller/                     # NEW: Runtime data (git-ignored)
│   └── sessions/                 # Evaluation logs & HTML reports
└── package.json                  # Updated dependencies
```

---

## 2. Extended CLI Commands

| Command | Action | Collision Check |
|:--------|:-------|:----------------|
| `create-skill` | Now generates `SKILL.md` **AND** `test-suite.json` | ✅ Extension of existing behavior |
| `test-skill` | Executes the skill against the `test-suite.json` | ✅ **New** |
| `report` | Opens the last evaluation in Chrome | ✅ **New** |
| `optimize` | LLM analyzes test failures and suggests `SKILL.md` edits | ✅ **New** |

---

## 3. Implementation Phases

### Phase 1: The Test Suite Schema

Modify `create-skill` to include a standard `test-suite.json` in the package root or `lib/skill/<pkg>/`.

```json
{
  "skill": "my-pkg",
  "version": "1.0.0",
  "cases": [
    {
      "id": "case-001",
      "name": "Basic Functionality",
      "input": "How do I use this package?",
      "expectations": ["contains installation steps", "shows core API"],
      "assertions": { 
        "min_length": 100, 
        "format": "markdown",
        "required_keywords": ["install", "usage"]
      }
    },
    {
      "id": "case-002",
      "name": "Advanced Usage",
      "input": "Can you show me an example with options?",
      "expectations": ["shows code example", "explains parameters"],
      "assertions": { 
        "min_length": 200,
        "contains_code": true
      }
    }
  ],
  "models": ["claude", "qwen", "ollama"],
  "settings": {
    "timeout": 30000,
    "parallel": true
  }
}
```

---

### Phase 2: The Multi-Model Evaluator (`test-skill.js`)

Instead of native sub-agents, use an **Orchestrator** to handle different LLMs:

#### 2.1 Adapter Layer
Use a lightweight bridge to send prompts to Claude, Qwen, or local LLMs:

```javascript
// src/core/evaluator/adapters/
├── base.js          # Base adapter interface
├── claude.js        # Anthropic Claude API
├── qwen.js          # Alibaba Qwen/DashScope API
├── ollama.js        # Local Ollama/vLLM endpoints
└── openai.js        # OpenAI-compatible APIs
```

#### 2.2 Context Injection
The script reads `SKILL.md`, prepends it to the user message as a `system` prompt, and sends it to the target model:

```javascript
const systemPrompt = `You are an AI assistant. Follow these instructions:
${skillMdContent}

---
User question:`;
```

#### 2.3 Parallelism
Use `Promise.all` to run multiple test cases simultaneously to simulate sub-agent speed:

```javascript
const results = await Promise.all(
  testCases.map(tc => runTestCase(tc, model, skillMd))
);
```

#### 2.4 Scoring System
Each test case produces a score:

```javascript
{
  "caseId": "case-001",
  "model": "claude",
  "passed": true,
  "score": 0.85,
  "response": "...",
  "assertions": {
    "min_length": { "passed": true, "value": 250 },
    "format": { "passed": true, "value": "markdown" },
    "required_keywords": { "passed": true, "found": ["install", "usage"] }
  },
  "duration_ms": 1250
}
```

---

### Phase 3: Visual Feedback (`view-report.js`)

#### 3.1 JSON Export
`test-skill` saves a `results-[timestamp].json` in `.skiller/sessions/`:

```
.skiller/sessions/
├── results-20260331-194500.json
├── results-20260331-194500.html
└── latest.json -> results-20260331-194500.json
```

#### 3.2 HTML Render
A script injects this JSON into a pre-compiled Tailwind static template:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Skill Evaluation Report</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="app"></div>
  <script>
    const results = {{RESULTS_JSON}};
    // Render dashboard
  </script>
</body>
</html>
```

#### 3.3 Chrome Trigger
```javascript
import { exec } from 'child_process';
import os from 'os';

const platform = os.platform();
const openCmd = platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open';
exec(`${openCmd} .skiller/sessions/latest_report.html`);
```

---

### Phase 4: Integration into `SKILL.md`

Update `skiller/lib/skill/skiller/SKILL.md` to include new capabilities:

```markdown
### Evaluate a skill
# Run tests defined in test-suite.json
npx @medyll/skiller test-skill

# Run with specific model
npx @medyll/skiller test-skill --model claude

# Run specific test case
npx @medyll/skiller test-skill --case case-001

# View visual results in browser
npx @medyll/skiller report

### Optimize a skill
# Use AI to refine instructions based on test failures
npx @medyll/skiller optimize --skill my-package

# Optimize with specific model
npx @medyll/skiller optimize --skill my-package --model qwen
```

---

## 4. Multi-Model Environment (Environment Mocking)

To ensure compatibility with Qwen, Codex, etc., `skiller` will:

### 4.1 Normalize Prompts
Transform the system/user/assistant messages based on the detected provider:

```javascript
// Claude format
{
  "system": "...",
  "messages": [{ "role": "user", "content": "..." }]
}

// Qwen/DashScope format
{
  "input": {
    "messages": [
      { "role": "system", "content": "..." },
      { "role": "user", "content": "..." }
    ]
  }
}

// Ollama format
{
  "model": "qwen2.5",
  "messages": [...],
  "stream": false
}
```

### 4.2 Stateless Execution
Each test case creates a fresh API session (no history) to ensure the `SKILL.md` instructions are the only source of truth.

### 4.3 Local Testing
Support `Ollama` or `vLLM` endpoints for users running "OpenCode" or "Qwen" locally without sub-agent support:

```json
{
  "models": [
    {
      "name": "local-qwen",
      "adapter": "ollama",
      "endpoint": "http://localhost:11434",
      "model": "qwen2.5:7b"
    }
  ]
}
```

---

## 5. Dependencies

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.30.0",
    "openai": "^4.28.0",
    "node-fetch": "^3.3.2",
    "commander": "^14.0.3",
    "handlebars": "^4.7.8"
  },
  "devDependencies": {
    "@types/node": "^20.0.0"
  }
}
```

---

## 6. File Checklist

### New Files to Create

| File | Purpose |
|------|---------|
| `src/cli/test-skill.js` | CLI command for running evaluations |
| `src/cli/view-report.js` | CLI command for opening reports |
| `src/cli/optimize.js` | CLI command for AI-powered optimization |
| `src/core/evaluator/index.js` | Main evaluator orchestrator |
| `src/core/evaluator/adapters/base.js` | Base adapter interface |
| `src/core/evaluator/adapters/claude.js` | Claude API adapter |
| `src/core/evaluator/adapters/qwen.js` | Qwen/DashScope adapter |
| `src/core/evaluator/adapters/ollama.js` | Ollama local adapter |
| `src/core/reporter/index.js` | HTML report generator |
| `src/core/reporter/template.html` | Tailwind HTML template |
| `src/test-suite-schema.json` | JSON Schema for test suites |

### Modified Files

| File | Changes |
|------|---------|
| `src/cli.mjs` | Add `test-skill`, `report`, `optimize` commands |
| `src/index.mjs` | Export new functions |
| `src/create-skill.js` | Generate `test-suite.json` template |
| `lib/skill/skiller/SKILL.md` | Document new commands |
| `package.json` | Add new dependencies |
| `.gitignore` | Add `.skiller/` to ignore list |

---

## 7. Usage Flow

### Creating a Skill with Tests

```bash
cd packages/my-package
npx @medyll/skiller create-skill --name my-package --description "..."
# Creates:
#   - lib/skill/my-package/SKILL.md
#   - lib/skill/my-package/test-suite.json
```

### Running Evaluation

```bash
# Run all tests on all configured models
npx @medyll/skiller test-skill

# Run with specific model
npx @medyll/skiller test-skill --model claude

# Run specific test case
npx @medyll/skiller test-skill --case case-001

# Run in parallel mode
npx @medyll/skiller test-skill --parallel
```

### Viewing Results

```bash
# Open latest report in browser
npx @medyll/skiller report

# Open specific report
npx @medyll/skiller report --session 20260331-194500
```

### Optimizing

```bash
# Auto-optimize based on failures
npx @medyll/skiller optimize --skill my-package

# Review suggestions before applying
npx @medyll/skiller optimize --skill my-package --dry-run
```

---

## 8. Environment Variables

```bash
# Claude (Anthropic)
export ANTHROPIC_API_KEY="..."

# Qwen (Alibaba DashScope)
export DASHSCOPE_API_KEY="..."

# Ollama (Local)
export OLLAMA_HOST="http://localhost:11434"

# OpenAI-compatible
export OPENAI_API_KEY="..."
export OPENAI_BASE_URL="https://api.openai.com/v1"
```

---

## 9. Success Criteria

| Criterion | Target |
|-----------|--------|
| Non-breaking | All existing commands work unchanged |
| Multi-model | Support Claude, Qwen, Ollama out of the box |
| Parallel execution | 10 test cases in < 30 seconds |
| Visual reports | HTML dashboard with pass/fail + scores |
| Optimization | AI suggestions improve scores by 20%+ |

---

## 10. Timeline Estimate

| Phase | Effort | Priority |
|-------|--------|----------|
| Phase 1: Test Suite Schema | 2h | 🔴 High |
| Phase 2: Evaluator Core | 8h | 🔴 High |
| Phase 3: Visual Reports | 4h | 🟠 Medium |
| Phase 4: Optimization | 6h | 🟢 Low |
| Documentation | 2h | 🟠 Medium |

**Total:** ~22 hours

---

## 11. Next Steps

1. **Validate this plan** — Confirm architecture and commands
2. **Phase 1** — Create test suite schema and update `create-skill`
3. **Phase 2** — Build evaluator adapters (Claude first, then others)
4. **Phase 3** — Create HTML reporter
5. **Phase 4** — Add optimization layer
6. **Test & Document** — Update SKILL.md with full examples
