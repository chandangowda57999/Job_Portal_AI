package com.jobportal.jobportal.service;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobportal.jobportal.customexceptionhandler.UserNotFoundException;
import com.jobportal.jobportal.dto.JobDTO;
import com.jobportal.jobportal.entity.Job;
import com.jobportal.jobportal.mapper.JobMapper;
import com.jobportal.jobportal.repo.JobRepo;

@Service
@Transactional(readOnly = true)
public class JobService {

    private final JobRepo repo;
    
    @Autowired
    public JobService(JobRepo repo) {   // <-- initializes the final field
        this.repo = repo;
    }
    @Transactional
    public JobDTO create(JobDTO userDto) {
        Job entity = JobMapper.dtoToEntity(userDto);
        Job saved = repo.save(entity);
        return JobMapper.jobEntityToDto(saved);
    }

    public JobDTO getById(Long id) {
        return repo.findById(id)
            .map(JobMapper::jobEntityToDto)
            .orElseThrow(() -> new UserNotFoundException(id));
    }

    public JobDTO getByEmail(String email) {
        return repo.findByEmail(email)
            .map(JobMapper::jobEntityToDto)
            .orElseThrow(() -> new UserNotFoundException(email));
    }

    public List<JobDTO> getAllUserList() {
        return repo.findAll().stream()
            .map(JobMapper::jobEntityToDto)
            .toList();
    }

    @Transactional
    public JobDTO update(Long id, JobDTO dto) {
        Job existing = repo.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setPhoneCountryCode(dto.getPhoneCountryCode());
        existing.setPhoneNumber(dto.getPhoneNumber());
        existing.setUserType(dto.getUserType());
        return JobMapper.jobEntityToDto(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new UserNotFoundException(id);
        repo.deleteById(id);
    }
}
