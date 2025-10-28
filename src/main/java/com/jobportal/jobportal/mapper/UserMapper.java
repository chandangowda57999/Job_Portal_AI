package com.jobportal.jobportal.mapper;

import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * MapStruct mapper for converting between User entity and UserDTO.
 * Automatically generates mapping implementations at compile time.
 * 
 * @author Job Portal Team
 * @version 2.0
 */
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    /**
     * Converts User entity to UserDTO.
     * 
     * @param user The User entity to convert
     * @return UserDTO object or null if input is null
     */
    UserDTO toDto(User user);

    /**
     * Converts UserDTO to User entity.
     * 
     * @param dto The UserDTO to convert
     * @return User entity object or null if input is null
     */
    User toEntity(UserDTO dto);

    /**
     * Updates an existing User entity with values from UserDTO.
     * 
     * @param dto The UserDTO containing updated values
     * @param target The existing User entity to update
     */
    void updateEntity(UserDTO dto, @MappingTarget User target);
}
