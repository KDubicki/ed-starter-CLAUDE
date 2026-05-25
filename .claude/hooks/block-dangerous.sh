#!/bin/bash
# .claude/hooks/block-dangerous.sh
set -u

INPUT=$(cat)

COMMAND=$(node -e '
const fs = require("fs");
const raw = fs.readFileSync(0, "utf8");
try {
  const payload = JSON.parse(raw || "{}");
  const cmd = payload?.tool_input?.command ?? payload?.command ?? "";
  process.stdout.write(String(cmd));
} catch {
  process.stdout.write("");
}
' <<<"$INPUT")

BLOCKLIST_PATTERN='rm\s+-rf|git\s+push\s+--force|git\s+reset\s+--hard|git\s+checkout\s+--|DROP\s+TABLE|TRUNCATE\s+TABLE'

if echo "$COMMAND" | grep -qiE "$BLOCKLIST_PATTERN"; then
  echo '{"permissionDecision":"deny","permissionDecisionReason":"Zablokowano niebezpieczna komende. Uzyj bezpieczniejszej alternatywy."}'
  exit 0
fi

exit 0