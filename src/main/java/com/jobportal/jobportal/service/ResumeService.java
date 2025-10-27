package com.jobportal.jobportal.service;

import com.jobportal.jobportal.customexceptionhandler.UserNotFoundException;
import com.jobportal.jobportal.dto.ResumeDTO;
import com.jobportal.jobportal.entity.Resume;
import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.mapper.ResumeMapper;
import com.jobportal.jobportal.repo.ResumeRepo;
import com.jobportal.jobportal.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

/**
 * Service class for managing resume operations.
 * Handles file upload, download, storage, and database operations for resumes.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
@Service
@Transactional(readOnly = true)
public class ResumeService {

    private final ResumeRepo resumeRepo;
    private final UserRepo userRepo;

    // Configuration properties from application.properties
    @Value("${resume.storage.path}")
    private String storagePath;

    @Value("${resume.allowed.types}")
    private String allowedTypes;

    @Value("${resume.max.file.size}")
    private long maxFileSize;

    /**
     * Constructor for ResumeService.
     * 
     * @param resumeRepo Repository for resume database operations
     * @param userRepo Repository for user database operations
     */
    @Autowired
    public ResumeService(ResumeRepo resumeRepo, UserRepo userRepo) {
        this.resumeRepo = resumeRepo;
        this.userRepo = userRepo;
    }

    /**
     * Uploads a resume file for a specific user.
     * Validates the file, creates storage directory if needed, saves the file,
     * and stores resume metadata in the database.
     * 
     * @param userId The ID of the user uploading the resume
     * @param file The resume file to upload
     * @param description Optional description for the resume
     * @return ResumeDTO containing the uploaded resume details
     * @throws IOException if file operations fail
     * @throws RuntimeException if validation fails
     */
    @Transactional
    public ResumeDTO uploadResume(Long userId, MultipartFile file, String description) throws IOException {
        // Validate user exists
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // Validate file
        validateFile(file);

        // Create storage directory if it doesn't exist
        Path storageDir = Paths.get(storagePath);
        if (!Files.exists(storageDir)) {
            Files.createDirectories(storageDir);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + "." + fileExtension;
        Path filePath = storageDir.resolve(uniqueFilename);

        // Save file to disk
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Create resume entity
        Resume resume = Resume.builder()
                .fileName(uniqueFilename)
                .fileType(fileExtension.toUpperCase())
                .fileSize(file.getSize())
                .filePath(filePath.toString())
                .originalFileName(originalFilename)
                .description(description)
                .isPrimary(false) // New resumes are not primary by default
                .user(user)
                .build();

        Resume savedResume = resumeRepo.save(resume);
        return ResumeMapper.resumeEntityToDto(savedResume);
    }

    /**
     * Retrieves all resumes for a specific user.
     * 
     * @param userId The ID of the user whose resumes to retrieve
     * @return List of ResumeDTO objects for the user
     */
    public List<ResumeDTO> getUserResumes(Long userId) {
        return resumeRepo.findByUserId(userId).stream()
                .map(ResumeMapper::resumeEntityToDto)
                .toList();
    }

    /**
     * Retrieves the primary resume for a specific user.
     * 
     * @param userId The ID of the user whose primary resume to retrieve
     * @return ResumeDTO of the primary resume, or null if no primary resume exists
     */
    public ResumeDTO getPrimaryResume(Long userId) {
        return resumeRepo.findByUserIdAndIsPrimaryTrue(userId)
                .map(ResumeMapper::resumeEntityToDto)
                .orElse(null);
    }

    /**
     * Sets a specific resume as the primary resume for a user.
     * Automatically unsets any existing primary resume before setting the new one.
     * 
     * @param userId The ID of the user
     * @param resumeId The ID of the resume to set as primary
     * @return ResumeDTO of the updated resume
     * @throws RuntimeException if resume doesn't belong to user or operation fails
     */
    @Transactional
    public ResumeDTO setPrimaryResume(Long userId, Long resumeId) {
        // Validate resume belongs to user
        if (!resumeRepo.existsByUserIdAndId(userId, resumeId)) {
            throw new RuntimeException("Resume not found for user");
        }

        // Unset current primary resume
        resumeRepo.unsetPrimaryResumeForUser(userId);

        // Set new primary resume
        int updated = resumeRepo.setPrimaryResume(resumeId, userId);
        if (updated == 0) {
            throw new RuntimeException("Failed to set primary resume");
        }

        return resumeRepo.findById(resumeId)
                .map(ResumeMapper::resumeEntityToDto)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
    }

    /**
     * Deletes a specific resume for a user.
     * Removes both the database record and the physical file from storage.
     * 
     * @param userId The ID of the user who owns the resume
     * @param resumeId The ID of the resume to delete
     * @throws IOException if file deletion fails
     * @throws RuntimeException if resume not found
     */
    @Transactional
    public void deleteResume(Long userId, Long resumeId) throws IOException {
        Resume resume = resumeRepo.findByUserIdAndId(userId, resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // Delete file from disk
        Path filePath = Paths.get(resume.getFilePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        // Delete from database
        resumeRepo.delete(resume);
    }

    /**
     * Downloads a specific resume file for a user.
     * Reads the file content from storage and returns it as byte array.
     * 
     * @param userId The ID of the user who owns the resume
     * @param resumeId The ID of the resume to download
     * @return byte array containing the file content
     * @throws IOException if file reading fails
     * @throws RuntimeException if resume not found or file doesn't exist
     */
    public byte[] downloadResume(Long userId, Long resumeId) throws IOException {
        Resume resume = resumeRepo.findByUserIdAndId(userId, resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        Path filePath = Paths.get(resume.getFilePath());
        if (!Files.exists(filePath)) {
            throw new RuntimeException("File not found on disk");
        }

        return Files.readAllBytes(filePath);
    }

    /**
     * Validates uploaded file against system requirements.
     * Checks file size, type, and filename validity.
     * 
     * @param file The file to validate
     * @throws RuntimeException if validation fails
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new RuntimeException("File size exceeds maximum allowed size");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new RuntimeException("Invalid filename");
        }

        String fileExtension = getFileExtension(originalFilename).toLowerCase();
        String[] allowedExtensions = allowedTypes.split(",");
        
        boolean isValidType = false;
        for (String allowedType : allowedExtensions) {
            if (allowedType.trim().equalsIgnoreCase(fileExtension)) {
                isValidType = true;
                break;
            }
        }

        if (!isValidType) {
            throw new RuntimeException("File type not allowed. Allowed types: " + allowedTypes);
        }
    }

    /**
     * Extracts file extension from filename.
     * 
     * @param filename The filename to extract extension from
     * @return The file extension (without dot) or empty string if no extension
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
}
