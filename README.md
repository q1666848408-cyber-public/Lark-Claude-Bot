# Lark-Claude-Bot

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)

> **Showcase** — ~15% skeleton. Core implementation not included.

Feishu/Lark bot backed by Claude Code CLI. Named Marvin. Handles long-running tasks with real-time progress cards, persistent sessions, admin interrupts, and a cron scheduler.

Open-source community edition: [github.com/ofoxai/lark-claude-bot](https://github.com/ofoxai/lark-claude-bot)

## Stack

- TypeScript, Node.js
- Claude Code CLI
- Feishu (Lark) Bot API / Event Subscription

## Features

- Real-time progress cards updated in-place as tasks run
- Session persistence — conversations survive bot restarts
- Two-phase task pipeline: plan phase then execute phase
- Cron scheduler for recurring tasks
- Admin interrupt: send `@Marvin stop` to cancel a running task
- Auto self-repair: retries failed Claude CLI invocations with error context
- Security filter: strips API keys, tokens, and IP addresses from outbound messages

## Usage

```bash
npm install
cp .env.example .env   # Feishu App ID/Secret, Claude API key

npm run dev     # development with hot reload
npm run build
npm start
```

## Structure

```
Lark-Claude-Bot/
├── src/
│   ├── bot/           # Feishu event handlers
│   ├── claude/        # Claude Code CLI wrapper
│   ├── session/       # session persistence layer
│   ├── scheduler/     # cron task runner
│   ├── security/      # output sanitizer
│   └── cards/         # Feishu interactive card templates
├── .env.example
└── package.json
```

## Progress Card States

Tasks update a single Feishu card in place:

```
[planning]   Thinking about the task...
[running]    Step 2/5: fetching data...
[done]       Completed in 14s
[failed]     Error: ... (auto-retrying)
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `FEISHU_APP_ID` | Feishu app ID |
| `FEISHU_APP_SECRET` | Feishu app secret |
| `ANTHROPIC_API_KEY` | Claude API key |
| `ADMIN_USER_IDS` | comma-separated admin open IDs |
