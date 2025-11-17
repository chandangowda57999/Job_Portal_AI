-- Test Data Script for Job Portal
-- This script adds sample data to the database for testing

-- First, create a test user (employer) to post jobs
-- Note: Password needs to be hashed using BCrypt in production
-- For testing, we'll use the API to create users with proper password hashing

-- Insert test users (password hash for "password123" using BCrypt)
-- You should create users via API endpoint instead: POST /api/v1/users
-- Example curl: curl -X POST http://localhost:8081/api/v1/users -H "Content-Type: application/json" -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","userType":"employer","phoneNumber":"1234567890"}'

-- Insert test jobs (after creating a user via API, use their ID for postedBy)
-- Example: Create jobs via API: POST /api/v1/job

-- Sample job data structure:
/*
{
  "title": "Senior Software Engineer",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "jobType": "FULL_TIME",
  "status": "ACTIVE",
  "experienceLevel": "SENIOR",
  "department": "Engineering",
  "category": "IT",
  "description": "We are looking for a Senior Software Engineer to join our team...",
  "requirements": "5+ years of experience in Java\n• Spring Boot expertise\n• REST API development\n• Database design",
  "responsibilities": "Design and develop scalable applications\n• Code reviews\n• Mentoring junior developers",
  "benefits": "Health insurance\n• 401k matching\n• Flexible work hours",
  "salaryMin": 120000,
  "salaryMax": 180000,
  "salaryCurrency": "USD",
  "workMode": "HYBRID",
  "educationLevel": "BACHELOR",
  "skills": "Java, Spring Boot, React, TypeScript, PostgreSQL",
  "companyInfo": "Tech Corp is a leading technology company specializing in innovative software solutions.",
  "companyLogoUrl": "https://example.com/logo.png",
  "postedBy": 1,
  "applicationDeadline": "2024-12-31T23:59:59Z",
  "startDate": "2024-01-15T09:00:00Z"
}
*/

-- Note: Use API endpoints instead of direct SQL inserts to ensure:
-- 1. Password hashing (for users)
-- 2. Data validation
-- 3. Timestamp handling
-- 4. Business rule validation

