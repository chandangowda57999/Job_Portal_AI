package com.jobportal.jobportal.mapper;

import com.jobportal.jobportal.dto.ResumeDTO;
import com.jobportal.jobportal.entity.Resume;

/**
 * Mapper class for converting between Resume entity and ResumeDTO.
 * Provides static methods for bidirectional conversion.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
public class ResumeMapper {

    /**
     * Converts Resume entity to ResumeDTO.
     * Maps all entity fields to corresponding DTO fields.
     * 
     * @param resume The Resume entity to convert
     * @return ResumeDTO object or null if input is null
     */
    public static ResumeDTO resumeEntityToDto(Resume resume) {
        if (resume == null) {
            return null;
        }

        return ResumeDTO.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .fileType(resume.getFileType())
                .fileSize(resume.getFileSize())
                .filePath(resume.getFilePath())
                .originalFileName(resume.getOriginalFileName())
                .isPrimary(resume.getIsPrimary())
                .description(resume.getDescription())
                .userId(resume.getUser() != null ? resume.getUser().getId() : null)
                .createdAt(resume.getCreatedAt())
                .updatedAt(resume.getUpdatedAt())
                .build();
    }

    /**
     * Converts ResumeDTO to Resume entity.
     * Maps all DTO fields to corresponding entity fields.
     * Note: User relationship is not set in this method.
     * 
     * @param resumeDto The ResumeDTO to convert
     * @return Resume entity object or null if input is null
     */
    public static Resume dtoToEntity(ResumeDTO resumeDto) {
        if (resumeDto == null) {
            return null;
        }

        return Resume.builder()
                .id(resumeDto.getId())
                .fileName(resumeDto.getFileName())
                .fileType(resumeDto.getFileType())
                .fileSize(resumeDto.getFileSize())
                .filePath(resumeDto.getFilePath())
                .originalFileName(resumeDto.getOriginalFileName())
                .isPrimary(resumeDto.getIsPrimary())
                .description(resumeDto.getDescription())
                .createdAt(resumeDto.getCreatedAt())
                .updatedAt(resumeDto.getUpdatedAt())
                .build();
    }
}
