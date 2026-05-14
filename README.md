# Lark-Claude-Bot

> **⚠️ Showcase Repository** — Core implementation not included. This demonstrates the architecture and design decisions. The open-source version is at [github.com/ofoxai/lark-claude-bot](https://github.com/ofoxai/lark-claude-bot).

A **Feishu / Lark bot** framework powered by **Claude Code CLI** — real-time progress cards, session persistence, cron scheduling, auto self-repair, and API key security filter.

Named after Marvin, the paranoid android from *The Hitchhiker's Guide to the Galaxy*: deeply unimpressed by everything, yet terrifyingly capable.

---

## Architecture

```
                  ┌──────────────────────┐
                  │    Claude Code CLI   │
                  └──┬───────────────┬───┘
                     │               │
              prompt │    stream     │ events
                     │               │
  ┌──────────┐   ┌───┴───────────────┴───┐   ┌──────────┐
  │   Lark   │──▶│       handler.ts      │──▶│ Progress │
  │ WebSocket│   └───────────────────────┘   │   Card   │
  └──────────┘               ▲               └──────────┘
                             │
                    ┌────────┴────────┐
                    │  Cron Scheduler │
                    │   tasks.json    │
                    └─────────────────┘
```

## Source Structure

```
src/
├── main.ts          # Entry: WebSocket + scheduler + auto-recover
├── config.ts        # Environment variables and paths
├── handler.ts       # Message routing, progress cards, interruption recovery
├── claude.ts        # Claude Code CLI wrapper (stream-json, activity timeout)
├── lark.ts          # Lark API: send text / card / progress card / reaction
├── scheduler.ts     # Cron engine: 60s tick, expression matching, execution lock
├── taskExecutor.ts  # Two-phase pipeline: execute → summarize (+ auto-repair)
├── taskCommands.ts  # Task list injection into Claude context
├── chatStore.ts     # JSONL message persistence (per-group storage)
├── memory.ts        # Conversation history + memory update instructions
├── safety.ts        # Output filtering + audit log
├── trigger.ts       # CLI tool: manually trigger a task
└── send.ts          # CLI tool: manually send a message
```

## Key Features

| Feature | Description |
|---------|-------------|
| **Real-time Progress Cards** | Live task list with ⬜→🔄→✅ status in group chat |
| **Session Persistence** | Sessions saved to disk, auto-recovered after restart |
| **Admin Interrupt** | Admin can interrupt mid-execution with full context recovery |
| **Cron Scheduler** | Standard 5-field cron, 60s resolution, jitter support |
| **Auto Self-Repair** | On failure: diagnose → classify → attempt fix |
| **Security Filter** | Strips API keys, tokens, internal IDs, private IPs from all output |
| **Multi-format Input** | Text, rich text, images, files — auto-downloaded for Claude |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Language | TypeScript |
| AI Backend | Claude Code CLI (`--print --output-format stream-json`) |
| Messaging | Lark WebSocket API (no public IP required) |
| Scheduling | Custom cron engine (60s tick) |
| Persistence | JSONL files (messages) + JSON (tasks) |

## Message Processing Flow

```
Lark WebSocket event
    → Dedup (in-memory Set, max 5000)
    → Store message (per-group JSONL)
    → Group message without @bot → skip
    → Concurrency check → admin can interrupt active task
    → Download images/files to /tmp/
    → Build context: recent messages + task list + history
    → Claude Code CLI (--print --output-format stream-json)
    → Push real-time progress card (task list + current action)
    → Security filter (strip keys, tokens, IDs, IPs)
    → Update progress card with final result
    → Fallback to plain text if card fails
```

## Cron Task Definition

```json
{
  "tasks": [
    {
      "id": "daily-report",
      "name": "Daily Report",
      "prompt": "Generate today's work summary...",
      "cron": "0 9 * * 1-5",
      "jitterMinutes": 5,
      "chatId": "oc_xxxx",
      "status": "active"
    }
  ]
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LARK_APP_ID` | ✅ | Lark App ID |
| `LARK_APP_SECRET` | ✅ | Lark App Secret |
| `LARK_ENCRYPT_KEY` | ❌ | Event encryption key |
| `LARK_DOMAIN` | ❌ | Set to `feishu` for China domain |
| `ADMIN_OPEN_ID` | ❌ | Admin open_id for interrupt control |
| `CLAUDE_TIMEOUT_MS` | ❌ | Claude idle timeout (default: 600000) |

---

*Open-source version: [github.com/ofoxai/lark-claude-bot](https://github.com/ofoxai/lark-claude-bot)*
