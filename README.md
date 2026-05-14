<div align="center">

# 🤖 Lark Claude Bot

[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Claude Code](https://img.shields.io/badge/Claude_Code-CLI-D4A843?style=flat-square)](https://docs.anthropic.com/en/docs/claude-code)
[![Lark](https://img.shields.io/badge/Lark-WebSocket-00D6B9?style=flat-square&logo=bytedance&logoColor=white)](https://open.larksuite.com)

**Feishu / Lark bot powered by Claude Code CLI — real-time progress cards, session persistence, cron scheduling, and security filtering**

> ⚠️ **Showcase Only** — ~15% skeleton. Session recovery, cron engine internals & safety filter patterns not included.

</div>

---

## ✨ Overview

A production bot framework that lets Claude Code CLI operate inside a Feishu / Lark group chat. Named **Marvin** after the paranoid android from *The Hitchhiker's Guide to the Galaxy* — deeply unimpressed by everything, yet terrifyingly capable.

**Community edition (full source):** [github.com/ofoxai/lark-claude-bot](https://github.com/ofoxai/lark-claude-bot)

Core capabilities:

- **Real-time progress cards** — task list updates live in chat as Claude works (⬜ → 🔄 → ✅)
- **Session persistence** — sessions saved to disk, auto-recovered after restart
- **Admin interrupt** — admin can stop mid-execution; Claude resumes with full context
- **Cron scheduler** — standard 5-field cron, 60 s tick, jitter support
- **Auto self-repair** — on failure: diagnose → classify → attempt fix
- **Security filter** — strips API keys, tokens, internal IDs, private IPs from all output

---

## 🏗️ Architecture

```
  Lark WebSocket
       │
       ▼
  ┌─────────────────────────────────────────┐
  │              handler.ts                 │
  │  dedup → store → @-check → concurrency  │
  │  → download attachments → build context │
  └──────────────┬──────────────────────────┘
                 │
                 ▼
  ┌─────────────────────────────────────────┐
  │           Claude Code CLI               │
  │    --print --output-format stream-json  │
  └──────────────┬──────────────────────────┘
                 │ stream
                 ▼
  ┌─────────────────────────────────────────┐
  │  Progress card (real-time Lark update)  │
  │  → safety.ts (strip secrets)            │
  │  → final card / text fallback           │
  └─────────────────────────────────────────┘

  Independently:
  ┌────────────┐     ┌──────────────────────────┐
  │ Cron tick  │────►│ taskExecutor.ts           │
  │  (60 s)    │     │ execute → summarize       │
  └────────────┘     │ → auto-repair on failure  │
                     └──────────────────────────┘
```

---

## 📁 Structure

```
src/
├── main.ts          # entry: WebSocket + scheduler + auto-recover
├── config.ts        # env vars and paths
├── handler.ts       # message routing, progress cards, interruption
├── claude.ts        # Claude Code CLI wrapper (stream-json, timeouts)
├── lark.ts          # Lark API: send text / card / reaction
├── scheduler.ts     # cron engine: 60 s tick, expression matching
├── taskExecutor.ts  # two-phase pipeline: execute → summarize
├── taskCommands.ts  # task list injection into Claude context
├── chatStore.ts     # JSONL message persistence (per-group)
├── memory.ts        # conversation history + memory updates
├── safety.ts        # output filtering + audit log
├── trigger.ts       # CLI: manually trigger a task
└── send.ts          # CLI: manually send a message
```

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Language | TypeScript |
| AI backend | Claude Code CLI (`--output-format stream-json`) |
| Messaging | Lark WebSocket API |
| Scheduler | Custom cron engine (60 s tick) |
| Persistence | JSONL (messages) + JSON (tasks) |

---

<div align="center">
<sub>Showcase version · Community edition at github.com/ofoxai/lark-claude-bot</sub>
</div>
