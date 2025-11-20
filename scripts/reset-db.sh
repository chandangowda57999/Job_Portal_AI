#!/bin/bash

# Reset Database Script
# This script resets the database by removing the volume and restarting MySQL
# 
# NOTE: Seed data is NOT loaded automatically because tables are created by 
# Spring Boot/Hibernate, not during MySQL initialization. After running this 
# script and starting Spring Boot, run: ./scripts/load-seed-data.sh

set -e

echo "🔄 Resetting Job Portal database..."
echo ""

# Stop and remove MySQL container
echo "1. Stopping MySQL container..."
docker-compose down mysql 2>/dev/null || true

# Remove the database volume (WARNING: This deletes all data!)
echo "2. Removing database volume..."
docker volume rm jobsearchai_mysql_data 2>/dev/null || echo "   Volume doesn't exist (first time setup)"

# Start MySQL container (will automatically run seed-data.sql)
echo "3. Starting MySQL container with fresh database..."
docker-compose up -d mysql

# Wait for MySQL to be ready
echo "4. Waiting for MySQL to be ready..."
sleep 10

# Check if MySQL is running
echo "5. Checking MySQL status..."
if docker ps | grep -q jobportal-mysql; then
    echo "   ✅ MySQL container is running"
else
    echo "   ❌ MySQL container failed to start"
    exit 1
fi

# Wait a bit more for initialization
echo "6. Waiting for database initialization..."
sleep 10

# Verify seed data
echo "7. Verifying seed data..."
# Try multiple times to get the count (database might still be initializing)
USER_COUNT=0
JOB_COUNT=0
for i in 1 2 3 4 5; do
    # Get counts using MySQL's -N flag (no column names) and -s flag (silent)
    USER_RESULT=$(docker exec jobportal-mysql mysql -u jobportal_user -pjobportal_pass jobportal_db -e "SELECT COUNT(*) FROM users;" -s -N 2>/dev/null | xargs)
    JOB_RESULT=$(docker exec jobportal-mysql mysql -u jobportal_user -pjobportal_pass jobportal_db -e "SELECT COUNT(*) FROM jobs;" -s -N 2>/dev/null | xargs)
    
    # Validate that results are numeric and assign
    if [ -n "$USER_RESULT" ] && [ "$USER_RESULT" -eq "$USER_RESULT" ] 2>/dev/null; then
        USER_COUNT=$USER_RESULT
    fi
    if [ -n "$JOB_RESULT" ] && [ "$JOB_RESULT" -eq "$JOB_RESULT" ] 2>/dev/null; then
        JOB_COUNT=$JOB_RESULT
    fi
    
    # If we got valid counts, break
    if [ "$USER_COUNT" -ge 0 ] 2>/dev/null && [ "$JOB_COUNT" -ge 0 ] 2>/dev/null; then
        break
    fi
    
    if [ $i -lt 5 ]; then
        echo "   Waiting for database to be ready... (attempt $i/5)"
        sleep 3
    fi
done

echo ""
echo "📊 Database Status:"
echo "   Users: $USER_COUNT"
echo "   Jobs: $JOB_COUNT"
echo ""

# Check if we have valid integer values before comparing
if [ "$USER_COUNT" -ge 2 ] 2>/dev/null && [ "$JOB_COUNT" -ge 3 ] 2>/dev/null; then
    echo "✅ Database reset successful! Seed data loaded."
    echo ""
    echo "📝 Test Users:"
    echo "   - employer@example.com / password123 (employer)"
    echo "   - candidate@example.com / password123 (candidate)"
    echo ""
    echo "💼 Test Jobs:"
    echo "   - Senior Software Engineer (Tech Corp)"
    echo "   - Frontend Developer (Web Solutions Inc)"
    echo "   - DevOps Engineer (Cloud Systems)"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Start your backend: mvn spring-boot:run"
    echo "   2. Wait for Spring Boot to create tables, then load seed data:"
    echo "      ./scripts/load-seed-data.sh"
    echo "   3. Start your frontend: cd frontend && npm run dev"
    echo "   4. Open http://localhost:8082/search to see jobs"
else
    echo "⚠️  Note: Tables are created by Spring Boot/Hibernate, not during MySQL initialization."
    echo "   Expected 2+ users and 3+ jobs, but found $USER_COUNT users and $JOB_COUNT jobs"
    echo ""
    echo "   This is normal! Follow these steps:"
    echo "   1. Start your backend: mvn spring-boot:run"
    echo "   2. Wait for Spring Boot to start and create tables"
    echo "   3. Run: ./scripts/load-seed-data.sh"
    echo ""
    echo "   You can check MySQL logs with: docker logs jobportal-mysql"
fi

