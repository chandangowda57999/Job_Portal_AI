package com.jobportal.jobportal.mapper;

import com.jobportal.jobportal.dto.JobDTO;
import com.jobportal.jobportal.entity.Job;

public class JobMapper {

    // Entity -> DTO
    public static JobDTO jobEntityToDto(Job job) {
        if (job == null) return null;
        
        return JobDTO.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(job.getCompany())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .status(job.getStatus())
                .experienceLevel(job.getExperienceLevel())
                .department(job.getDepartment())
                .category(job.getCategory())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .responsibilities(job.getResponsibilities())
                .benefits(job.getBenefits())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .salaryCurrency(job.getSalaryCurrency())
                .workMode(job.getWorkMode())
                .educationLevel(job.getEducationLevel())
                .skills(job.getSkills())
                .postedBy(job.getPostedBy())
                .applicationDeadline(job.getApplicationDeadline())
                .startDate(job.getStartDate())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }

    // DTO -> Entity (for create)
    public static Job dtoToEntity(JobDTO dto) {
        if (dto == null) return null;
        
        return Job.builder()
                .id(dto.getId()) // stays null for create; can be used in upserts if needed
                .title(dto.getTitle())
                .company(dto.getCompany())
                .location(dto.getLocation())
                .jobType(dto.getJobType())
                .status(dto.getStatus())
                .experienceLevel(dto.getExperienceLevel())
                .department(dto.getDepartment())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .requirements(dto.getRequirements())
                .responsibilities(dto.getResponsibilities())
                .benefits(dto.getBenefits())
                .salaryMin(dto.getSalaryMin())
                .salaryMax(dto.getSalaryMax())
                .salaryCurrency(dto.getSalaryCurrency())
                .workMode(dto.getWorkMode())
                .educationLevel(dto.getEducationLevel())
                .skills(dto.getSkills())
                .postedBy(dto.getPostedBy())
                .applicationDeadline(dto.getApplicationDeadline())
                .startDate(dto.getStartDate())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }

    // Apply DTO onto existing Entity (for update)
    public static void apply(JobDTO dto, Job target) {
        if (dto == null || target == null) return;
        
        target.setTitle(dto.getTitle());
        target.setCompany(dto.getCompany());
        target.setLocation(dto.getLocation());
        target.setJobType(dto.getJobType());
        target.setStatus(dto.getStatus());
        target.setExperienceLevel(dto.getExperienceLevel());
        target.setDepartment(dto.getDepartment());
        target.setCategory(dto.getCategory());
        target.setDescription(dto.getDescription());
        target.setRequirements(dto.getRequirements());
        target.setResponsibilities(dto.getResponsibilities());
        target.setBenefits(dto.getBenefits());
        target.setSalaryMin(dto.getSalaryMin());
        target.setSalaryMax(dto.getSalaryMax());
        target.setSalaryCurrency(dto.getSalaryCurrency());
        target.setWorkMode(dto.getWorkMode());
        target.setEducationLevel(dto.getEducationLevel());
        target.setSkills(dto.getSkills());
        target.setPostedBy(dto.getPostedBy());
        target.setApplicationDeadline(dto.getApplicationDeadline());
        target.setStartDate(dto.getStartDate());
    }
}