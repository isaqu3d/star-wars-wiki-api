#!/bin/bash

# Script to setup test database using Docker
# This script assumes PostgreSQL is running in Docker

set -e  # Exit on error

echo "🧪 Setting up test database with Docker..."

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

# Extract database credentials from DATABASE_URL
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

CONTAINER_NAME="starwars-postgres-test"

echo "📝 Database configuration:"
echo "   Container: $CONTAINER_NAME"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""

# Check if container is running
echo "🔍 Checking if PostgreSQL container is running..."
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo -e "${RED}✗${NC} Container $CONTAINER_NAME is not running"
  echo "   Starting container..."
  docker compose -f docker-compose.test.yml up -d
  echo "   Waiting for PostgreSQL to be ready..."
  sleep 5
fi
echo -e "${GREEN}✓${NC} Container is running"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec $CONTAINER_NAME pg_isready -U postgres > /dev/null 2>&1; do
  echo "   Waiting..."
  sleep 1
done
echo -e "${GREEN}✓${NC} PostgreSQL is ready"

# Check if database exists
echo "🔍 Checking if database exists..."
DB_EXISTS=$(docker exec $CONTAINER_NAME psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null || echo "")

if [ "$DB_EXISTS" = "1" ]; then
  echo -e "${YELLOW}⚠${NC}  Database '$DB_NAME' already exists"
  read -p "   Do you want to drop and recreate it? (y/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Dropping database '$DB_NAME'..."
    docker exec $CONTAINER_NAME psql -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null || true
    echo -e "${GREEN}✓${NC} Database dropped"
    DB_EXISTS=""
  fi
fi

# Create database if it doesn't exist
if [ -z "$DB_EXISTS" ]; then
  echo "🏗️  Creating database '$DB_NAME'..."
  docker exec $CONTAINER_NAME psql -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null
  echo -e "${GREEN}✓${NC} Database created"
fi

# Create user if it doesn't exist
echo "👤 Checking if user exists..."
USER_EXISTS=$(docker exec $CONTAINER_NAME psql -U postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" 2>/dev/null || echo "")

if [ -z "$USER_EXISTS" ]; then
  echo "👤 Creating user '$DB_USER'..."
  docker exec $CONTAINER_NAME psql -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "   User might already exist"
  echo -e "${GREEN}✓${NC} User configured"
fi

# Grant privileges
echo "🔐 Granting privileges..."
docker exec $CONTAINER_NAME psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || true
docker exec $CONTAINER_NAME psql -U postgres -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;" 2>/dev/null || true
docker exec $CONTAINER_NAME psql -U postgres -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;" 2>/dev/null || true
docker exec $CONTAINER_NAME psql -U postgres -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;" 2>/dev/null || true
echo -e "${GREEN}✓${NC} Privileges granted"

# Run migrations
echo "🚀 Running migrations..."
NODE_ENV=test DATABASE_URL=$DATABASE_URL pnpm db:migrate

echo ""
echo -e "${GREEN}✅ Test database setup complete!${NC}"
echo ""
echo "You can now run tests with:"
echo "  pnpm test                    # Run all tests"
echo "  pnpm test:watch              # Run tests in watch mode"
echo "  pnpm test:coverage           # Run tests with coverage"
echo ""
echo "Container management:"
echo "  pnpm docker:test:down        # Stop and remove container"
echo "  pnpm docker:test:logs        # View container logs"
