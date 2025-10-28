package com.jobportal.jobportal.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobportal.jobportal.entity.Job;

import java.util.List;

public interface JobRepo extends JpaRepository<Job, Long> {
    List<Job> findByCompany(String company);
    List<Job> findByLocation(String location);
    List<Job> findByJobType(Job.JobType jobType);
    List<Job> findByStatus(Job.JobStatus status);
    List<Job> findByCategory(String category);
    List<Job> findByDepartment(String department);
    List<Job> findByPostedBy(Long postedBy);
}