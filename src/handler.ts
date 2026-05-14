// src/handler.ts — Message routing, progress cards, session persistence
// Showcase skeleton — core logic not included

import type { Config } from './config'

interface Session {
  chatId: string
  process: unknown  // Child process reference
  cardId: string    // Lark progress card message ID
  startedAt: number
}

const activeSessions = new Map<string, Session>()

export async function handleMessage(
  chatId: string,
  userId: string,
  content: string,
  config: Config
): Promise<void> {
  // 1. Check for admin interrupt on active session
  // 2. Build context (recent messages + task list + memory)
  // 3. Stream Claude Code CLI output
  // 4. Push real-time progress card updates
  // 5. Apply security filter on final output
  // 6. Update card with result (fallback to plain text)
  // Core implementation: github.com/ofoxai/lark-claude-bot
}

export async function recoverActiveSessions(): Promise<void> {
  // Load persisted session state from disk and resume
  // Core implementation: github.com/ofoxai/lark-claude-bot
}
