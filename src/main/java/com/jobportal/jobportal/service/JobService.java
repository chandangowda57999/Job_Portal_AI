package com.jobportal.jobportal.service;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobportal.jobportal.customexceptionhandler.JobNotFoundException;
import com.jobportal.jobportal.customexceptionhandler.ValidationException;
import com.jobportal.jobportal.dto.JobDTO;
import com.jobportal.jobportal.dto.JobDetailDTO;
import com.jobportal.jobportal.dto.MatchFactorDTO;
import com.jobportal.jobportal.dto.SimilarJobDTO;
import com.jobportal.jobportal.entity.Job;
import com.jobportal.jobportal.mapper.JobMapper;
import com.jobportal.jobportal.repo.JobRepo;

/**
 * Service class for Job entity operations.
 * Provides business logic for job CRUD operations, job detail retrieval,
 * similar jobs calculation, and match score calculation.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Service
@Transactional(readOnly = true)
public class JobService {

    private final JobRepo repo;
    
    /**
     * Constructor for JobService.
     * 
     * @param repo The Job repository for database operations
     */
    @Autowired
    public JobService(JobRepo repo) {
        this.repo = repo;
    }
    
    /**
     * Creates a new job.
     * 
     * This method validates the job data, converts the DTO to an entity,
     * saves it to the database, and returns the saved job as a DTO.
     * 
     * @param jobDto The job data to create. Must be valid.
     * @return JobDTO containing the created job details
     * @throws ValidationException if validation fails
     */
    @Transactional
    public JobDTO create(JobDTO jobDto) {
        validateJobBusinessRules(jobDto);
        Job entity = JobMapper.dtoToEntity(jobDto);
        Job saved = repo.save(entity);
        return JobMapper.jobEntityToDto(saved);
    }

    /**
     * Retrieves a job by its ID.
     * 
     * @param id The ID of the job to retrieve
     * @return JobDTO containing the job details
     * @throws JobNotFoundException if job is not found
     */
    public JobDTO getById(Long id) {
        return repo.findById(id)
            .map(JobMapper::jobEntityToDto)
            .orElseThrow(() -> new JobNotFoundException(id));
    }

    /**
     * Retrieves job detail by ID with match score and similar jobs.
     * 
     * This method is specifically designed for the frontend JobDetail page.
     * It returns a JobDetailDTO with all frontend-compatible fields including:
     * - Formatted compensation, type, and postedAt
     * - Keywords array (from skills)
     * - Requirements array (from requirements string)
     * - Company object (from company name and logo URL)
     * - Match score and match factors (computed)
     * - Similar jobs (computed)
     * 
     * @param id The ID of the job to retrieve
     * @param userId The ID of the user viewing the job (for match score calculation, can be null)
     * @return JobDetailDTO with all fields formatted for frontend
     * @throws JobNotFoundException if job is not found
     */
    public JobDetailDTO getJobDetailById(Long id, Long userId) {
        Job job = repo.findById(id)
            .orElseThrow(() -> new JobNotFoundException(id));
        
        // Calculate match score (stub for now - can be enhanced with AI)
        Integer matchScore = calculateMatchScore(job, userId);
        
        // Get match factors (stub for now - can be enhanced with AI)
        List<MatchFactorDTO> matchFactors = getMatchFactors(job, userId);
        
        // Get similar jobs
        List<SimilarJobDTO> similarJobs = getSimilarJobs(job.getId(), 5);
        
        // Check if job is saved (stub for now - can be enhanced with saved jobs tracking)
        Boolean saved = false; // TODO: Implement saved jobs tracking
        
        return JobMapper.toJobDetailDTO(job, matchScore, matchFactors, similarJobs, saved);
    }

    /**
     * Retrieves all jobs in the system.
     * 
     * @return List of JobDTO objects for all jobs
     */
    public List<JobDTO> getAllJobs() {
        return repo.findAll().stream()
            .map(JobMapper::jobEntityToDto)
            .toList();
    }

    /**
     * Retrieves jobs by company name (case-insensitive).
     * 
     * This method uses case-insensitive search to find jobs by company name.
     * The company parameter is URL-decoded to handle URL-encoded values.
     * 
     * @param company The company name to search for (case-insensitive, URL-decoded)
     * @return List of JobDTO objects for jobs with the specified company name
     */
    public List<JobDTO> getJobsByCompany(String company) {
        if (company == null || company.trim().isEmpty()) {
            return Collections.emptyList();
        }
        // URL decode the company name to handle URL-encoded values
        // If decoding fails (not URL-encoded), use the original value
        String decodedCompany = company;
        try {
            decodedCompany = URLDecoder.decode(company, StandardCharsets.UTF_8);
        } catch (Exception e) {
            // Not URL-encoded, use original value
            decodedCompany = company;
        }
        return repo.findByCompanyIgnoreCase(decodedCompany).stream()
            .map(JobMapper::jobEntityToDto)
            .toList();
    }

    /**
     * Retrieves jobs by location (case-insensitive).
     * 
     * This method uses case-insensitive search to find jobs by location.
     * The location parameter is URL-decoded to handle URL-encoded values.
     * 
     * @param location The location to search for (case-insensitive, URL-decoded)
     * @return List of JobDTO objects for jobs with the specified location
     */
    public List<JobDTO> getJobsByLocation(String location) {
        if (location == null || location.trim().isEmpty()) {
            return Collections.emptyList();
        }
        // URL decode the location to handle URL-encoded values
        // If decoding fails (not URL-encoded), use the original value
        String decodedLocation = location;
        try {
            decodedLocation = URLDecoder.decode(location, StandardCharsets.UTF_8);
        } catch (Exception e) {
            // Not URL-encoded, use original value
            decodedLocation = location;
        }
        return repo.findByLocationIgnoreCase(decodedLocation).stream()
            .map(JobMapper::jobEntityToDto)
            .toList();
    }

    /**
     * Retrieves jobs by job type.
     * 
     * @param jobType The job type to search for
     * @return List of JobDTO objects for jobs with the specified job type
     */
    public List<JobDTO> getJobsByJobType(Job.JobType jobType) {
        if (jobType == null) {
            return Collections.emptyList();
        }
        return repo.findByJobType(jobType).stream()
            .map(JobMapper::jobEntityToDto)
            .toList();
    }

    /**
     * Retrieves all active jobs.
     * 
     * @return List of JobDTO objects for all active jobs
     */
    public List<JobDTO> getActiveJobs() {
        return repo.findByStatus(Job.JobStatus.ACTIVE).stream()
            .map(JobMapper::jobEntityToDto)
            .toList();
    }

    /**
     * Retrieves jobs posted by a specific user.
     * 
     * This method returns all jobs posted by the user with the specified ID.
     * Useful for "My Job Postings" functionality.
     * 
     * @param userId The ID of the user who posted the jobs
     * @return List of JobDTO objects for jobs posted by the specified user
     */
    public List<JobDTO> getJobsByPostedBy(Long userId) {
        if (userId == null) {
            return Collections.emptyList();
        }
        return repo.findByPostedBy(userId).stream()
            .map(JobMapper::jobEntityToDto)
            .toList();
    }

    /**
     * Retrieves similar jobs for a given job.
     * 
     * This method finds jobs that are similar to the given job based on:
     * - Same category (if available)
     * - Same job type (if available)
     * - Active status only
     * 
     * Results are limited to the specified number and ordered by relevance.
     * Each similar job is converted to a SimilarJobDTO with a match percentage.
     * 
     * @param jobId The ID of the job to find similar jobs for
     * @param limit Maximum number of similar jobs to return
     * @return List of SimilarJobDTO objects for similar jobs (up to limit)
     */
    public List<SimilarJobDTO> getSimilarJobs(Long jobId, int limit) {
        if (jobId == null) {
            return Collections.emptyList();
        }
        
        Job job = repo.findById(jobId)
            .orElseThrow(() -> new JobNotFoundException(jobId));
        
        // Find similar jobs based on category and job type
        List<Job> similarJobs = repo.findSimilarJobs(
            jobId,
            job.getCategory(),
            job.getJobType()
        );
        
        // Limit results and convert to SimilarJobDTO
        return similarJobs.stream()
            .limit(limit)
            .map(similarJob -> {
                // Calculate match percentage (stub - can be enhanced)
                int matchPercentage = calculateSimilarityMatch(job, similarJob);
                
                return SimilarJobDTO.builder()
                    .id(similarJob.getId() != null ? similarJob.getId().toString() : null)
                    .title(similarJob.getTitle())
                    .company(similarJob.getCompany())
                    .match(matchPercentage)
                    .build();
            })
            .collect(Collectors.toList());
    }

    /**
     * Calculates the match score between a job and a user's profile.
     * 
     * This is a stub method that returns a default match score.
     * Can be enhanced with AI/ML algorithms to calculate actual match scores
     * based on user skills, experience, education, etc.
     * 
     * @param job The job to calculate match score for
     * @param userId The ID of the user (can be null)
     * @return Match score (0-100), or 0 if userId is null
     */
    public Integer calculateMatchScore(Job job, Long userId) {
        if (userId == null || job == null) {
            return 0; // No user provided, return 0 match score
        }
        
        // TODO: Implement actual match score calculation
        // This can be enhanced with:
        // - User skills vs job requirements
        // - User experience vs job experience level
        // - User education vs job education requirements
        // - User location preferences vs job location
        // - Machine learning algorithms for better matching
        
        // Stub implementation: Return a default score
        // In a real implementation, this would:
        // 1. Fetch user profile and resume
        // 2. Compare user skills with job skills
        // 3. Compare user experience with job experience level
        // 4. Calculate weighted match score
        
        return 75; // Default match score (stub)
    }

    /**
     * Calculates match factors explaining the match score.
     * 
     * This is a stub method that returns default match factors.
     * Can be enhanced with AI/ML algorithms to calculate actual match factors
     * based on user skills, experience, education, etc.
     * 
     * @param job The job to calculate match factors for
     * @param userId The ID of the user (can be null)
     * @return List of MatchFactorDTO objects explaining the match score
     */
    public List<MatchFactorDTO> getMatchFactors(Job job, Long userId) {
        if (userId == null || job == null || job.getSkills() == null) {
            return Collections.emptyList();
        }
        
        // TODO: Implement actual match factor calculation
        // This can be enhanced with:
        // - User skills vs job skills comparison
        // - Skill weight calculation based on job requirements
        // - Experience level matching
        // - Education level matching
        // - Location preference matching
        
        // Stub implementation: Return default match factors based on job skills
        List<MatchFactorDTO> factors = new ArrayList<>();
        
        if (job.getSkills() != null && !job.getSkills().trim().isEmpty()) {
            String[] skills = job.getSkills().split(",");
            double weightPerSkill = 1.0 / skills.length; // Equal weight for each skill
            
            for (String skill : skills) {
                String trimmedSkill = skill.trim();
                if (!trimmedSkill.isEmpty()) {
                    // Stub: Default score of 0.8 for each skill (80% match)
                    // In a real implementation, this would compare with user skills
                    factors.add(MatchFactorDTO.builder()
                        .label(trimmedSkill)
                        .weight(weightPerSkill)
                        .score(0.8) // Default score (stub)
                        .build());
                }
            }
        }
        
        return factors;
    }

    /**
     * Calculates similarity match percentage between two jobs.
     * 
     * This is a helper method used to calculate match percentages for similar jobs.
     * It compares various attributes between two jobs and returns a match percentage.
     * 
     * @param job1 The first job (original job)
     * @param job2 The second job (similar job)
     * @return Match percentage (0-100)
     */
    private int calculateSimilarityMatch(Job job1, Job job2) {
        if (job1 == null || job2 == null) {
            return 0;
        }
        
        int matchScore = 0;
        int totalFactors = 0;
        
        // Compare category
        if (job1.getCategory() != null && job2.getCategory() != null) {
            totalFactors++;
            if (job1.getCategory().equalsIgnoreCase(job2.getCategory())) {
                matchScore += 40; // Category match contributes 40%
            }
        }
        
        // Compare job type
        if (job1.getJobType() != null && job2.getJobType() != null) {
            totalFactors++;
            if (job1.getJobType() == job2.getJobType()) {
                matchScore += 30; // Job type match contributes 30%
            }
        }
        
        // Compare skills (partial match)
        if (job1.getSkills() != null && job2.getSkills() != null) {
            totalFactors++;
            List<String> skills1 = JobMapper.skillsToKeywords(job1.getSkills());
            List<String> skills2 = JobMapper.skillsToKeywords(job2.getSkills());
            
            long commonSkills = skills1.stream()
                .filter(skills2::contains)
                .count();
            
            if (!skills1.isEmpty()) {
                double skillMatchRatio = (double) commonSkills / skills1.size();
                matchScore += (int)(skillMatchRatio * 30); // Skills match contributes up to 30%
            }
        }
        
        // Normalize to 0-100 range
        if (totalFactors > 0) {
            return Math.min(100, matchScore);
        }
        
        return 50; // Default match score if no factors to compare
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