package com.jobportal.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Match Factor in Job Detail.
 * Represents a single factor that contributes to the match score.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchFactorDTO {
    private String label;  // Factor name (e.g., "React", "TypeScript")
    private Double weight; // Importance weight (0-1)
    private Double score;  // Match score for this factor (0-1)
}

