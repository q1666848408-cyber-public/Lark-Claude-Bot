// src/config.ts — Environment configuration
import path from 'path'

export function loadConfig() {
  return {
    appId:         process.env.LARK_APP_ID!,
    appSecret:     process.env.LARK_APP_SECRET!,
    encryptKey:    process.env.LARK_ENCRYPT_KEY ?? '',
    domain:        process.env.LARK_DOMAIN === 'feishu' ? 'feishu.cn' : 'larksuite.com',
    botName:       process.env.BOT_NAME ?? 'Marvin',
    adminOpenId:   process.env.ADMIN_OPEN_ID ?? '',
    claudeCwd:     process.env.CLAUDE_CWD ?? process.cwd(),
    timeoutMs:     Number(process.env.CLAUDE_TIMEOUT_MS ?? 600_000),
    idleTimeoutMs: Number(process.env.CLAUDE_IDLE_TIMEOUT_MS ?? 3_600_000),
    startupTimeoutMs: Number(process.env.CLAUDE_STARTUP_TIMEOUT_MS ?? 300_000),
    maxTurns:      Number(process.env.CLAUDE_MAX_TURNS ?? 200),
    dataDir:       path.join(process.cwd(), 'data'),
  }
}

export type Config = ReturnType<typeof loadConfig>
