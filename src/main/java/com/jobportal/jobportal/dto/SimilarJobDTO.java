package com.jobportal.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Similar Job in Job Detail.
 * Represents a similar job opportunity with match percentage.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimilarJobDTO {
    private String id;      // Job ID
    private String title;   // Job title
    private String company; // Company name
    private Integer match;  // Match percentage (0-100)
}

