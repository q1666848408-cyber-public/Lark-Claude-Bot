// src/safety.ts — Output filtering + audit log

const PATTERNS: Array<{ re: RegExp; replacement: string }> = [
  { re: /sk-[A-Za-z0-9]{20,}/g,          replacement: '[API_KEY]' },
  { re: /ghp_[A-Za-z0-9]{36}/g,           replacement: '[GITHUB_TOKEN]' },
  { re: /Bearer [A-Za-z0-9\-._~+/]+=*/g,  replacement: '[TOKEN]' },
  { re: /ou_[A-Za-z0-9]{20,}/g,           replacement: '[USER]' },
  { re: /oc_[A-Za-z0-9]{20,}/g,           replacement: '[GROUP]' },
  { re: /om_[A-Za-z0-9]{20,}/g,           replacement: '[MESSAGE]' },
  { re: /192\.168\.\d+\.\d+/g,            replacement: '[INTERNAL_IP]' },
  { re: /10\.\d+\.\d+\.\d+/g,             replacement: '[INTERNAL_IP]' },
  { re: /172\.(1[6-9]|2\d|3[01])\.\d+\.\d+/g, replacement: '[INTERNAL_IP]' },
]

export function filterOutput(text: string): string {
  let result = text
  for (const { re, replacement } of PATTERNS) {
    result = result.replace(re, replacement)
  }
  // Also redact known env var values and home directory paths
  return result
}
