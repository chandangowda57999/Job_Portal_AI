package com.jobportal.jobportal.mapper;

import com.jobportal.jobportal.dto.JobDTO;
import com.jobportal.jobportal.entity.Job;

public class JobMapper {

    // Entity -> DTO
    public static JobDTO jobEntityToDto(Job job) {
        if (job == null) return null;
        JobDTO jobDTOObj = new JobDTO();
        jobDTOObj.setId(job.getId());
        jobDTOObj.setFirstName(job.getFirstName());
        jobDTOObj.setLastName(job.getLastName());
        jobDTOObj.setEmail(job.getEmail());
        jobDTOObj.setPhoneCountryCode(job.getPhoneCountryCode());
        jobDTOObj.setPhoneNumber(job.getPhoneNumber());
        jobDTOObj.setUserType(job.getUserType());
        return jobDTOObj;
    }

    // DTO -> Entity (for create)
    public static Job dtoToEntity(JobDTO dto) {
        if (dto == null) return null;
        Job u = new Job();
        u.setId(dto.getId()); // stays null for create; can be used in upserts if needed
        u.setFirstName(dto.getFirstName());
        u.setLastName(dto.getLastName());
        u.setEmail(dto.getEmail());
        u.setPhoneCountryCode(dto.getPhoneCountryCode());
        u.setPhoneNumber(dto.getPhoneNumber());
        u.setUserType(dto.getUserType());
        return u;
    }

    // Apply DTO onto existing Entity (for update)
    public static void apply(JobDTO dto, Job target) {
        if (dto == null || target == null) return;
        target.setFirstName(dto.getFirstName());
        target.setLastName(dto.getLastName());
        target.setEmail(dto.getEmail());
        target.setPhoneCountryCode(dto.getPhoneCountryCode());
        target.setPhoneNumber(dto.getPhoneNumber());
        target.setUserType(dto.getUserType());
    }
}
