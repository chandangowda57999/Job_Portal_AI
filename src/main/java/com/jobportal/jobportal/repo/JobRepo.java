package com.jobportal.jobportal.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jobportal.jobportal.entity.Job;

import java.util.List;

/**
 * Repository interface for Job entity operations.
 * Extends JpaRepository to provide basic CRUD operations and custom queries.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
public interface JobRepo extends JpaRepository<Job, Long> {
    
    /**
     * Finds jobs by company name (case-insensitive).
     * 
     * @param company The company name to search for (case-insensitive)
     * @return List of jobs with the specified company name
     */
    List<Job> findByCompanyIgnoreCase(String company);
    
    /**
     * Finds jobs by location (case-insensitive).
     * 
     * @param location The location to search for (case-insensitive)
     * @return List of jobs with the specified location
     */
    List<Job> findByLocationIgnoreCase(String location);
    
    /**
     * Finds jobs by job type.
     * 
     * @param jobType The job type to search for
     * @return List of jobs with the specified job type
     */
    List<Job> findByJobType(Job.JobType jobType);
    
    /**
     * Finds jobs by status.
     * 
     * @param status The job status to search for
     * @return List of jobs with the specified status
     */
    List<Job> findByStatus(Job.JobStatus status);
    
    /**
     * Finds jobs by category (case-insensitive).
     * 
     * @param category The category to search for (case-insensitive)
     * @return List of jobs with the specified category
     */
    List<Job> findByCategoryIgnoreCase(String category);
    
    /**
     * Finds jobs by department (case-insensitive).
     * 
     * @param department The department to search for (case-insensitive)
     * @return List of jobs with the specified department
     */
    List<Job> findByDepartmentIgnoreCase(String department);
    
    /**
     * Finds jobs posted by a specific user.
     * 
     * @param postedBy The user ID who posted the jobs
     * @return List of jobs posted by the specified user
     */
    List<Job> findByPostedBy(Long postedBy);
    
    /**
     * Finds similar jobs based on category and job type.
     * Excludes the current job and returns active jobs only.
     * 
     * This query finds jobs that share similar characteristics:
     * - Same category (if available)
     * - Same job type (if available)
     * - Active status only
     * 
     * Results are ordered by relevance:
     * 1. Jobs with matching category (priority)
     * 2. Jobs with matching job type (secondary)
     * 
     * Note: The limit should be applied in the service layer using stream().limit().
     * 
     * @param jobId The ID of the current job to exclude from results
     * @param category The category to match (can be null to match any category)
     * @param jobType The job type to match (can be null to match any job type)
     * @return List of similar jobs ordered by relevance
     */
    @Query("SELECT j FROM Job j WHERE j.id != :jobId " +
           "AND j.status = 'ACTIVE' " +
           "AND (:category IS NULL OR j.category = :category) " +
           "AND (:jobType IS NULL OR j.jobType = :jobType) " +
           "ORDER BY " +
           "CASE WHEN :category IS NOT NULL AND j.category = :category THEN 1 ELSE 2 END, " +
           "CASE WHEN :jobType IS NOT NULL AND j.jobType = :jobType THEN 1 ELSE 2 END")
    List<Job> findSimilarJobs(@Param("jobId") Long jobId, 
                              @Param("category") String category,
                              @Param("jobType") Job.JobType jobType);
    
    /**
     * Legacy method: Finds jobs by company name (case-sensitive).
     * Deprecated: Use findByCompanyIgnoreCase instead.
     * 
     * @deprecated Use {@link #findByCompanyIgnoreCase(String)} for case-insensitive search
     * @param company The company name to search for
     * @return List of jobs with the specified company name
     */
    @Deprecated
    List<Job> findByCompany(String company);
    
    /**
     * Legacy method: Finds jobs by location (case-sensitive).
     * Deprecated: Use findByLocationIgnoreCase instead.
     * 
     * @deprecated Use {@link #findByLocationIgnoreCase(String)} for case-insensitive search
     * @param location The location to search for
     * @return List of jobs with the specified location
     */
    @Deprecated
    List<Job> findByLocation(String location);
    
    /**
     * Legacy method: Finds jobs by category (case-sensitive).
     * Deprecated: Use findByCategoryIgnoreCase instead.
     * 
     * @deprecated Use {@link #findByCategoryIgnoreCase(String)} for case-insensitive search
     * @param category The category to search for
     * @return List of jobs with the specified category
     */
    @Deprecated
    List<Job> findByCategory(String category);
    
    /**
     * Legacy method: Finds jobs by department (case-sensitive).
     * Deprecated: Use findByDepartmentIgnoreCase instead.
     * 
     * @deprecated Use {@link #findByDepartmentIgnoreCase(String)} for case-insensitive search
     * @param department The department to search for
     * @return List of jobs with the specified department
     */
    @Deprecated
    List<Job> findByDepartment(String department);
}