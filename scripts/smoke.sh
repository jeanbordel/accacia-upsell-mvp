#!/bin/bash
# Smoke tests for production deployment

set -e

APP_URL=${APP_URL:-"https://upsell.horecadepo.com"}

echo "=== SMOKE TESTS ==="
echo "Target: $APP_URL"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0

# Test function
test_endpoint() {
  local name=$1
  local path=$2
  local expected_code=${3:-200}
  
  echo -n "Testing $name ($path)... "
  
  response=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL$path" 2>&1)
  
  if [ "$response" = "$expected_code" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
  else
    echo -e "${RED}✗ FAIL${NC} (HTTP $response, expected $expected_code)"
    FAILED=$((FAILED + 1))
  fi
}

# Test JSON endpoint
test_json_endpoint() {
  local name=$1
  local path=$2
  
  echo -n "Testing $name ($path)... "
  
  response=$(curl -s "$APP_URL$path")
  http_code=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL$path")
  
  if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
    echo "  Response: $(echo $response | head -c 100)..."
  else
    echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
    FAILED=$((FAILED + 1))
  fi
}

# Run tests
echo "1. Core API Endpoints"
test_json_endpoint "Health Check" "/api/health"
test_json_endpoint "Version Info" "/api/version"
echo ""

echo "2. Public Pages"
test_endpoint "Landing Page" "/" 200
test_endpoint "Client Login" "/client-login" 200
test_endpoint "Demo Board" "/demo/bacolux-board" 200
echo ""

echo "3. Admin Pages (may redirect if not authenticated)"
test_endpoint "Admin Login" "/admin-login" 200
test_endpoint "Admin KPI" "/admin/kpi" 200,307
test_endpoint "Admin Orders" "/admin/orders" 200,307
test_endpoint "Admin Offers" "/admin/offers" 200,307
test_endpoint "Admin Hotels" "/admin/hotels" 200,307
echo ""

echo "4. API Routes"
test_endpoint "QR Code" "/api/qr?s=test" 302,400,404
test_endpoint "Checkout" "/api/checkout" 405,400
echo ""

# Summary
echo "=== RESULTS ==="
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed${NC}"
  exit 0
else
  echo -e "${RED}✗ $FAILED test(s) failed${NC}"
  exit 1
fi
