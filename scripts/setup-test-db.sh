#!/bin/bash

# Script to setup test database
# This script will create a test database and run migrations

set -e  # Exit on error

echo "🧪 Setting up test database..."

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
# Format: postgresql://user:password@host:port/database
DB_URL=$DATABASE_URL

# Extract database credentials
DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASSWORD=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DB_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "📝 Database configuration:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""

# Check if PostgreSQL is running
echo "🔍 Checking if PostgreSQL is running..."
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
  echo -e "${RED}✗${NC} PostgreSQL is not running on $DB_HOST:$DB_PORT"
  echo "   Please start PostgreSQL and try again"
  echo ""
  echo "   macOS: brew services start postgresql@14"
  echo "   Linux: sudo systemctl start postgresql"
  echo "   Docker: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:14"
  exit 1
fi
echo -e "${GREEN}✓${NC} PostgreSQL is running"

# Check if database already exists
echo "🔍 Checking if test database exists..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
  echo -e "${YELLOW}⚠${NC}  Database '$DB_NAME' already exists"
  read -p "   Do you want to drop and recreate it? (y/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Dropping database '$DB_NAME'..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
    echo -e "${GREEN}✓${NC} Database dropped"
  else
    echo "   Skipping database creation"
  fi
fi

# Create database if it doesn't exist
if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
  echo "🏗️  Creating database '$DB_NAME'..."
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
  echo -e "${GREEN}✓${NC} Database created"
fi

# Create user if it doesn't exist
echo "👤 Checking if user exists..."
USER_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U postgres -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" 2>/dev/null || echo "")
if [ -z "$USER_EXISTS" ]; then
  echo "👤 Creating user '$DB_USER'..."
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U postgres -d postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "   User might already exist or you need postgres superuser access"
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || echo "   Could not grant privileges"
  echo -e "${GREEN}✓${NC} User configured"
fi

# Run migrations
echo "🚀 Running migrations..."
NODE_ENV=test pnpm db:migrate

echo ""
echo -e "${GREEN}✅ Test database setup complete!${NC}"
echo ""
echo "You can now run tests with: pnpm test"
echo "To destroy the test database, run: pnpm db:test:teardown"
