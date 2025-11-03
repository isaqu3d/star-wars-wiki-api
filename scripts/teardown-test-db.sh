#!/bin/bash

# Script to teardown (destroy) test database

set -e  # Exit on error

echo "🧹 Tearing down test database..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load test environment variables
if [ -f .env.test ]; then
  export $(cat .env.test | grep -v '^#' | xargs)
  echo -e "${GREEN}✓${NC} Loaded .env.test"
else
  echo -e "${RED}✗${NC} .env.test file not found"
  exit 1
fi

# Parse DATABASE_URL
DB_URL=$DATABASE_URL
DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASSWORD=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DB_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "📝 Database to be dropped:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo ""

# Confirm deletion
echo -e "${YELLOW}⚠️  WARNING:${NC} This will permanently delete the test database!"
read -p "   Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "   Teardown cancelled"
  exit 0
fi

# Drop database
echo "🗑️  Dropping database '$DB_NAME'..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"

echo ""
echo -e "${GREEN}✅ Test database destroyed!${NC}"
echo ""
echo "To recreate it, run: pnpm db:test:setup"
