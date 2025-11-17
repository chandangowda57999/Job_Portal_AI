package com.jobportal.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object for Job Detail page.
 * Contains all information needed for the frontend Job Detail page,
 * including match score, match factors, and similar jobs.
 * 
 * This DTO is specifically designed for the frontend JobDetail page
 * and includes computed fields like matchScore, matchFactors, and similarJobs.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDetailDTO {
    private String id;                    // Job ID as string for frontend
    private String role;                  // Job title (alias for title)
    private CompanyDTO company;           // Company object with name and logoUrl
    private String location;              // Job location
    private String compensation;          // Formatted salary range (e.g., "$150k–$190k + equity")
    private String type;                  // Formatted job type (e.g., "Full-time")
    private String postedAt;              // Formatted posted date (e.g., "2 days ago")
    private List<String> keywords;        // Array of keywords extracted from skills
    private String description;           // Job description
    private List<String> requirements;    // Array of requirements
    private String companyInfo;           // Company description/about text
    private List<SimilarJobDTO> similarJobs; // Array of similar job opportunities
    private Integer matchScore;           // AI-calculated match percentage (0-100)
    private List<MatchFactorDTO> matchFactors; // Breakdown of match score by factor
    private Boolean saved;                // Whether user has saved this job
}

