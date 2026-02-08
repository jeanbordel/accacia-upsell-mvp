#!/bin/bash
# Apply Prisma migrations to Neon production database

set -e

echo "=== NEON MIGRATION DEPLOYMENT ==="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable not set"
  echo ""
  echo "Usage:"
  echo "  export DATABASE_URL='postgresql://user:pass@host.neon.tech/db?sslmode=require'"
  echo "  ./scripts/migrate-neon.sh"
  exit 1
fi

# Verify it's a Neon URL
if [[ ! "$DATABASE_URL" =~ neon\.tech ]]; then
  echo "⚠️  WARNING: DATABASE_URL does not contain 'neon.tech'"
  echo "Current URL: ${DATABASE_URL:0:50}..."
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo "✓ DATABASE_URL is set"
echo "  Host: $(echo $DATABASE_URL | sed -n 's/.*@\([^\/]*\).*/\1/p')"
echo ""

# Show pending migrations
echo "Checking for pending migrations..."
npx prisma migrate status || true
echo ""

# Prompt for confirmation
read -p "Apply migrations to production? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Migration cancelled"
  exit 0
fi

# Deploy migrations
echo ""
echo "Deploying migrations..."
npx prisma migrate deploy

echo ""
echo "✓ Migrations deployed successfully"

# Optional: Run seed if it exists
if [ -f "prisma/seed.js" ] || [ -f "prisma/seed.ts" ]; then
  read -p "Run database seed? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running seed..."
    npx prisma db seed
    echo "✓ Seed completed"
  fi
fi

echo ""
echo "=== DEPLOYMENT COMPLETE ==="
