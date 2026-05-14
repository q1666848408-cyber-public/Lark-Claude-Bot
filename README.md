# Lark-Claude-Bot

> ⚠️ Showcase Only — Core implementation not included.

**Marvin** is a Feishu/Lark bot framework that wires the [Claude Code CLI](https://github.com/anthropics/claude-code) into a group-chat-native task runner. It turns any Lark conversation into a persistent, observable, self-repairing AI agent.

The name is a nod to Marvin the Paranoid Android from *The Hitchhiker's Guide to the Galaxy*.

A community open-source version is maintained at [github.com/ofoxai/lark-claude-bot](https://github.com/ofoxai/lark-claude-bot).

---

## How It Works

```
Lark user message
       │
       ▼
  WebSocket listener  (lark.ts)
       │
       ▼
  Message handler     (handler.ts)
       │  ┌─────────────────────────────────────┐
       ▼  ▼                                     │
  Task executor       (taskExecutor.ts)         │
       │                                        │
       ▼                                        │
  Claude Code CLI     (claude.ts)               │ self-repair
       │                                        │ loop
       ▼                                        │
  Safety filter       (safety.ts) ─────────────┘
       │
       ▼
  Progress card update (lark.ts / send.ts)
       │
       ▼
  Lark card / plain text reply
```

## Key Features

### Real-Time Progress Cards
Task state is surfaced live in the chat thread:

| State | Indicator |
|---|---|
| Queued | ⬜ |
| Running | 🔄 |
| Done | ✅ |
| Failed | ❌ |

### Session Persistence
Conversation context is serialized to disk (`chatStore.ts`, `memory.ts`), surviving process restarts without losing thread continuity.

### Admin Controls
Admins can interrupt a running task mid-execution and trigger a clean recovery path, preventing runaway jobs.

### Cron Scheduler
A built-in scheduler (`scheduler.ts`) fires on a 60-second tick and accepts standard 5-field cron expressions for recurring tasks.

### Two-Phase Pipeline
Every task goes through:
1. **Execute** — Claude Code CLI performs the work.
2. **Summarize** — A second pass condenses output to a human-readable summary card.

### Auto Self-Repair
On failure, the executor automatically retries with additional context before surfacing the error to the user.

### Security Filter
`safety.ts` scrubs all Claude output before it reaches Lark — stripping API keys, bearer tokens, and IP addresses regardless of where they appear in the response.

## Source Structure

```
src/
├── main.ts            # Entry point, process lifecycle
├── config.ts          # Env vars and runtime config
├── handler.ts         # Incoming message routing
├── claude.ts          # Claude Code CLI wrapper
├── lark.ts            # Lark WebSocket client + card renderer
├── send.ts            # Outbound message helpers
├── scheduler.ts       # Cron scheduler (60s tick)
├── taskExecutor.ts    # Execute → summarize pipeline
├── taskCommands.ts    # Built-in slash commands
├── chatStore.ts       # Per-thread session storage
├── memory.ts          # Long-term memory layer
├── safety.ts          # Output security filter
└── trigger.ts         # Event trigger definitions
```

## Stack

| Component | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Language | TypeScript |
| AI engine | `@anthropic-ai/claude-code` (Claude Code CLI) |
| Chat platform | Feishu / Lark (WebSocket API) |

## Status

This repository showcases the architecture and design of the Marvin bot framework. The full production source is internal. See [github.com/ofoxai/lark-claude-bot](https://github.com/ofoxai/lark-claude-bot) for the open-source community edition.
