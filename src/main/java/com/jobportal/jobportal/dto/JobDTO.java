package com.jobportal.jobportal.dto;

import com.jobportal.jobportal.entity.Job;
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
    private String title;
    private String company;
    private String location;
    private Job.JobType jobType;
    private Job.JobStatus status;
    private String experienceLevel;
    private String department;
    private String category;
    private String description;
    private String requirements;
    private String responsibilities;
    private String benefits;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String salaryCurrency;
    private String workMode;
    private String educationLevel;
    private String skills;
    private Long postedBy;
    private Instant applicationDeadline;
    private Instant startDate;
    private Instant createdAt;
    private Instant updatedAt;
}