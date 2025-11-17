#!/bin/bash

# Reset Database Script
# This script resets the database by removing the volume and restarting MySQL
# This will automatically run seed-data.sql when MySQL initializes

set -e

echo "🔄 Resetting Job Portal database..."
echo ""

# Stop and remove MySQL container
echo "1. Stopping MySQL container..."
docker-compose down mysql 2>/dev/null || true

# Remove the database volume (WARNING: This deletes all data!)
echo "2. Removing database volume..."
docker volume rm jobportalai_mysql_data 2>/dev/null || echo "   Volume doesn't exist (first time setup)"

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
sleep 5

# Verify seed data
echo "7. Verifying seed data..."
USER_COUNT=$(docker exec jobportal-mysql mysql -u jobportal_user -pjobportal_pass jobportal_db -e "SELECT COUNT(*) FROM users;" -s 2>/dev/null | tail -1)
JOB_COUNT=$(docker exec jobportal-mysql mysql -u jobportal_user -pjobportal_pass jobportal_db -e "SELECT COUNT(*) FROM jobs;" -s 2>/dev/null | tail -1)

echo ""
echo "📊 Database Status:"
echo "   Users: $USER_COUNT"
echo "   Jobs: $JOB_COUNT"
echo ""

if [ "$USER_COUNT" -ge 2 ] && [ "$JOB_COUNT" -ge 3 ]; then
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
    echo "   2. Start your frontend: cd frontend && npm run dev"
    echo "   3. Open http://localhost:8082/search to see jobs"
else
    echo "⚠️  Warning: Expected 2+ users and 3+ jobs, but found $USER_COUNT users and $JOB_COUNT jobs"
    echo "   Database may still be initializing. Wait a few seconds and check again."
fi

