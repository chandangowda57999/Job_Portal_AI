-- Seed Data for Job Portal
-- This file is automatically executed when MySQL container is first initialized
-- (when the database volume is empty)
-- 
-- Password for all test users: "password123"
-- BCrypt Hash: $2a$10$aZo7NKzJTU/Xn9j1bB6L3eKoEgz6REWTsEO4e10Zye9NAQQbajTQe

-- Insert test users
-- Note: Password is hashed using BCrypt (Spring Security default)
-- All test users have password: "password123"
-- Using INSERT IGNORE to avoid errors if users already exist

-- Test Employer User (for posting jobs)
INSERT IGNORE INTO users (email, password, first_name, last_name, user_type, phone_country_code, phone_number, created_at, updated_at)
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
INSERT IGNORE INTO users (email, password, first_name, last_name, user_type, phone_country_code, phone_number, created_at, updated_at)
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

-- Test Job 4: Data Scientist
INSERT INTO jobs (
    title, company, location, job_type, status, experience_level, department, category,
    description, requirements, responsibilities, benefits,
    salary_min, salary_max, salary_currency, work_mode, education_level, skills,
    company_info, company_logo_url, posted_by,
    application_deadline, start_date, created_at, updated_at
)
VALUES (
    'Data Scientist',
    'Data Analytics Pro',
    'Seattle, WA',
    'FULL_TIME',
    'ACTIVE',
    'MID',
    'Data Science',
    'IT',
    'We are looking for a Data Scientist to join our analytics team. You will work on extracting insights from large datasets, building predictive models, and helping drive data-driven decisions across the organization.

What You''ll Do:
- Analyze large datasets to identify trends and patterns
- Build and deploy machine learning models
- Collaborate with cross-functional teams to solve business problems
- Create data visualizations and reports
- Present findings to stakeholders',
    '3+ years of experience in data science or analytics
• Strong knowledge of Python and SQL
• Experience with machine learning frameworks (scikit-learn, TensorFlow, PyTorch)
• Proficiency in data visualization tools (Tableau, Power BI, matplotlib)
• Knowledge of statistical analysis and hypothesis testing
• Experience with big data tools (Spark, Hadoop) is a plus
• Strong problem-solving and communication skills',
    'Analyze complex datasets to extract actionable insights
• Develop and deploy machine learning models
• Create data visualizations and dashboards
• Collaborate with business stakeholders to understand requirements
• Present findings and recommendations to leadership
• Maintain and improve existing models',
    'Competitive salary ($110k - $150k)
• Health, dental, and vision insurance
• 401(k) matching
• Flexible work schedule
• Professional development budget
• Stock options',
    110000.00,
    150000.00,
    'USD',
    'HYBRID',
    'MASTER',
    'Python, SQL, Machine Learning, TensorFlow, scikit-learn, Tableau, Statistics, Data Analysis',
    'Data Analytics Pro is a leading data science consultancy helping companies leverage their data for competitive advantage. We work with Fortune 500 companies to build advanced analytics solutions and drive business growth.

Our team of data scientists and engineers are experts in machine learning, statistical analysis, and data engineering.',
    'https://example.com/logos/data-analytics-pro.png',
    1,
    TIMESTAMPADD(DAY, 28, NOW()),
    TIMESTAMPADD(DAY, 50, NOW()),
    NOW(),
    NOW()
);

-- Test Job 5: Product Manager
INSERT INTO jobs (
    title, company, location, job_type, status, experience_level, department, category,
    description, requirements, responsibilities, benefits,
    salary_min, salary_max, salary_currency, work_mode, education_level, skills,
    company_info, company_logo_url, posted_by,
    application_deadline, start_date, created_at, updated_at
)
VALUES (
    'Product Manager',
    'InnovateTech',
    'Austin, TX',
    'FULL_TIME',
    'ACTIVE',
    'MID',
    'Product',
    'IT',
    'Join our product team as a Product Manager and help shape the future of our products. You will work closely with engineering, design, and business teams to define product strategy and deliver exceptional user experiences.

Key Responsibilities:
- Define product vision and roadmap
- Gather and prioritize product requirements
- Work with engineering teams to deliver features
- Analyze user feedback and metrics
- Coordinate product launches',
    '3+ years of experience in product management
• Strong analytical and problem-solving skills
• Experience with agile development methodologies
• Excellent communication and stakeholder management skills
• Knowledge of product analytics tools (Mixpanel, Amplitude, Google Analytics)
• Technical background is a plus
• MBA or related degree preferred',
    'Define product strategy and roadmap
• Gather requirements from stakeholders
• Write product specifications and user stories
• Work with engineering and design teams
• Analyze product metrics and user feedback
• Coordinate product launches and releases',
    'Competitive salary ($120k - $160k)
• Health, dental, and vision insurance
• 401(k) matching
• Stock options
• Flexible PTO
• Professional development opportunities',
    120000.00,
    160000.00,
    'USD',
    'ONSITE',
    'BACHELOR',
    'Product Management, Agile, Scrum, Analytics, User Research, Product Strategy, Stakeholder Management',
    'InnovateTech is a fast-growing technology company building innovative products that transform industries. We are passionate about creating products that solve real problems and delight users.

Our product team works closely with engineering, design, and business teams to deliver exceptional products that drive business growth.',
    'https://example.com/logos/innovatetech.png',
    1,
    TIMESTAMPADD(DAY, 32, NOW()),
    TIMESTAMPADD(DAY, 55, NOW()),
    NOW(),
    NOW()
);

-- Test Job 6: Marketing Manager
INSERT INTO jobs (
    title, company, location, job_type, status, experience_level, department, category,
    description, requirements, responsibilities, benefits,
    salary_min, salary_max, salary_currency, work_mode, education_level, skills,
    company_info, company_logo_url, posted_by,
    application_deadline, start_date, created_at, updated_at
)
VALUES (
    'Marketing Manager',
    'Brand Solutions',
    'Chicago, IL',
    'FULL_TIME',
    'ACTIVE',
    'MID',
    'Marketing',
    'MARKETING',
    'We are seeking a Marketing Manager to lead our marketing initiatives and drive brand awareness. You will develop and execute marketing campaigns across multiple channels, analyze performance metrics, and collaborate with cross-functional teams.

What You''ll Do:
- Develop and execute marketing strategies
- Manage marketing campaigns across digital and traditional channels
- Analyze marketing metrics and ROI
- Collaborate with sales, product, and design teams
- Manage marketing budget and resources',
    '4+ years of experience in marketing
• Strong knowledge of digital marketing (SEO, SEM, social media)
• Experience with marketing automation tools (HubSpot, Marketo)
• Proficiency in analytics tools (Google Analytics, Facebook Analytics)
• Excellent written and verbal communication skills
• Creative thinking and problem-solving abilities
• Experience with content marketing and copywriting',
    'Develop comprehensive marketing strategies
• Execute marketing campaigns across multiple channels
• Analyze marketing performance and ROI
• Manage marketing budget and resources
• Collaborate with internal teams and external agencies
• Create marketing content and materials',
    'Competitive salary ($85k - $120k)
• Health, dental, and vision insurance
• 401(k) matching
• Flexible work arrangements
• Marketing budget for campaigns
• Professional development opportunities',
    85000.00,
    120000.00,
    'USD',
    'HYBRID',
    'BACHELOR',
    'Digital Marketing, SEO, SEM, Social Media, Content Marketing, Analytics, Marketing Automation, Brand Management',
    'Brand Solutions is a leading marketing agency helping companies build strong brands and drive growth. We specialize in digital marketing, brand strategy, and creative campaigns.

Our team of marketing professionals work with clients across various industries to create impactful marketing campaigns that drive results.',
    'https://example.com/logos/brand-solutions.png',
    1,
    TIMESTAMPADD(DAY, 30, NOW()),
    TIMESTAMPADD(DAY, 60, NOW()),
    NOW(),
    NOW()
);

-- Test Job 7: Financial Analyst
INSERT INTO jobs (
    title, company, location, job_type, status, experience_level, department, category,
    description, requirements, responsibilities, benefits,
    salary_min, salary_max, salary_currency, work_mode, education_level, skills,
    company_info, company_logo_url, posted_by,
    application_deadline, start_date, created_at, updated_at
)
VALUES (
    'Financial Analyst',
    'Finance Corp',
    'Boston, MA',
    'FULL_TIME',
    'ACTIVE',
    'ENTRY',
    'Finance',
    'FINANCE',
    'We are looking for a Financial Analyst to join our finance team. You will analyze financial data, prepare reports, and support strategic decision-making. This is an excellent opportunity for recent graduates to start their career in finance.

Key Responsibilities:
- Analyze financial data and trends
- Prepare financial reports and forecasts
- Support budgeting and planning processes
- Conduct financial modeling and analysis
- Assist with financial presentations',
    'Bachelor''s degree in Finance, Accounting, or related field
• Strong analytical and quantitative skills
• Proficiency in Excel and financial modeling
• Knowledge of financial analysis and reporting
• Excellent attention to detail
• Strong communication skills
• Internship experience in finance is a plus',
    'Analyze financial data and performance metrics
• Prepare monthly and quarterly financial reports
• Support budgeting and forecasting processes
• Conduct financial modeling and scenario analysis
• Assist with financial presentations to management
• Collaborate with cross-functional teams',
    'Competitive salary ($60k - $80k)
• Health, dental, and vision insurance
• 401(k) matching
• Professional development opportunities
• Mentorship program
• Career growth opportunities',
    60000.00,
    80000.00,
    'USD',
    'ONSITE',
    'BACHELOR',
    'Financial Analysis, Excel, Financial Modeling, Budgeting, Forecasting, Financial Reporting, Data Analysis',
    'Finance Corp is a leading financial services company providing comprehensive financial solutions to businesses and individuals. We are committed to helping our clients achieve their financial goals.

Our finance team plays a critical role in supporting strategic decision-making and ensuring financial health of the organization.',
    'https://example.com/logos/finance-corp.png',
    1,
    TIMESTAMPADD(DAY, 25, NOW()),
    TIMESTAMPADD(DAY, 45, NOW()),
    NOW(),
    NOW()
);

-- Test Job 8: UX Designer
INSERT INTO jobs (
    title, company, location, job_type, status, experience_level, department, category,
    description, requirements, responsibilities, benefits,
    salary_min, salary_max, salary_currency, work_mode, education_level, skills,
    company_info, company_logo_url, posted_by,
    application_deadline, start_date, created_at, updated_at
)
VALUES (
    'UX Designer',
    'Design Studio',
    'Portland, OR',
    'FULL_TIME',
    'ACTIVE',
    'MID',
    'Design',
    'IT',
    'Join our design team as a UX Designer and create exceptional user experiences. You will work on designing intuitive interfaces, conducting user research, and collaborating with product and engineering teams.

What You''ll Do:
- Design user interfaces and experiences
- Conduct user research and usability testing
- Create wireframes, prototypes, and design specifications
- Collaborate with product managers and engineers
- Iterate on designs based on user feedback',
    '3+ years of experience in UX design
• Strong portfolio demonstrating UX design skills
• Proficiency in design tools (Figma, Sketch, Adobe XD)
• Experience with user research and usability testing
• Knowledge of design systems and component libraries
• Strong communication and collaboration skills
• Understanding of frontend development is a plus',
    'Design user interfaces and experiences
• Conduct user research and usability testing
• Create wireframes, prototypes, and design specifications
• Collaborate with product and engineering teams
• Iterate on designs based on user feedback
• Maintain design systems and style guides',
    'Competitive salary ($90k - $130k)
• Health, dental, and vision insurance
• 401(k) matching
• Flexible work arrangements
• Design tools and software provided
• Professional development budget',
    90000.00,
    130000.00,
    'USD',
    'REMOTE',
    'BACHELOR',
    'UX Design, User Research, Figma, Prototyping, Wireframing, Design Systems, Usability Testing',
    'Design Studio is a creative agency specializing in user experience design and digital product design. We work with startups and established companies to create beautiful, functional, and user-centered designs.

Our design team is passionate about creating exceptional user experiences that drive business success.',
    'https://example.com/logos/design-studio.png',
    1,
    TIMESTAMPADD(DAY, 27, NOW()),
    TIMESTAMPADD(DAY, 48, NOW()),
    NOW(),
    NOW()
);

-- Test Job 9: Software Engineer Intern
INSERT INTO jobs (
    title, company, location, job_type, status, experience_level, department, category,
    description, requirements, responsibilities, benefits,
    salary_min, salary_max, salary_currency, work_mode, education_level, skills,
    company_info, company_logo_url, posted_by,
    application_deadline, start_date, created_at, updated_at
)
VALUES (
    'Software Engineer Intern',
    'StartupHub',
    'Denver, CO',
    'INTERNSHIP',
    'ACTIVE',
    'ENTRY',
    'Engineering',
    'IT',
    'We are offering an exciting internship opportunity for students interested in software engineering. You will work on real projects, learn from experienced engineers, and gain valuable industry experience.

What You''ll Learn:
- Software development best practices
- Working with modern technologies
- Collaboration in a team environment
- Code reviews and quality assurance
- Agile development methodologies',
    'Currently pursuing a degree in Computer Science or related field
• Basic programming knowledge (Python, Java, or JavaScript)
• Strong problem-solving skills
• Eagerness to learn and grow
• Good communication skills
• Previous internship or project experience is a plus',
    'Assist with software development tasks
• Write and test code under supervision
• Participate in code reviews
• Learn from experienced engineers
• Contribute to team projects
• Attend team meetings and standups',
    'Competitive internship stipend ($25/hour)
• Mentorship from experienced engineers
• Flexible work schedule
• Networking opportunities
• Potential for full-time offer
• Learning and development resources',
    25.00,
    25.00,
    'USD',
    'HYBRID',
    'BACHELOR',
    'Programming, Software Development, Problem Solving, Teamwork, Learning',
    'StartupHub is a technology incubator supporting early-stage startups. We provide resources, mentorship, and funding to help startups grow and succeed.

Our engineering team works on cutting-edge projects and provides excellent learning opportunities for interns.',
    'https://example.com/logos/startuphub.png',
    1,
    TIMESTAMPADD(DAY, 20, NOW()),
    TIMESTAMPADD(DAY, 30, NOW()),
    NOW(),
    NOW()
);

-- Test Job 10: Sales Representative
INSERT INTO jobs (
    title, company, location, job_type, status, experience_level, department, category,
    description, requirements, responsibilities, benefits,
    salary_min, salary_max, salary_currency, work_mode, education_level, skills,
    company_info, company_logo_url, posted_by,
    application_deadline, start_date, created_at, updated_at
)
VALUES (
    'Sales Representative',
    'SalesForce Inc',
    'Miami, FL',
    'FULL_TIME',
    'ACTIVE',
    'ENTRY',
    'Sales',
    'SALES',
    'We are looking for a motivated Sales Representative to join our sales team. You will be responsible for generating leads, building relationships with clients, and closing deals. This is a great opportunity to start a career in sales.

Key Responsibilities:
- Generate and qualify sales leads
- Build relationships with potential clients
- Conduct sales presentations and demos
- Negotiate and close deals
- Maintain customer relationships',
    'Bachelor''s degree or equivalent experience
• Strong communication and interpersonal skills
• Self-motivated and goal-oriented
• Ability to work in a fast-paced environment
• Previous sales experience is a plus
• CRM experience (Salesforce, HubSpot) is preferred',
    'Generate and qualify sales leads
• Build relationships with potential clients
• Conduct sales presentations and product demos
• Negotiate contracts and close deals
• Maintain customer relationships
• Meet and exceed sales targets',
    'Base salary + commission ($50k - $100k+)
• Health, dental, and vision insurance
• 401(k) matching
• Uncapped commission potential
• Sales training and development
• Career advancement opportunities',
    50000.00,
    100000.00,
    'USD',
    'ONSITE',
    'BACHELOR',
    'Sales, Customer Relations, Communication, Negotiation, CRM, Lead Generation',
    'SalesForce Inc is a leading sales organization helping companies grow their revenue. We provide comprehensive sales solutions and support to businesses across various industries.

Our sales team is driven, results-oriented, and committed to helping clients achieve their business goals.',
    'https://example.com/logos/salesforce-inc.png',
    1,
    TIMESTAMPADD(DAY, 22, NOW()),
    TIMESTAMPADD(DAY, 40, NOW()),
    NOW(),
    NOW()
);

-- Test Job 11: Backend Developer
INSERT INTO jobs (
    title, company, location, job_type, status, experience_level, department, category,
    description, requirements, responsibilities, benefits,
    salary_min, salary_max, salary_currency, work_mode, education_level, skills,
    company_info, company_logo_url, posted_by,
    application_deadline, start_date, created_at, updated_at
)
VALUES (
    'Backend Developer',
    'API Solutions',
    'Remote',
    'FULL_TIME',
    'ACTIVE',
    'MID',
    'Engineering',
    'IT',
    'We are seeking a Backend Developer to build scalable APIs and services. You will work with modern technologies to develop robust backend systems that power our applications.

What You''ll Do:
- Design and develop RESTful APIs
- Build scalable backend services
- Optimize database queries and performance
- Write unit and integration tests
- Collaborate with frontend and DevOps teams',
    '3+ years of experience in backend development
• Strong knowledge of Node.js, Python, or Java
• Experience with RESTful API design
• Database design and optimization skills (PostgreSQL, MongoDB)
• Knowledge of cloud platforms (AWS, Azure, GCP)
• Experience with microservices architecture
• Understanding of security best practices',
    'Design and develop RESTful APIs
• Build scalable backend services and microservices
• Optimize database queries and performance
• Write comprehensive tests
• Collaborate with frontend and DevOps teams
• Monitor and maintain production systems',
    'Competitive salary ($100k - $140k)
• Fully remote work
• Health, dental, and vision insurance
• 401(k) matching
• Flexible PTO
• Professional development budget',
    100000.00,
    140000.00,
    'USD',
    'REMOTE',
    'BACHELOR',
    'Node.js, Python, Java, REST APIs, PostgreSQL, MongoDB, AWS, Microservices, Docker',
    'API Solutions is a technology company specializing in building robust backend systems and APIs. We help companies build scalable, reliable, and secure backend infrastructure.

Our engineering team works with cutting-edge technologies to deliver high-quality solutions that power modern applications.',
    'https://example.com/logos/api-solutions.png',
    1,
    TIMESTAMPADD(DAY, 26, NOW()),
    TIMESTAMPADD(DAY, 50, NOW()),
    NOW(),
    NOW()
);

-- Test Job 12: HR Manager
INSERT INTO jobs (
    title, company, location, job_type, status, experience_level, department, category,
    description, requirements, responsibilities, benefits,
    salary_min, salary_max, salary_currency, work_mode, education_level, skills,
    company_info, company_logo_url, posted_by,
    application_deadline, start_date, created_at, updated_at
)
VALUES (
    'HR Manager',
    'PeopleFirst Corp',
    'Atlanta, GA',
    'FULL_TIME',
    'ACTIVE',
    'MID',
    'Human Resources',
    'HR',
    'We are looking for an HR Manager to lead our human resources initiatives. You will be responsible for recruitment, employee relations, performance management, and HR strategy.

Key Responsibilities:
- Lead recruitment and hiring processes
- Manage employee relations and engagement
- Develop and implement HR policies
- Oversee performance management
- Handle employee benefits and compensation',
    '5+ years of experience in human resources
• Strong knowledge of HR best practices and employment law
• Experience with recruitment and talent acquisition
• Excellent interpersonal and communication skills
• HR certification (SHRM, PHR) is preferred
• Experience with HRIS systems
• Strong problem-solving and conflict resolution skills',
    'Lead recruitment and talent acquisition efforts
• Manage employee relations and engagement programs
• Develop and implement HR policies and procedures
• Oversee performance management processes
• Handle employee benefits and compensation
• Ensure compliance with employment laws',
    'Competitive salary ($80k - $110k)
• Health, dental, and vision insurance
• 401(k) matching
• Flexible work arrangements
• Professional development opportunities
• HR certification support',
    80000.00,
    110000.00,
    'USD',
    'HYBRID',
    'BACHELOR',
    'Human Resources, Recruitment, Employee Relations, HRIS, Performance Management, Employment Law',
    'PeopleFirst Corp is a people-focused organization committed to creating a positive work environment. We believe that our employees are our greatest asset and invest in their growth and development.

Our HR team plays a crucial role in attracting, developing, and retaining top talent.',
    'https://example.com/logos/peoplefirst-corp.png',
    1,
    TIMESTAMPADD(DAY, 29, NOW()),
    TIMESTAMPADD(DAY, 52, NOW()),
    NOW(),
    NOW()
);

