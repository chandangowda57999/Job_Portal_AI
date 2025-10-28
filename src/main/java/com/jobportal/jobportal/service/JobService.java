package com.jobportal.jobportal.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobportal.jobportal.customexceptionhandler.JobNotFoundException;
import com.jobportal.jobportal.customexceptionhandler.ValidationException;
import com.jobportal.jobportal.dto.JobDTO;
import com.jobportal.jobportal.entity.Job;
import com.jobportal.jobportal.mapper.JobMapper;
import com.jobportal.jobportal.repo.JobRepo;

@Service
@Transactional(readOnly = true)
public class JobService {

    private final JobRepo repo;
    
    @Autowired
    public JobService(JobRepo repo) {   // <-- initializes the final field
        this.repo = repo;
    }
    
    @Transactional
    public JobDTO create(JobDTO jobDto) {
        validateJobBusinessRules(jobDto);
        Job entity = JobMapper.dtoToEntity(jobDto);
        Job saved = repo.save(entity);
        return JobMapper.jobEntityToDto(saved);
    }

    public JobDTO getById(Long id) {
        return repo.findById(id)
            .map(JobMapper::jobEntityToDto)
            .orElseThrow(() -> new JobNotFoundException(id));
    }

    public List<JobDTO> getAllJobs() {
        return repo.findAll().stream()
            .map(JobMapper::jobEntityToDto)
            .toList();
    }

    public List<JobDTO> getJobsByCompany(String company) {
        return repo.findByCompany(company).stream()
            .map(JobMapper::jobEntityToDto)
            .toList();
    }

    public List<JobDTO> getJobsByLocation(String location) {
        return repo.findByLocation(location).stream()
            .map(JobMapper::jobEntityToDto)
            .toList();
    }

    public List<JobDTO> getJobsByJobType(Job.JobType jobType) {
        return repo.findByJobType(jobType).stream()
            .map(JobMapper::jobEntityToDto)
            .toList();
    }

    public List<JobDTO> getActiveJobs() {
        return repo.findByStatus(Job.JobStatus.ACTIVE).stream()
            .map(JobMapper::jobEntityToDto)
            .toList();
    }

    @Transactional
    public JobDTO update(Long id, JobDTO dto) {
        validateJobBusinessRules(dto);
        Job existing = repo.findById(id)
            .orElseThrow(() -> new JobNotFoundException(id));
        
        JobMapper.apply(dto, existing);
        return JobMapper.jobEntityToDto(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new JobNotFoundException(id);
        repo.deleteById(id);
    }

    /**
     * Validates business rules for job creation/update.
     * 
     * @param jobDto The job data to validate
     * @throws ValidationException if validation fails
     */
    private void validateJobBusinessRules(JobDTO jobDto) {
        // Validate salary range
        if (jobDto.getSalaryMin() != null && jobDto.getSalaryMax() != null) {
            if (jobDto.getSalaryMin().compareTo(jobDto.getSalaryMax()) >= 0) {
                throw new ValidationException("Minimum salary must be less than maximum salary");
            }
        }
        
        // Validate that if salary is provided, currency must be provided too
        if ((jobDto.getSalaryMin() != null || jobDto.getSalaryMax() != null) 
                && jobDto.getSalaryCurrency() == null) {
            throw new ValidationException("Currency must be specified when salary range is provided");
        }
    }
}