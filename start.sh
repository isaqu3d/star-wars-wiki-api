#!/bin/sh
set -e

echo "Running database migrations..."
pnpm db:migrate

echo "Starting application server..."
exec pnpm start
