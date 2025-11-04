#!/bin/sh
set -e

echo "Running database migrations..."
pnpm db:migrate

echo "Seeding database with initial data..."
pnpm seed:prod || echo "Seed failed or data already exists, continuing..."

echo "Starting application server..."
exec pnpm start
