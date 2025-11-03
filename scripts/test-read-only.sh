#!/bin/bash

# Script to test read-only middleware in production mode

echo "🧪 Testing Read-Only Middleware"
echo "================================"
echo ""

# Check if server is running
if ! curl -s http://localhost:3333/films > /dev/null 2>&1; then
  echo "❌ Server is not running on http://localhost:3333"
  echo "   Please start the server first:"
  echo "   NODE_ENV=production pnpm dev"
  exit 1
fi

echo "✅ Server is running"
echo ""

# Test GET request (should work)
echo "📖 Test 1: GET /films (should work)"
GET_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:3333/films)
GET_STATUS=$(echo "$GET_RESPONSE" | tail -n1)

if [ "$GET_STATUS" = "200" ]; then
  echo "   ✅ GET request successful (200 OK)"
else
  echo "   ❌ GET request failed (Status: $GET_STATUS)"
fi
echo ""

# Test POST request (should be blocked if NODE_ENV=production)
echo "📝 Test 2: POST /films (should be blocked in production)"
POST_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3333/films \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Film",
    "episode_id": 99,
    "opening_crawl": "Test",
    "director": "Test",
    "producer": "Test",
    "release_date": "2024-01-01"
  }')
POST_BODY=$(echo "$POST_RESPONSE" | head -n-1)
POST_STATUS=$(echo "$POST_RESPONSE" | tail -n1)

echo "   Status Code: $POST_STATUS"

if [ "$POST_STATUS" = "405" ]; then
  echo "   ✅ POST correctly blocked (405 Method Not Allowed)"
  echo "   Response: $(echo $POST_BODY | jq -r '.error' 2>/dev/null || echo $POST_BODY)"
elif [ "$POST_STATUS" = "201" ]; then
  echo "   ⚠️  POST was allowed (201 Created)"
  echo "   This is expected in development mode (NODE_ENV=development)"
else
  echo "   ❌ Unexpected status code: $POST_STATUS"
  echo "   Response: $POST_BODY"
fi
echo ""

# Test PUT request (should be blocked if NODE_ENV=production)
echo "✏️  Test 3: PUT /films/1 (should be blocked in production)"
PUT_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT http://localhost:3333/films/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}')
PUT_STATUS=$(echo "$PUT_RESPONSE" | tail -n1)

echo "   Status Code: $PUT_STATUS"

if [ "$PUT_STATUS" = "405" ]; then
  echo "   ✅ PUT correctly blocked (405 Method Not Allowed)"
elif [ "$PUT_STATUS" = "200" ] || [ "$PUT_STATUS" = "404" ]; then
  echo "   ⚠️  PUT was allowed (Status: $PUT_STATUS)"
  echo "   This is expected in development mode"
else
  echo "   ❌ Unexpected status code: $PUT_STATUS"
fi
echo ""

# Test DELETE request (should be blocked if NODE_ENV=production)
echo "🗑️  Test 4: DELETE /films/1 (should be blocked in production)"
DELETE_RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE http://localhost:3333/films/1)
DELETE_STATUS=$(echo "$DELETE_RESPONSE" | tail -n1)

echo "   Status Code: $DELETE_STATUS"

if [ "$DELETE_STATUS" = "405" ]; then
  echo "   ✅ DELETE correctly blocked (405 Method Not Allowed)"
elif [ "$DELETE_STATUS" = "204" ] || [ "$DELETE_STATUS" = "404" ]; then
  echo "   ⚠️  DELETE was allowed (Status: $DELETE_STATUS)"
  echo "   This is expected in development mode"
else
  echo "   ❌ Unexpected status code: $DELETE_STATUS"
fi
echo ""

# Summary
echo "================================"
echo "📊 Summary"
echo "================================"
echo ""

if [ "$POST_STATUS" = "405" ] && [ "$PUT_STATUS" = "405" ] && [ "$DELETE_STATUS" = "405" ]; then
  echo "✅ Read-only mode is ACTIVE (Production)"
  echo "   - GET requests: Allowed"
  echo "   - POST/PUT/DELETE: Blocked"
  echo ""
  echo "Your API is correctly configured for production!"
elif [ "$POST_STATUS" = "201" ] || [ "$POST_STATUS" = "404" ] || [ "$PUT_STATUS" = "200" ] || [ "$DELETE_STATUS" = "204" ]; then
  echo "⚠️  Write operations are ALLOWED (Development)"
  echo "   - GET requests: Allowed"
  echo "   - POST/PUT/DELETE: Allowed"
  echo ""
  echo "This is expected in development mode."
  echo "To test production mode:"
  echo "  1. Stop the server"
  echo "  2. Run: NODE_ENV=production pnpm dev"
  echo "  3. Run this script again"
else
  echo "❌ Unexpected behavior detected"
  echo "   Please check your configuration"
fi
echo ""
