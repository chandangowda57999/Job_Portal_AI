package com.jobportal.jobportal.mapper;

import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.entity.User;

public class UserMapper {

    // Entity -> DTO
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

    // DTO -> Entity (for create)
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

    // Apply DTO onto existing Entity (for update)
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
