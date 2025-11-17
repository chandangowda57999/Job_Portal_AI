package com.jobportal.jobportal.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobportal.jobportal.dto.JobDTO;
import com.jobportal.jobportal.dto.JobDetailDTO;
import com.jobportal.jobportal.entity.Job;
import com.jobportal.jobportal.service.JobService;

import java.util.List;

/**
 * REST Controller for managing job operations.
 * Provides endpoints for CRUD operations on jobs, job detail retrieval,
 * and job search functionality.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/job")
public class JobController {
	
	private final JobService service;
	
	/**
	 * Constructor for JobController.
	 * 
	 * @param service The service layer for job operations
	 */
	@Autowired
    public JobController(JobService service) {
        this.service = service;
    }
    
    /**
     * Creates a new job.
     * 
     * @param job The job data to create. Must be valid.
     * @return ResponseEntity containing the created job details
     */
    @PostMapping
    public ResponseEntity<JobDTO> create(@Valid @RequestBody JobDTO job) {
        return ResponseEntity.ok(service.create(job));
    }

    /**
     * Retrieves a job by its ID.
     * 
     * @param id The ID of the job to retrieve
     * @return ResponseEntity containing the job details
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }
    
    /**
     * Retrieves job detail by ID with match score and similar jobs.
     * 
     * This endpoint is specifically designed for the frontend JobDetail page.
     * It returns a JobDetailDTO with all frontend-compatible fields including:
     * - Formatted compensation, type, and postedAt
     * - Keywords array (from skills)
     * - Requirements array (from requirements string)
     * - Company object (from company name and logo URL)
     * - Match score and match factors (computed)
     * - Similar jobs (computed)
     * 
     * @param id The ID of the job to retrieve
     * @param userId Optional user ID for match score calculation (query parameter)
     * @return ResponseEntity containing the job detail with match score and similar jobs
     */
    @GetMapping("/{id}/detail")
    public ResponseEntity<JobDetailDTO> getJobDetailById(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(service.getJobDetailById(id, userId));
    }
    
    /**
     * Retrieves all jobs in the system.
     * 
     * @return ResponseEntity containing a list of all jobs
     */
    @GetMapping
    public ResponseEntity<List<JobDTO>> getAll() {
        return ResponseEntity.ok(service.getAllJobs());
    }

    /**
     * Retrieves jobs by company name (case-insensitive).
     * 
     * @param company The company name to search for (case-insensitive, URL-encoded)
     * @return ResponseEntity containing a list of jobs with the specified company name
     */
    @GetMapping("/company/{company}")
    public ResponseEntity<List<JobDTO>> getByCompany(@PathVariable String company) {
        return ResponseEntity.ok(service.getJobsByCompany(company));
    }

    /**
     * Retrieves jobs by location (case-insensitive).
     * 
     * @param location The location to search for (case-insensitive, URL-encoded)
     * @return ResponseEntity containing a list of jobs with the specified location
     */
    @GetMapping("/location/{location}")
    public ResponseEntity<List<JobDTO>> getByLocation(@PathVariable String location) {
        return ResponseEntity.ok(service.getJobsByLocation(location));
    }

    /**
     * Retrieves jobs by job type.
     * 
     * @param jobType The job type to search for
     * @return ResponseEntity containing a list of jobs with the specified job type
     */
    @GetMapping("/type/{jobType}")
    public ResponseEntity<List<JobDTO>> getByJobType(@PathVariable Job.JobType jobType) {
        return ResponseEntity.ok(service.getJobsByJobType(jobType));
    }

    /**
     * Retrieves all active jobs.
     * 
     * @return ResponseEntity containing a list of all active jobs
     */
    @GetMapping("/active")
    public ResponseEntity<List<JobDTO>> getActiveJobs() {
        return ResponseEntity.ok(service.getActiveJobs());
    }

    /**
     * Retrieves jobs posted by a specific user.
     * 
     * This endpoint is useful for "My Job Postings" functionality.
     * 
     * @param userId The ID of the user who posted the jobs
     * @return ResponseEntity containing a list of jobs posted by the specified user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<JobDTO>> getJobsByPostedBy(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getJobsByPostedBy(userId));
    }

    /**
     * Updates an existing job.
     * 
     * @param id The ID of the job to update
     * @param job The updated job data. Must be valid.
     * @return ResponseEntity containing the updated job details
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobDTO> update(@PathVariable Long id, @Valid @RequestBody JobDTO job) {
        return ResponseEntity.ok(service.update(id, job));
    }

    /**
     * Deletes a job by its ID.
     * 
     * @param id The ID of the job to delete
     * @return ResponseEntity with no content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}