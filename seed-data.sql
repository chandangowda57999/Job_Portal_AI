-- Seed Data for Job Portal
-- This file is automatically executed when MySQL container is first initialized
-- (when the database volume is empty)
-- 
-- Password for all test users: "password123"
-- BCrypt Hash: $2a$10$aZo7NKzJTU/Xn9j1bB6L3eKoEgz6REWTsEO4e10Zye9NAQQbajTQe

-- Insert test users
-- Note: Password is hashed using BCrypt (Spring Security default)
-- All test users have password: "password123"

-- Test Employer User (for posting jobs)
INSERT INTO users (email, password, first_name, last_name, user_type, phone_country_code, phone_number, created_at, updated_at)
VALUES (
    'employer@example.com',
    '$2a$10$aZo7NKzJTU/Xn9j1bB6L3eKoEgz6REWTsEO4e10Zye9NAQQbajTQe', -- password123
    'John',
    'Employer',
    'employer',
    '+1',
    '1234567890',
    NOW(),
    NOW()
);

-- Test Candidate User (for applying to jobs)
INSERT INTO users (email, password, first_name, last_name, user_type, phone_country_code, phone_number, created_at, updated_at)
VALUES (
    'candidate@example.com',
    '$2a$10$aZo7NKzJTU/Xn9j1bB6L3eKoEgz6REWTsEO4e10Zye9NAQQbajTQe', -- password123
    'Jane',
    'Candidate',
    'candidate',
    '+1',
    '0987654321',
    NOW(),
    NOW()
);

-- Insert test jobs
-- Note: posted_by = 1 (employer user created above)
-- Application deadlines and start dates are set to future dates

-- Test Job 1: Senior Software Engineer
INSERT INTO jobs (
    title, company, location, job_type, status, experience_level, department, category,
    description, requirements, responsibilities, benefits,
    salary_min, salary_max, salary_currency, work_mode, education_level, skills,
    company_info, company_logo_url, posted_by,
    application_deadline, start_date, created_at, updated_at
)
VALUES (
    'Senior Software Engineer',
    'Tech Corp',
    'San Francisco, CA',
    'FULL_TIME',
    'ACTIVE',
    'SENIOR',
    'Engineering',
    'IT',
    'We are looking for a Senior Software Engineer to join our team. You will be responsible for designing and developing scalable applications using Java and Spring Boot. This is a great opportunity to work with cutting-edge technologies and collaborate with a talented team of engineers.

Key Responsibilities:
- Design and develop scalable web applications
- Write clean, maintainable, and well-documented code
- Participate in code reviews and provide feedback
- Mentor junior developers
- Collaborate with cross-functional teams

What We Offer:
- Competitive salary and equity package
- Health, dental, and vision insurance
- 401(k) matching
- Flexible work hours and remote work options
- Professional development opportunities',
    '5+ years of experience in Java development
• Strong knowledge of Spring Boot framework
• Experience with REST API development
• Database design and optimization skills
• Familiarity with cloud platforms (AWS, Azure)
• Excellent problem-solving and communication skills
• Experience with React or similar frontend frameworks is a plus',
    'Design and develop scalable web applications
• Write clean, maintainable, and well-documented code
• Participate in code reviews and provide feedback
• Mentor junior developers
• Collaborate with cross-functional teams
• Troubleshoot and debug applications',
    'Competitive salary and equity package
• Health, dental, and vision insurance
• 401(k) matching
• Flexible work hours and remote work options
• Professional development opportunities
• Free snacks and beverages',
    120000.00,
    180000.00,
    'USD',
    'HYBRID',
    'BACHELOR',
    'Java, Spring Boot, React, TypeScript, PostgreSQL, AWS, Docker, Kubernetes',
    'Tech Corp is a leading technology company specializing in innovative software solutions. We are committed to creating products that make a difference in people''s lives. Our team is passionate about technology and continuously strives to push the boundaries of what''s possible.

Founded in 2015, Tech Corp has grown to over 500 employees across multiple offices. We pride ourselves on our innovative culture, collaborative environment, and commitment to excellence.',
    'https://example.com/logos/tech-corp.png',
    1, -- posted_by (employer user)
    TIMESTAMPADD(DAY, 30, NOW()), -- application_deadline (30 days from now)
    TIMESTAMPADD(DAY, 60, NOW()), -- start_date (60 days from now)
    NOW(),
    NOW()
);

-- Test Job 2: Frontend Developer
INSERT INTO jobs (
    title, company, location, job_type, status, experience_level, department, category,
    description, requirements, responsibilities, benefits,
    salary_min, salary_max, salary_currency, work_mode, education_level, skills,
    company_info, company_logo_url, posted_by,
    application_deadline, start_date, created_at, updated_at
)
VALUES (
    'Frontend Developer',
    'Web Solutions Inc',
    'Remote',
    'FULL_TIME',
    'ACTIVE',
    'MID',
    'Engineering',
    'IT',
    'We are seeking a talented Frontend Developer to join our growing team. You will work on building modern, responsive web applications using React and TypeScript. This is a fully remote position with flexible working hours.

What You''ll Do:
- Build responsive and accessible user interfaces
- Collaborate with designers and backend developers
- Optimize applications for maximum speed and scalability
- Write clean, maintainable code following best practices
- Participate in agile development process',
    '3+ years of experience in frontend development
• Strong proficiency in React and TypeScript
• Experience with modern CSS frameworks (Tailwind, Material-UI)
• Knowledge of state management (Redux, Zustand)
• Familiarity with testing frameworks (Jest, React Testing Library)
• Understanding of RESTful APIs
• Experience with Git and version control',
    'Develop new user-facing features using React
• Build reusable components and frontend libraries
• Optimize components for maximum performance
• Collaborate with backend developers to integrate APIs
• Ensure technical feasibility of UI/UX designs
• Participate in code reviews and team meetings',
    'Competitive salary ($90k - $130k)
• Fully remote work
• Health insurance
• Flexible PTO
• Learning and development budget
• Equipment provided',
    90000.00,
    130000.00,
    'USD',
    'REMOTE',
    'BACHELOR',
    'React, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, Redux, Jest, Git',
    'Web Solutions Inc is a fast-growing startup focused on building innovative web applications. We believe in creating products that solve real-world problems and make a positive impact.

Our team is distributed across the globe, and we embrace remote work culture. We value creativity, collaboration, and continuous learning.',
    'https://example.com/logos/web-solutions.png',
    1, -- posted_by (employer user)
    TIMESTAMPADD(DAY, 25, NOW()), -- application_deadline (25 days from now)
    TIMESTAMPADD(DAY, 45, NOW()), -- start_date (45 days from now)
    NOW(),
    NOW()
);

-- Test Job 3: DevOps Engineer
INSERT INTO jobs (
    title, company, location, job_type, status, experience_level, department, category,
    description, requirements, responsibilities, benefits,
    salary_min, salary_max, salary_currency, work_mode, education_level, skills,
    company_info, company_logo_url, posted_by,
    application_deadline, start_date, created_at, updated_at
)
VALUES (
    'DevOps Engineer',
    'Cloud Systems',
    'New York, NY',
    'FULL_TIME',
    'ACTIVE',
    'SENIOR',
    'Engineering',
    'IT',
    'Join our DevOps team and help build scalable, reliable infrastructure. You will work on automating deployments, managing cloud infrastructure, and ensuring system reliability.

Key Responsibilities:
- Design and implement CI/CD pipelines
- Manage cloud infrastructure (AWS, Azure)
- Monitor and optimize system performance
- Automate infrastructure provisioning
- Ensure security and compliance',
    '5+ years of experience in DevOps or infrastructure engineering
• Strong knowledge of AWS or Azure
• Experience with Docker and Kubernetes
• Proficiency in Infrastructure as Code (Terraform, CloudFormation)
• Knowledge of CI/CD tools (Jenkins, GitHub Actions, GitLab CI)
• Scripting skills (Bash, Python)
• Experience with monitoring tools (Prometheus, Grafana)',
    'Design and implement CI/CD pipelines
• Manage and optimize cloud infrastructure
• Automate infrastructure provisioning and deployments
• Monitor system performance and reliability
• Implement security best practices
• Troubleshoot and resolve infrastructure issues',
    'Competitive salary ($130k - $180k)
• Health, dental, and vision insurance
• 401(k) matching
• Flexible work arrangements
• Professional development opportunities
• Gym membership',
    130000.00,
    180000.00,
    'USD',
    'HYBRID',
    'BACHELOR',
    'AWS, Azure, Docker, Kubernetes, Terraform, Jenkins, Python, Bash, Prometheus, Grafana',
    'Cloud Systems is a leading cloud infrastructure company providing scalable solutions to businesses of all sizes. We help companies modernize their infrastructure and leverage the power of cloud computing.

Our team consists of experienced engineers passionate about automation, scalability, and reliability. We work with cutting-edge technologies and best practices.',
    'https://example.com/logos/cloud-systems.png',
    1, -- posted_by (employer user)
    TIMESTAMPADD(DAY, 35, NOW()), -- application_deadline (35 days from now)
    TIMESTAMPADD(DAY, 70, NOW()), -- start_date (70 days from now)
    NOW(),
    NOW()
);

