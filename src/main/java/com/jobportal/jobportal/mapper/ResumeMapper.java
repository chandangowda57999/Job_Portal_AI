package com.jobportal.jobportal.mapper;

import com.jobportal.jobportal.dto.ResumeDTO;
import com.jobportal.jobportal.entity.Resume;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * MapStruct mapper for converting between Resume entity and ResumeDTO.
 */
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ResumeMapper {

	@Mapping(source = "user.id", target = "userId")
	ResumeDTO toDto(Resume resume);

	Resume toEntity(ResumeDTO resumeDto);

	void updateEntity(ResumeDTO dto, @MappingTarget Resume target);
}
