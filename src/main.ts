// src/main.ts — Showcase skeleton
// Full implementation: github.com/ofoxai/lark-claude-bot

import { startWebSocket } from './lark'
import { startScheduler } from './scheduler'
import { recoverActiveSessions } from './handler'
import { loadConfig } from './config'

async function main() {
  const config = loadConfig()

  // Auto-recover active sessions from disk after restart
  setTimeout(() => recoverActiveSessions(), 5000)

  // Start cron scheduler (60s tick)
  startScheduler()

  // Connect to Lark WebSocket (no public IP required)
  await startWebSocket(config)
}

main().catch(console.error)
