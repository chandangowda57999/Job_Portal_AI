package com.jobportal.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 100)
    private String company;

    @Column(length = 100)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobType jobType; // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status; // ACTIVE, INACTIVE, CLOSED

    @Column(length = 50)
    private String experienceLevel; // ENTRY, MID, SENIOR, EXECUTIVE

    @Column(length = 100)
    private String department;

    @Column(length = 100)
    private String category; // IT, FINANCE, MARKETING, etc.

    @Lob
    private String description;

    @Lob
    private String requirements;

    @Lob
    private String responsibilities;

    @Lob
    private String benefits;

    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String salaryCurrency;

    @Column(length = 50)
    private String workMode; // REMOTE, ONSITE, HYBRID

    @Column(length = 100)
    private String educationLevel; // HIGH_SCHOOL, BACHELOR, MASTER, PHD

    @Column(length = 100)
    private String skills; // Comma-separated skills

    @Column(name = "posted_by")
    private Long postedBy; // Foreign key to User entity (employer)

    @Column(name = "application_deadline")
    private Instant applicationDeadline;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant updatedAt;

    @PrePersist
    public void onCreate() {
        var now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = Instant.now();
    }

    // Enums for better type safety
    public enum JobType {
        FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP
    }

    public enum JobStatus {
        ACTIVE, INACTIVE, CLOSED
    }
}