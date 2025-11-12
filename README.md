# Resume Management Portal

A Spring Boot REST API for managing users and their resumes in a resume management system.

## Tech Stack

- **Java 17**
- **Spring Boot 3.5.6**
- **Spring Data JPA**
- **MySQL 8.0**
- **Lombok**
- **Docker** & **Docker Compose**
- **Maven**
- **SpringDoc OpenAPI** (Swagger)

## Features

- **User Management**: CRUD operations for Users with role-based types (candidate/employer/admin)
- **Job Posting System**: Complete job management with search and filtering
- **Resume Management**: Upload and manage multiple resumes with primary resume selection
- **File Storage**: Support for PDF and Word documents (up to 10MB)
- **Input Validation**: Comprehensive field-level and business logic validation
- **Error Handling**: Standardized error responses with detailed validation messages
- **RESTful API**: Well-structured endpoints following REST principles
- **MySQL Database**: Persistent data storage with JPA/Hibernate
- **Docker Support**: Containerized MySQL deployment
- **API Documentation**: Interactive Swagger UI for testing and documentation

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker & Docker Compose
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd jobportal
```

### 2. Start MySQL database using Docker

```bash
docker-compose up -d
```

This will start MySQL 8.0 container with the following configuration:
- **Host**: localhost
- **Port**: 3306
- **Database**: jobportal_db
- **Username**: jobportal_user
- **Password**: jobportal_pass
- **Root Password**: rootpassword

**Note**: On first startup, the database will be automatically seeded with test data (2 users and 3 jobs) from `seed-data.sql`. This happens automatically when the database volume is empty.

To check if MySQL is running:
```bash
docker ps
```

### 3. Build the application

```bash
mvn clean package
```

### 4. Run the application

```bash
mvn spring-boot:run
```

Or using the JAR file:
```bash
java -jar target/jobportal-0.0.1-SNAPSHOT.jar
```

The application will start on **http://localhost:8081**

## Database Management

### Seed Data (Test Data)

The database is automatically seeded with test data on first initialization:

**Test Users:**
- `employer@example.com` / `password123` (employer - can post jobs)
- `candidate@example.com` / `password123` (candidate - can apply to jobs)

**Test Jobs:**
- Senior Software Engineer (Tech Corp)
- Frontend Developer (Web Solutions Inc)
- DevOps Engineer (Cloud Systems)

**Note**: Seed data is only loaded when the database volume is empty (first time setup). To reset the database and reload seed data, use the reset script:

```bash
./scripts/reset-db.sh
```

### Connect to MySQL

You can connect to MySQL using any MySQL client with these credentials:
- **Host**: localhost
- **Port**: 3306
- **Database**: jobportal_db
- **Username**: jobportal_user
- **Password**: jobportal_pass

### Using MySQL Command Line

```bash
mysql -h localhost -P 3306 -u jobportal_user -pjobportal_pass jobportal_db
```

### Reset Database (Reload Seed Data)

To reset the database and reload test data:

```bash
./scripts/reset-db.sh
```

This will:
1. Stop MySQL container
2. Remove database volume (deletes all data)
3. Restart MySQL container
4. Automatically load seed data
5. Verify data was loaded successfully

### Stop MySQL Container

```bash
docker-compose down
```

To also remove volumes (this will delete all data):
```bash
docker-compose down -v
```

## API Endpoints

### Users API

Base URL: `http://localhost:8081/api/v1/users`

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/{id}` - Get user by ID
- `GET /api/v1/users/by-email/{email}` - Get user by email
- `POST /api/v1/users` - Create a new user (with validation)
- `PUT /api/v1/users/{id}` - Update a user (with validation)
- `DELETE /api/v1/users/{id}` - Delete a user

### Jobs API

Base URL: `http://localhost:8081/api/v1/job`

- `GET /api/v1/job` - Get all jobs
- `GET /api/v1/job/{id}` - Get job by ID
- `GET /api/v1/job/company/{company}` - Get jobs by company
- `GET /api/v1/job/location/{location}` - Get jobs by location
- `GET /api/v1/job/type/{jobType}` - Get jobs by type (FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP)
- `GET /api/v1/job/active` - Get all active jobs
- `POST /api/v1/job` - Create a new job (with validation)
- `PUT /api/v1/job/{id}` - Update a job (with validation)
- `DELETE /api/v1/job/{id}` - Delete a job

### Resume Management API

Base URL: `http://localhost:8081/api/v1/resumes`

- `POST /api/v1/resumes/upload/{userId}` - Upload resume
- `GET /api/v1/resumes/user/{userId}` - Get all user's resumes
- `GET /api/v1/resumes/user/{userId}/primary` - Get primary resume
- `PUT /api/v1/resumes/user/{userId}/primary/{resumeId}` - Set primary resume
- `GET /api/v1/resumes/user/{userId}/download/{resumeId}` - Download resume
- `DELETE /api/v1/resumes/user/{userId}/{resumeId}` - Delete resume

## API Documentation

Once the application is running, you can access:

- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **API Docs (JSON)**: http://localhost:8081/api-docs
- **Actuator**: http://localhost:8081/actuator

For detailed information about input validation, error handling, and examples, see [VALIDATION_GUIDE.md](VALIDATION_GUIDE.md)

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/jobportal/jobportal/
│   │       ├── controller/     # REST controllers
│   │       ├── service/        # Business logic
│   │       ├── repo/           # Data repositories
│   │       ├── entity/         # JPA entities
│   │       ├── dto/            # Data transfer objects
│   │       ├── mapper/         # DTO-Entity mappers
│   │       └── customexceptionhandler/  # Exception handling
│   └── resources/
│       └── application.properties
└── test/
    └── java/
        └── com/jobportal/jobportal/
```

## Testing

Run tests with:
```bash
mvn test
```

## Configuration

### Application Properties

The main configuration is in `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/jobportal_db
spring.datasource.username=jobportal_user
spring.datasource.password=jobportal_pass

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Server
server.port=8081
```

### Docker Compose

The `docker-compose.yml` file contains the MySQL configuration. You can modify database credentials if needed.

## Troubleshooting

### MySQL Connection Issues

1. Ensure MySQL container is running: `docker ps`
2. Check container logs: `docker-compose logs mysql`
3. Verify port 3306 is not already in use

### Application Won't Start

1. Make sure MySQL is running first
2. Check database credentials in `application.properties`
3. Check application logs for specific errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.


