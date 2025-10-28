# Input Validation Guide

This guide explains the comprehensive input validation implemented in the Job Portal application.

## Overview

The application now includes:
- **DTO-level validation** using Jakarta Bean Validation annotations
- **Business logic validation** in service layers
- **Global exception handling** with standardized error responses
- **Field-specific error messages** for better user experience

## Validation Features

### 1. User Validation

#### Required Fields
- `firstName`: 2-120 characters, letters/spaces/hyphens/apostrophes only
- `lastName`: 2-120 characters, letters/spaces/hyphens/apostrophes only
- `email`: Valid email format, max 190 characters, must be unique
- `userType`: Must be 'candidate', 'employer', or 'admin'

#### Optional Fields
- `phoneNumber`: 10-15 digits
- `phoneCountryCode`: Valid format (e.g., +1, +91)

#### Example Valid Request
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890",
  "phoneCountryCode": "+1",
  "userType": "candidate"
}
```

#### Example Invalid Request & Error Response
```json
// Request
{
  "firstName": "J",
  "email": "invalid-email",
  "userType": "unknown"
}

// Response (400 Bad Request)
{
  "status": 400,
  "message": "Validation failed for one or more fields",
  "timestamp": "2024-10-28T10:30:00Z",
  "path": "/api/v1/users",
  "errors": {
    "firstName": "First name must be between 2 and 120 characters",
    "lastName": "Last name is required",
    "email": "Email must be a valid email address",
    "userType": "User type must be either 'candidate', 'employer', or 'admin'"
  }
}
```

### 2. Job Validation

#### Required Fields
- `title`: 3-200 characters
- `company`: 2-100 characters
- `jobType`: FULL_TIME, PART_TIME, CONTRACT, or INTERNSHIP
- `status`: ACTIVE, INACTIVE, or CLOSED
- `description`: 50-5000 characters
- `postedBy`: Valid user ID

#### Optional Fields with Validation
- `location`: Max 100 characters
- `experienceLevel`: ENTRY, MID, SENIOR, or EXECUTIVE
- `department`: Max 100 characters
- `category`: Max 100 characters
- `requirements`: Max 5000 characters
- `responsibilities`: Max 5000 characters
- `benefits`: Max 3000 characters
- `salaryMin`: Must be > 0
- `salaryMax`: Must be > 0 and greater than salaryMin
- `salaryCurrency`: 3-letter code (USD, EUR, INR, etc.)
- `workMode`: REMOTE, ONSITE, or HYBRID
- `educationLevel`: HIGH_SCHOOL, BACHELOR, MASTER, or PHD
- `skills`: Max 500 characters
- `applicationDeadline`: Must be a future date
- `startDate`: Must be a future date

#### Business Rules
1. **Salary validation**: If both `salaryMin` and `salaryMax` are provided, `salaryMin` must be less than `salaryMax`
2. **Currency requirement**: If any salary is provided, `salaryCurrency` must also be provided

#### Example Valid Request
```json
{
  "title": "Senior Java Developer",
  "company": "Tech Corp",
  "location": "New York, NY",
  "jobType": "FULL_TIME",
  "status": "ACTIVE",
  "experienceLevel": "SENIOR",
  "department": "Engineering",
  "category": "IT",
  "description": "We are looking for an experienced Java developer to join our team. The ideal candidate will have 5+ years of experience with Spring Boot and microservices architecture.",
  "requirements": "5+ years Java experience, Spring Boot, REST APIs, Docker",
  "responsibilities": "Design and develop scalable microservices, mentor junior developers",
  "benefits": "Health insurance, 401k, flexible hours, remote work options",
  "salaryMin": 100000,
  "salaryMax": 150000,
  "salaryCurrency": "USD",
  "workMode": "HYBRID",
  "educationLevel": "BACHELOR",
  "skills": "Java, Spring Boot, Docker, Kubernetes, AWS",
  "postedBy": 1,
  "applicationDeadline": "2025-12-31T23:59:59Z",
  "startDate": "2025-02-01T09:00:00Z"
}
```

#### Example Invalid Request & Error Response
```json
// Request with validation errors
{
  "title": "SDE",
  "company": "T",
  "description": "Short desc",
  "jobType": "FULL_TIME",
  "status": "ACTIVE",
  "salaryMin": 150000,
  "salaryMax": 100000,
  "salaryCurrency": "USD",
  "postedBy": 1
}

// Response (400 Bad Request)
{
  "status": 400,
  "message": "Minimum salary must be less than maximum salary",
  "timestamp": "2024-10-28T10:30:00Z",
  "path": "/api/v1/job"
}
```

### 3. Resume Validation

#### Required Fields
- `fileName`: Cannot be blank
- `fileType`: Must be PDF, DOC, or DOCX (MIME types)
- `fileSize`: 1 byte to 10MB (10485760 bytes)
- `filePath`: Cannot be blank
- `originalFileName`: Max 255 characters
- `userId`: Valid user ID

#### Optional Fields
- `isPrimary`: Boolean
- `description`: Max 500 characters

#### Example File Type Values
- PDF: `application/pdf`
- DOC: `application/msword`
- DOCX: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

## Error Response Format

All validation errors return a standardized error response:

```json
{
  "status": 400,
  "message": "Brief error description",
  "timestamp": "2024-10-28T10:30:00Z",
  "path": "/api/v1/endpoint",
  "errors": {
    "fieldName1": "Error message for field 1",
    "fieldName2": "Error message for field 2"
  }
}
```

## HTTP Status Codes

- **400 Bad Request**: Validation errors or business rule violations
- **404 Not Found**: Resource not found (User, Job, etc.)
- **500 Internal Server Error**: Unexpected server errors

## Testing Validation

### Using cURL

```bash
# Test invalid user creation
curl -X POST http://localhost:8081/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "J",
    "email": "invalid-email",
    "userType": "unknown"
  }'

# Test invalid job creation (salary range)
curl -X POST http://localhost:8081/api/v1/job \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Job",
    "company": "Test Company",
    "description": "This is a test job description that meets the minimum character requirement for validation.",
    "jobType": "FULL_TIME",
    "status": "ACTIVE",
    "salaryMin": 150000,
    "salaryMax": 100000,
    "salaryCurrency": "USD",
    "postedBy": 1
  }'

# Test valid user creation
curl -X POST http://localhost:8081/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "phoneCountryCode": "+1",
    "userType": "candidate"
  }'
```

### Using Postman

1. Open Postman and create a new POST request
2. Set the URL to `http://localhost:8081/api/v1/users`
3. Set Headers: `Content-Type: application/json`
4. In Body, select "raw" and paste the JSON request
5. Send the request and observe the validation errors

### Using Swagger UI

1. Navigate to `http://localhost:8081/swagger-ui.html`
2. Find the endpoint you want to test
3. Click "Try it out"
4. Enter invalid data to test validation
5. Execute and observe the error response

## Common Validation Scenarios

### Scenario 1: Missing Required Fields
**Request**: Missing `lastName` and `email`
```json
{
  "firstName": "John"
}
```
**Response**: 400 with errors for each missing field

### Scenario 2: Invalid Email Format
**Request**: Invalid email
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "not-an-email",
  "userType": "candidate"
}
```
**Response**: 400 with "Email must be a valid email address"

### Scenario 3: Invalid Enum Value
**Request**: Invalid jobType
```json
{
  "jobType": "INVALID_TYPE"
}
```
**Response**: 400 with type mismatch error

### Scenario 4: Salary Range Validation
**Request**: salaryMin > salaryMax
```json
{
  "salaryMin": 150000,
  "salaryMax": 100000,
  "salaryCurrency": "USD"
}
```
**Response**: 400 with "Minimum salary must be less than maximum salary"

### Scenario 5: Future Date Validation
**Request**: Past date for applicationDeadline
```json
{
  "applicationDeadline": "2020-01-01T00:00:00Z"
}
```
**Response**: 400 with "Application deadline must be a future date"

## Best Practices

1. **Always validate on the client side first** for better UX
2. **Never trust client-side validation alone** - server-side validation is critical
3. **Provide clear, actionable error messages**
4. **Log validation errors** for monitoring and debugging
5. **Use appropriate HTTP status codes**
6. **Document validation rules** in API documentation

## Adding New Validations

### To add validation to a new field:

1. Add annotation to DTO:
```java
@NotBlank(message = "Field is required")
@Size(min = 2, max = 100, message = "Field must be between 2 and 100 characters")
private String myField;
```

2. Add `@Valid` to controller:
```java
@PostMapping
public ResponseEntity<MyDTO> create(@Valid @RequestBody MyDTO dto) {
    // ...
}
```

3. For custom business logic validation:
```java
private void validateMyBusinessRule(MyDTO dto) {
    if (dto.getField1() > dto.getField2()) {
        throw new ValidationException("Field1 must be less than Field2");
    }
}
```

## Available Validation Annotations

- `@NotNull`: Field cannot be null
- `@NotBlank`: String cannot be null or empty (trim whitespace)
- `@NotEmpty`: Collection/array cannot be empty
- `@Size(min, max)`: String/collection size constraints
- `@Min(value)`: Minimum numeric value
- `@Max(value)`: Maximum numeric value
- `@DecimalMin(value)`: Minimum decimal value
- `@DecimalMax(value)`: Maximum decimal value
- `@Email`: Valid email format
- `@Pattern(regexp)`: Regex pattern matching
- `@Past`: Date must be in the past
- `@Future`: Date must be in the future
- `@Positive`: Must be positive number
- `@PositiveOrZero`: Must be positive or zero
- `@Negative`: Must be negative number
- `@NegativeOrZero`: Must be negative or zero

## Troubleshooting

### Validation Not Working
- Ensure `@Valid` annotation is present in controller
- Check that DTO has validation annotations
- Verify `spring-boot-starter-validation` is in dependencies (included with `spring-boot-starter-web`)

### Custom Error Messages Not Showing
- Check that `message` attribute is set in validation annotation
- Verify global exception handler is configured with `@ControllerAdvice`

### Business Logic Validation Not Triggering
- Ensure `ValidationException` is thrown in service layer
- Verify exception handler includes `@ExceptionHandler(ValidationException.class)`

## Additional Resources

- [Jakarta Bean Validation Specification](https://beanvalidation.org/)
- [Spring Boot Validation Documentation](https://spring.io/guides/gs/validating-form-input/)
- [Hibernate Validator Documentation](https://hibernate.org/validator/)

