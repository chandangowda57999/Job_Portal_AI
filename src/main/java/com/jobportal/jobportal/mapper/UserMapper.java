package com.jobportal.jobportal.mapper;

import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.entity.User;

/**
 * Mapper class for converting between User entity and UserDTO.
 * Provides static methods for bidirectional conversion and field application.
 * 
 * @author Job Portal Team
 * @version 1.0
 */
public class UserMapper {

    /**
     * Converts User entity to UserDTO.
     * Maps all entity fields to corresponding DTO fields.
     * 
     * @param user The User entity to convert
     * @return UserDTO object or null if input is null
     */
    public static UserDTO userEntityToDto(User user) {
        if (user == null) return null;
        UserDTO userDtoObj = new UserDTO();
        userDtoObj.setId(user.getId());
        userDtoObj.setFirstName(user.getFirstName());
        userDtoObj.setLastName(user.getLastName());
        userDtoObj.setEmail(user.getEmail());
        userDtoObj.setPhoneCountryCode(user.getPhoneCountryCode());
        userDtoObj.setPhoneNumber(user.getPhoneNumber());
        userDtoObj.setUserType(user.getUserType());
        return userDtoObj;
    }

    /**
     * Converts UserDTO to User entity.
     * Maps all DTO fields to corresponding entity fields.
     * Used primarily for creating new users.
     * 
     * @param dto The UserDTO to convert
     * @return User entity object or null if input is null
     */
    public static User dtoToEntity(UserDTO dto) {
        if (dto == null) return null;
        User u = new User();
        u.setId(dto.getId()); // stays null for create; can be used in upserts if needed
        u.setFirstName(dto.getFirstName());
        u.setLastName(dto.getLastName());
        u.setEmail(dto.getEmail());
        u.setPhoneCountryCode(dto.getPhoneCountryCode());
        u.setPhoneNumber(dto.getPhoneNumber());
        u.setUserType(dto.getUserType());
        return u;
    }

    /**
     * Applies UserDTO fields to an existing User entity.
     * Used for updating existing users without creating new objects.
     * 
     * @param dto The UserDTO containing updated values
     * @param target The existing User entity to update
     */
    public static void apply(UserDTO dto, User target) {
        if (dto == null || target == null) return;
        target.setFirstName(dto.getFirstName());
        target.setLastName(dto.getLastName());
        target.setEmail(dto.getEmail());
        target.setPhoneCountryCode(dto.getPhoneCountryCode());
        target.setPhoneNumber(dto.getPhoneNumber());
        target.setUserType(dto.getUserType());
    }
}
