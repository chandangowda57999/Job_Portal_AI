package com.jobportal.jobportal.mapper;

import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * MapStruct mapper for converting between User entity and UserDTO.
 * Password field is automatically excluded from DTO conversion since UserDTO doesn't have a password field.
 */
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

	UserDTO toDto(User user);

	User toEntity(UserDTO dto);

	void updateEntity(UserDTO dto, @MappingTarget User target);
}
