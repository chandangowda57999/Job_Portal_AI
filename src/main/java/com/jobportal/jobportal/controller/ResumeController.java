package com.jobportal.jobportal.controller;

import com.jobportal.jobportal.dto.ResumeDTO;
import com.jobportal.jobportal.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * REST Controller for managing resume operations.
 * Provides endpoints for uploading, downloading, and managing user resumes.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    /**
     * Constructor for ResumeController.
     * 
     * @param resumeService The service layer for resume operations
     */
    @Autowired
    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    /**
     * Uploads a resume file for a specific user.
     * Accepts PDF, DOC, and DOCX files with a maximum size of 10MB.
     * 
     * @param userId The ID of the user uploading the resume
     * @param file The resume file to upload (PDF, DOC, or DOCX)
     * @param description Optional description for the resume
     * @return ResponseEntity containing the uploaded resume details or error status
     */
    @PostMapping("/upload/{userId}")
    public ResponseEntity<ResumeDTO> uploadResume(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description) {
        
        try {
            ResumeDTO resume = resumeService.uploadResume(userId, file, description);
            return ResponseEntity.status(HttpStatus.CREATED).body(resume);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Retrieves all resumes for a specific user.
     * Returns a list of all resumes uploaded by the user.
     * 
     * @param userId The ID of the user whose resumes to retrieve
     * @return ResponseEntity containing a list of user's resumes
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ResumeDTO>> getUserResumes(@PathVariable Long userId) {
        List<ResumeDTO> resumes = resumeService.getUserResumes(userId);
        return ResponseEntity.ok(resumes);
    }

    /**
     * Retrieves the primary resume for a specific user.
     * Returns the resume marked as primary, or 404 if no primary resume exists.
     * 
     * @param userId The ID of the user whose primary resume to retrieve
     * @return ResponseEntity containing the primary resume or 404 if not found
     */
    @GetMapping("/user/{userId}/primary")
    public ResponseEntity<ResumeDTO> getPrimaryResume(@PathVariable Long userId) {
        ResumeDTO primaryResume = resumeService.getPrimaryResume(userId);
        if (primaryResume != null) {
            return ResponseEntity.ok(primaryResume);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Sets a specific resume as the primary resume for a user.
     * Automatically unsets any existing primary resume before setting the new one.
     * 
     * @param userId The ID of the user
     * @param resumeId The ID of the resume to set as primary
     * @return ResponseEntity containing the updated resume details or error status
     */
    @PutMapping("/user/{userId}/primary/{resumeId}")
    public ResponseEntity<ResumeDTO> setPrimaryResume(
            @PathVariable Long userId,
            @PathVariable Long resumeId) {
        
        try {
            ResumeDTO resume = resumeService.setPrimaryResume(userId, resumeId);
            return ResponseEntity.ok(resume);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Downloads a specific resume file for a user.
     * Returns the file content with proper headers for download.
     * 
     * @param userId The ID of the user who owns the resume
     * @param resumeId The ID of the resume to download
     * @return ResponseEntity containing the file content with download headers
     */
    @GetMapping("/user/{userId}/download/{resumeId}")
    public ResponseEntity<byte[]> downloadResume(
            @PathVariable Long userId,
            @PathVariable Long resumeId) {
        
        try {
            byte[] fileContent = resumeService.downloadResume(userId, resumeId);
            
            // Get resume info to set proper headers
            ResumeDTO resume = resumeService.getUserResumes(userId).stream()
                    .filter(r -> r.getId().equals(resumeId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Resume not found"));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", resume.getOriginalFileName());
            headers.setContentLength(fileContent.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileContent);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Deletes a specific resume for a user.
     * Removes both the database record and the physical file from storage.
     * 
     * @param userId The ID of the user who owns the resume
     * @param resumeId The ID of the resume to delete
     * @return ResponseEntity with no content on success or error status
     */
    @DeleteMapping("/user/{userId}/{resumeId}")
    public ResponseEntity<Void> deleteResume(
            @PathVariable Long userId,
            @PathVariable Long resumeId) {
        
        try {
            resumeService.deleteResume(userId, resumeId);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
