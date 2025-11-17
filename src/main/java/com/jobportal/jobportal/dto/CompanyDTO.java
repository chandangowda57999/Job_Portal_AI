package com.jobportal.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Company information in Job Detail.
 * Used to represent company as an object with name and logoUrl.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDTO {
    private String name;
    private String logoUrl;
}

