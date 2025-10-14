package com.jobportal.jobportal.service;


import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobportal.jobportal.customexceptionhandler.UserNotFoundException;
import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.mapper.UserMapper;
import com.jobportal.jobportal.repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

	
    private UserRepo repo;
    
    @Transactional
	public UserDTO create(UserDTO userDto) {
	    User entity = UserMapper.dtoToEntity(userDto);
	    User saved = repo.save(entity);
	    return UserMapper.userEntityToDto(saved);
	}

	public UserDTO getById(Long id) {
	    return repo.findById(id)
	            .map(UserMapper::userEntityToDto)
	            .orElseThrow(() -> new UserNotFoundException(id));
	}

	public UserDTO getByEmail(String email) {
	    return repo.findByEmail(email)
	            .map(UserMapper::userEntityToDto)
	            .orElseThrow(() -> new UserNotFoundException(email));
	}

	public List<UserDTO> getAllUserList() {
	    return repo.findAll().stream()
	            .map(UserMapper::userEntityToDto)
	            .toList();
	}

	public UserDTO update(Long id, UserDTO dto) {
	    User existing = repo.findById(id)
	            .orElseThrow(() -> new UserNotFoundException(id));

	    existing.setFirstName(dto.getFirstName());
	    existing.setLastName(dto.getLastName());
	    existing.setEmail(dto.getEmail());
	    existing.setPhoneCountryCode(dto.getPhoneCountryCode());
	    existing.setPhoneNumber(dto.getPhoneNumber());
	    existing.setUserType(dto.getUserType());

	    return UserMapper.userEntityToDto(repo.save(existing));
	}

	public void delete(Long id) {
	    if (!repo.existsById(id)) {
	        throw new UserNotFoundException(id);
	    }
	    repo.deleteById(id);
	}

}

