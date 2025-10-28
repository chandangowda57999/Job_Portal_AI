package com.jobportal.jobportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobportal.jobportal.dto.JobDTO;
import com.jobportal.jobportal.entity.Job;
import com.jobportal.jobportal.service.JobService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/job")
public class JobController {
	
	private final JobService service;
	
	@Autowired
    public JobController(JobService service) {   // injected by Spring
        this.service = service;
    }
    
    @PostMapping
    public ResponseEntity<JobDTO> create(@RequestBody JobDTO job) {
        return ResponseEntity.ok(service.create(job));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }
    
    @GetMapping
    public ResponseEntity<List<JobDTO>> getAll() {
        return ResponseEntity.ok(service.getAllJobs());
    }

    @GetMapping("/company/{company}")
    public ResponseEntity<List<JobDTO>> getByCompany(@PathVariable String company) {
        return ResponseEntity.ok(service.getJobsByCompany(company));
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<JobDTO>> getByLocation(@PathVariable String location) {
        return ResponseEntity.ok(service.getJobsByLocation(location));
    }

    @GetMapping("/type/{jobType}")
    public ResponseEntity<List<JobDTO>> getByJobType(@PathVariable Job.JobType jobType) {
        return ResponseEntity.ok(service.getJobsByJobType(jobType));
    }

    @GetMapping("/active")
    public ResponseEntity<List<JobDTO>> getActiveJobs() {
        return ResponseEntity.ok(service.getActiveJobs());
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobDTO> update(@PathVariable Long id, @RequestBody JobDTO job) {
        return ResponseEntity.ok(service.update(id, job));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}