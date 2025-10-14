package com.jobportal.jobportal.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jobportal.jobportal.entity.User;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
