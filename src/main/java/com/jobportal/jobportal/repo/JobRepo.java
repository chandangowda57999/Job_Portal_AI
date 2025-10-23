package com.jobportal.jobportal.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobportal.jobportal.entity.Job;

import java.util.Optional;

public interface JobRepo extends JpaRepository<Job, Long> {
    Optional<Job> findByEmail(String email);
}
