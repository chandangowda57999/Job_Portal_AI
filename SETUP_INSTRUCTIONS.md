# Setup Instructions - Resume Management Portal with MySQL

## Prerequisites
- Docker Desktop installed and running
- Java 17+
- Maven 3.6+

## Quick Start Guide

### Step 1: Start Docker Desktop
Make sure Docker Desktop is running on your machine.

### Step 2: Start MySQL Database

Open a terminal in the project directory and run:

```bash
docker-compose up -d
```

This will:
- Download MySQL 8.0 image (if not already present)
- Start MySQL container
- Create the database `jobportal_db`
- Set up user credentials

**Database Configuration:**
- Host: `localhost`
- Port: `3306`
- Database: `jobportal_db`
- Username: `jobportal_user`
- Password: `jobportal_pass`

### Step 3: Verify MySQL is Running

Check if the container is running:
```bash
docker ps
```

You should see a container named `jobportal-mysql` running.

View logs if needed:
```bash
docker-compose logs mysql
```

### Step 4: Build the Application

```bash
mvn clean package -DskipTests
```

### Step 5: Run the Application

```bash
mvn spring-boot:run
```

Or using the JAR file:
```bash
java -jar target/jobportal-0.0.1-SNAPSHOT.jar
```

The application will start on **http://localhost:8081**

### Step 6: Test the Application

Open your browser and navigate to:
- **API Documentation**: http://localhost:8081/swagger-ui.html
- **Users API**: http://localhost:8081/api/v1/users
- **Resume Management API**: http://localhost:8081/api/v1/resumes

## Commands Reference

### Docker Commands

**Start MySQL:**
```bash
docker-compose up -d
```

**Stop MySQL:**
```bash
docker-compose down
```

**Stop and remove data:**
```bash
docker-compose down -v
```

**View MySQL logs:**
```bash
docker-compose logs mysql
```

**Connect to MySQL container:**
```bash
docker exec -it jobportal-mysql mysql -u jobportal_user -pjobportal_pass jobportal_db
```

### Maven Commands

**Clean and build:**
```bash
mvn clean package
```

**Run application:**
```bash
mvn spring-boot:run
```

**Run tests:**
```bash
mvn test
```

## Troubleshooting

### Issue: Docker Desktop not running
**Error:** `The system cannot find the file specified`

**Solution:**
1. Open Docker Desktop application
2. Wait for it to fully start (whale icon in system tray)
3. Try the command again

### Issue: Port 3306 already in use
**Error:** `Bind for 0.0.0.0:3306 failed: port is already allocated`

**Solution:**
1. Find what's using the port:
   ```bash
   netstat -ano | findstr :3306
   ```
2. Stop the process or change the MySQL port in `docker-compose.yml`:
   ```yaml
   ports:
     - "3307:3306"  # Use 3307 instead of 3306
   ```
3. Update `application.properties` to use the new port

### Issue: Application won't connect to MySQL
**Error:** `Communications link failure`

**Solution:**
1. Verify MySQL is running: `docker ps`
2. Check MySQL logs: `docker-compose logs mysql`
3. Ensure credentials match in `application.properties`
4. Try restarting MySQL: `docker-compose restart`

### Issue: Database schema not created
**Error:** Tables don't exist

**Solution:**
1. Check `spring.jpa.hibernate.ddl-auto=update` in `application.properties`
2. Restart the application
3. Check application logs for Hibernate messages

## Connecting to MySQL

### Using MySQL Command Line
```bash
mysql -h localhost -P 3306 -u jobportal_user -pjobportal_pass jobportal_db
```

### Using MySQL Workbench
- Host: `localhost`
- Port: `3306`
- Username: `jobportal_user`
- Password: `jobportal_pass`
- Default Schema: `jobportal_db`

### Using DBeaver or other GUI tools
Use the same credentials as above.

## Files Overview

### `docker-compose.yml`
Defines the MySQL container configuration

### `src/main/resources/application.properties`
Contains database connection settings

### `init.sql`
Optional initialization script for MySQL

## Next Steps

Once the application is running:
1. Access Swagger UI to test API endpoints
2. Create users via POST request
3. Explore the database using MySQL client
4. Check application logs for any issues

Happy coding! 🚀
