#!/bin/bash
# Check if Prisma migrations have changed

set -e

CHANGED=false

# Check if schema.prisma has uncommitted changes
if git diff --exit-code prisma/schema.prisma > /dev/null 2>&1; then
  echo "✓ schema.prisma: no changes"
else
  echo "⚠ schema.prisma: CHANGED"
  CHANGED=true
fi

# Check if migrations folder has changes
if git diff --exit-code prisma/migrations/ > /dev/null 2>&1; then
  echo "✓ migrations/: no changes"
else
  echo "⚠ migrations/: CHANGED"
  CHANGED=true
fi

# Check for new migration folders (untracked)
if [ -n "$(git ls-files --others --exclude-standard prisma/migrations/)" ]; then
  echo "⚠ migrations/: NEW FILES DETECTED"
  CHANGED=true
fi

echo ""
if [ "$CHANGED" = true ]; then
  echo "MIGRATIONS_CHANGED=true"
  echo ""
  echo "ACTION REQUIRED:"
  echo "1. Commit the migration to git"
  echo "2. Apply to Neon: ./scripts/migrate-neon.sh"
  exit 1
else
  echo "MIGRATIONS_CHANGED=false"
  echo "✓ No migration changes detected"
  exit 0
fi
