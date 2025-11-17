package com.jobportal.jobportal.dto;

import com.jobportal.jobportal.entity.Job;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDTO {
    private Long id;
    
    @NotBlank(message = "Job title is required")
    @Size(min = 3, max = 200, message = "Job title must be between 3 and 200 characters")
    private String title;
    
    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 100, message = "Company name must be between 2 and 100 characters")
    private String company;
    
    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;
    
    @NotNull(message = "Job type is required")
    private Job.JobType jobType;
    
    @NotNull(message = "Job status is required")
    private Job.JobStatus status;
    
    @Pattern(regexp = "^(ENTRY|MID|SENIOR|EXECUTIVE)$", message = "Experience level must be ENTRY, MID, SENIOR, or EXECUTIVE")
    private String experienceLevel;
    
    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;
    
    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;
    
    @NotBlank(message = "Job description is required")
    @Size(min = 50, max = 5000, message = "Description must be between 50 and 5000 characters")
    private String description;
    
    @Size(max = 5000, message = "Requirements must not exceed 5000 characters")
    private String requirements;
    
    @Size(max = 5000, message = "Responsibilities must not exceed 5000 characters")
    private String responsibilities;
    
    @Size(max = 3000, message = "Benefits must not exceed 3000 characters")
    private String benefits;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Minimum salary must be greater than 0")
    private BigDecimal salaryMin;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Maximum salary must be greater than 0")
    private BigDecimal salaryMax;
    
    @Size(max = 3, message = "Currency code must be 3 characters (e.g., USD, EUR)")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be a valid 3-letter code (e.g., USD, EUR, INR)")
    private String salaryCurrency;
    
    @Pattern(regexp = "^(REMOTE|ONSITE|HYBRID)$", message = "Work mode must be REMOTE, ONSITE, or HYBRID")
    private String workMode;
    
    @Pattern(regexp = "^(HIGH_SCHOOL|BACHELOR|MASTER|PHD)$", message = "Education level must be HIGH_SCHOOL, BACHELOR, MASTER, or PHD")
    private String educationLevel;
    
    @Size(max = 500, message = "Skills must not exceed 500 characters")
    private String skills;
    
    @Size(max = 5000, message = "Company info must not exceed 5000 characters")
    private String companyInfo; // Company description/about text
    
    @Size(max = 500, message = "Company logo URL must not exceed 500 characters")
    private String companyLogoUrl; // URL to company logo image
    
    @NotNull(message = "Posted by user ID is required")
    private Long postedBy;
    
    @Future(message = "Application deadline must be a future date")
    private Instant applicationDeadline;
    
    @Future(message = "Start date must be a future date")
    private Instant startDate;
    
    private Instant createdAt;
    private Instant updatedAt;
}