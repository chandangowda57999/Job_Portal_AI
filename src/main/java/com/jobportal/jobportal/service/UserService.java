package com.jobportal.jobportal.service;


import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal.jobportal.entity.User;
import com.jobportal.jobportal.repo.UserRepo;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

	@Autowired
    private UserRepo repo;

    public User create(User user) {
        return repo.save(user);
    }

    public User getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAll() {
        return repo.findAll();
    }

    public User update(Long id, User updated) {
        User u = getById(id);
        u.setFirstName(updated.getFirstName());
        u.setLastName(updated.getLastName());
        u.setEmail(updated.getEmail());
        u.setPhoneCountryCode(updated.getPhoneCountryCode());
        u.setPhoneNumber(updated.getPhoneNumber());
        u.setUserType(updated.getUserType());
        return repo.save(u);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}

