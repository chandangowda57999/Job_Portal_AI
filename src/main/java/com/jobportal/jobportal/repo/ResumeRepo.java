package com.jobportal.jobportal.repo;

import com.jobportal.jobportal.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Resume entity operations.
 * Extends JpaRepository to provide basic CRUD operations and custom queries.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Repository
public interface ResumeRepo extends JpaRepository<Resume, Long> {

    /**
     * Finds all resumes for a specific user.
     * 
     * @param userId The ID of the user
     * @return List of resumes belonging to the user
     */
    List<Resume> findByUserId(Long userId);

    /**
     * Finds the primary resume for a specific user.
     * 
     * @param userId The ID of the user
     * @return Optional containing the primary resume, or empty if none exists
     */
    Optional<Resume> findByUserIdAndIsPrimaryTrue(Long userId);

    /**
     * Finds a specific resume by user ID and resume ID.
     * Used for security validation to ensure user owns the resume.
     * 
     * @param userId The ID of the user
     * @param resumeId The ID of the resume
     * @return Optional containing the resume, or empty if not found
     */
    Optional<Resume> findByUserIdAndId(Long userId, Long resumeId);

    /**
     * Unsets all primary resumes for a specific user.
     * Sets isPrimary to false for all resumes belonging to the user.
     * 
     * @param userId The ID of the user
     */
    @Modifying
    @Query("UPDATE Resume r SET r.isPrimary = false WHERE r.user.id = :userId")
    void unsetPrimaryResumeForUser(@Param("userId") Long userId);

    /**
     * Sets a specific resume as primary for a user.
     * Sets isPrimary to true for the specified resume.
     * 
     * @param resumeId The ID of the resume to set as primary
     * @param userId The ID of the user who owns the resume
     * @return Number of rows updated (should be 1 if successful)
     */
    @Modifying
    @Query("UPDATE Resume r SET r.isPrimary = true WHERE r.id = :resumeId AND r.user.id = :userId")
    int setPrimaryResume(@Param("resumeId") Long resumeId, @Param("userId") Long userId);

    /**
     * Checks if a resume exists for a specific user.
     * Used for security validation.
     * 
     * @param userId The ID of the user
     * @param resumeId The ID of the resume
     * @return true if the resume exists and belongs to the user, false otherwise
     */
    boolean existsByUserIdAndId(Long userId, Long resumeId);
}
