#!/bin/bash
# .claude/hooks/typecheck-after-edit.sh
set -u

MAX_ATTEMPTS=5
PROJECT_HASH=$(printf '%s' "$PWD" | shasum | awk '{print $1}')
COUNTER_FILE="/tmp/claude-typecheck-counter-${PROJECT_HASH}"

COUNT=0
if [ -f "$COUNTER_FILE" ]; then
  COUNT=$(cat "$COUNTER_FILE")
fi

if [ "$COUNT" -ge "$MAX_ATTEMPTS" ]; then
  rm -f "$COUNTER_FILE"
  exit 0
fi

NEXT_ATTEMPT=$((COUNT + 1))
echo "$NEXT_ATTEMPT" > "$COUNTER_FILE"

TYPECHECK_OUTPUT=$(npm run typecheck 2>&1)
TYPECHECK_EXIT=$?

if [ "$TYPECHECK_EXIT" -ne 0 ]; then
  ERRORS=$(echo "$TYPECHECK_OUTPUT" | tail -20)
  REASON="Typecheck failed (attempt ${NEXT_ATTEMPT}/${MAX_ATTEMPTS}). Last lines:\n${ERRORS}"
  node -e 'const reason = process.argv[1]; process.stdout.write(JSON.stringify({ decision: "block", reason }));' "$REASON"
  exit 0
fi

LINT_OUTPUT=$(npm run lint 2>&1)
LINT_EXIT=$?

if [ "$LINT_EXIT" -ne 0 ]; then
  ERRORS=$(echo "$LINT_OUTPUT" | tail -20)
  REASON="Lint failed (attempt ${NEXT_ATTEMPT}/${MAX_ATTEMPTS}). Last lines:\n${ERRORS}"
  node -e 'const reason = process.argv[1]; process.stdout.write(JSON.stringify({ decision: "block", reason }));' "$REASON"
  exit 0
fi

rm -f "$COUNTER_FILE"
exit 0