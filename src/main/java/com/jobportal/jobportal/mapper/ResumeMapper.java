package com.jobportal.jobportal.mapper;

import com.jobportal.jobportal.dto.ResumeDTO;
import com.jobportal.jobportal.entity.Resume;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * MapStruct mapper for converting between Resume entity and ResumeDTO.
 * Automatically generates mapping implementations at compile time.
 * 
 * @author Job Portal Team
 * @version 2.0
 */
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ResumeMapper {

    /**
     * Converts Resume entity to ResumeDTO.
     * Maps user relationship to userId field.
     * 
     * @param resume The Resume entity to convert
     * @return ResumeDTO object or null if input is null
     */
    @Mapping(source = "user.id", target = "userId")
    ResumeDTO toDto(Resume resume);

    /**
     * Converts ResumeDTO to Resume entity.
     * Note: User relationship is not set in this method.
     * 
     * @param resumeDto The ResumeDTO to convert
     * @return Resume entity object or null if input is null
     */
    Resume toEntity(ResumeDTO resumeDto);

    /**
     * Updates an existing Resume entity with values from ResumeDTO.
     * 
     * @param dto The ResumeDTO containing updated values
     * @param target The existing Resume entity to update
     */
    void updateEntity(ResumeDTO dto, @MappingTarget Resume target);
}
