#!/bin/bash

# Load Seed Data Script
# This script loads seed data into the database after tables have been created by Spring Boot
# Run this after starting your Spring Boot application

set -e

echo "📦 Loading seed data into database..."
echo ""

# Check if MySQL container is running
if ! docker ps | grep -q jobportal-mysql; then
    echo "❌ MySQL container is not running. Please start it first with: docker-compose up -d mysql"
    exit 1
fi

# Wait for tables to exist (they're created by Spring Boot/Hibernate)
echo "1. Waiting for database tables to be created..."
MAX_ATTEMPTS=30
ATTEMPT=0
TABLES_EXIST=false

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if docker exec jobportal-mysql mysql -u jobportal_user -pjobportal_pass jobportal_db -e "SHOW TABLES LIKE 'users';" -s -N 2>/dev/null | grep -q "users"; then
        TABLES_EXIST=true
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    echo "   Waiting for tables... (attempt $ATTEMPT/$MAX_ATTEMPTS)"
    sleep 2
done

if [ "$TABLES_EXIST" = false ]; then
    echo "❌ Tables not found. Please ensure Spring Boot application has started and created the tables."
    echo "   Start your backend with: mvn spring-boot:run"
    exit 1
fi

echo "   ✅ Tables found"
echo ""

# Check if data already exists
echo "2. Checking existing data..."
USER_COUNT=$(docker exec jobportal-mysql mysql -u jobportal_user -pjobportal_pass jobportal_db -e "SELECT COUNT(*) FROM users;" -s -N 2>/dev/null | xargs || echo "0")
JOB_COUNT=$(docker exec jobportal-mysql mysql -u jobportal_user -pjobportal_pass jobportal_db -e "SELECT COUNT(*) FROM jobs;" -s -N 2>/dev/null | xargs || echo "0")

if [ "$USER_COUNT" -gt 0 ] || [ "$JOB_COUNT" -gt 0 ]; then
    echo "   ⚠️  Data already exists: $USER_COUNT users, $JOB_COUNT jobs"
    read -p "   Do you want to continue and potentially create duplicates? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "   Cancelled."
        exit 0
    fi
fi

# Fix schema issues (Hibernate may create columns with wrong types)
echo "3. Fixing schema issues..."
docker exec jobportal-mysql mysql -u jobportal_user -pjobportal_pass jobportal_db -e "ALTER TABLE jobs MODIFY COLUMN company_info TEXT;" 2>/dev/null || true
docker exec jobportal-mysql mysql -u jobportal_user -pjobportal_pass jobportal_db -e "ALTER TABLE jobs MODIFY COLUMN email VARCHAR(190) NULL, MODIFY COLUMN first_name VARCHAR(120) NULL, MODIFY COLUMN last_name VARCHAR(120) NULL;" 2>/dev/null || true
echo "   ✅ Schema fixes applied"

# Load seed data
echo "4. Loading seed data..."
LOAD_ERROR=$(docker exec -i jobportal-mysql mysql -u jobportal_user -pjobportal_pass jobportal_db < seed-data.sql 2>&1)
if echo "$LOAD_ERROR" | grep -q "ERROR"; then
    echo "   ❌ Error loading seed data:"
    echo "$LOAD_ERROR" | grep "ERROR" | head -3
    exit 1
fi
echo "   ✅ Seed data loaded"

# Verify data was loaded
echo "5. Verifying seed data..."
NEW_USER_COUNT=$(docker exec jobportal-mysql mysql -u jobportal_user -pjobportal_pass jobportal_db -e "SELECT COUNT(*) FROM users;" -s -N 2>/dev/null | xargs || echo "0")
NEW_JOB_COUNT=$(docker exec jobportal-mysql mysql -u jobportal_user -pjobportal_pass jobportal_db -e "SELECT COUNT(*) FROM jobs;" -s -N 2>/dev/null | xargs || echo "0")

echo ""
echo "📊 Database Status:"
echo "   Users: $NEW_USER_COUNT"
echo "   Jobs: $NEW_JOB_COUNT"
echo ""

if [ "$NEW_USER_COUNT" -ge 2 ] && [ "$NEW_JOB_COUNT" -ge 3 ]; then
    echo "✅ Seed data loaded successfully!"
    echo ""
    echo "📝 Test Users:"
    echo "   - employer@example.com / password123 (employer)"
    echo "   - candidate@example.com / password123 (candidate)"
else
    echo "⚠️  Warning: Expected 2+ users and 3+ jobs, but found $NEW_USER_COUNT users and $NEW_JOB_COUNT jobs"
fi

