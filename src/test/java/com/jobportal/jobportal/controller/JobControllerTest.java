package com.jobportal.jobportal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.jobportal.customexceptionhandler.JobNotFoundException;
import com.jobportal.jobportal.dto.JobDTO;
import com.jobportal.jobportal.entity.Job;
import com.jobportal.jobportal.service.JobService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for JobController.
 * Tests validation, error handling, and controller behavior.
 */
@WebMvcTest(controllers = JobController.class, excludeAutoConfiguration = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
    org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration.class
})
class JobControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JobService jobService;

    private JobDTO validJob;

    @BeforeEach
    void setUp() {
        validJob = JobDTO.builder()
                .id(1L)
                .title("Senior Java Developer")
                .company("Tech Corp")
                .location("New York, NY")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .experienceLevel("SENIOR")
                .department("Engineering")
                .category("IT")
                .description("We are looking for an experienced Java developer with 5+ years of experience in Spring Boot and microservices architecture.")
                .requirements("Java, Spring Boot, Microservices")
                .responsibilities("Design and develop scalable applications")
                .benefits("Health insurance, 401k, remote work")
                .salaryMin(new BigDecimal("100000"))
                .salaryMax(new BigDecimal("150000"))
                .salaryCurrency("USD")
                .workMode("HYBRID")
                .educationLevel("BACHELOR")
                .skills("Java, Spring Boot, Docker")
                .postedBy(1L)
                .applicationDeadline(Instant.now().plus(30, ChronoUnit.DAYS))
                .startDate(Instant.now().plus(60, ChronoUnit.DAYS))
                .build();
    }

    // ==================== CREATE TESTS ====================

    @Test
    void createJob_WithValidData_ShouldReturnCreatedJob() throws Exception {
        when(jobService.create(any(JobDTO.class))).thenReturn(validJob);

        mockMvc.perform(post("/api/v1/job")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validJob)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Senior Java Developer"))
                .andExpect(jsonPath("$.company").value("Tech Corp"))
                .andExpect(jsonPath("$.jobType").value("FULL_TIME"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));

        verify(jobService, times(1)).create(any(JobDTO.class));
    }

    @Test
    void createJob_WithMissingTitle_ShouldReturnBadRequest() throws Exception {
        JobDTO invalidJob = JobDTO.builder()
                .company("Tech Corp")
                .description("This is a test job description that meets the minimum character requirement for validation purposes.")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .postedBy(1L)
                .build();

        mockMvc.perform(post("/api/v1/job")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidJob)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").value("Job title is required"));

        verify(jobService, never()).create(any(JobDTO.class));
    }

    @Test
    void createJob_WithShortDescription_ShouldReturnBadRequest() throws Exception {
        JobDTO invalidJob = JobDTO.builder()
                .title("Developer")
                .company("Tech Corp")
                .description("Short") // Less than 50 characters
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .postedBy(1L)
                .build();

        mockMvc.perform(post("/api/v1/job")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidJob)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.description").value("Description must be between 50 and 5000 characters"));

        verify(jobService, never()).create(any(JobDTO.class));
    }

    @Test
    void createJob_WithInvalidCurrency_ShouldReturnBadRequest() throws Exception {
        JobDTO invalidJob = JobDTO.builder()
                .title("Developer")
                .company("Tech Corp")
                .description("This is a test job description that meets the minimum character requirement for validation purposes.")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .salaryMin(new BigDecimal("50000"))
                .salaryMax(new BigDecimal("100000"))
                .salaryCurrency("US") // Invalid - must be 3 letters
                .postedBy(1L)
                .build();

        mockMvc.perform(post("/api/v1/job")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidJob)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.salaryCurrency").exists());

        verify(jobService, never()).create(any(JobDTO.class));
    }

    @Test
    void createJob_WithMultipleValidationErrors_ShouldReturnAllErrors() throws Exception {
        JobDTO invalidJob = JobDTO.builder()
                .title("DE") // Too short
                .company("T") // Too short
                .description("Short") // Too short
                .build();

        mockMvc.perform(post("/api/v1/job")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidJob)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").exists())
                .andExpect(jsonPath("$.errors.company").exists())
                .andExpect(jsonPath("$.errors.description").exists())
                .andExpect(jsonPath("$.errors.jobType").exists())
                .andExpect(jsonPath("$.errors.status").exists())
                .andExpect(jsonPath("$.errors.postedBy").exists());

        verify(jobService, never()).create(any(JobDTO.class));
    }

    // ==================== GET TESTS ====================

    @Test
    void getJobById_WithValidId_ShouldReturnJob() throws Exception {
        when(jobService.getById(1L)).thenReturn(validJob);

        mockMvc.perform(get("/api/v1/job/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Senior Java Developer"));

        verify(jobService, times(1)).getById(1L);
    }

    @Test
    void getJobById_WithInvalidId_ShouldReturnNotFound() throws Exception {
        when(jobService.getById(999L)).thenThrow(new JobNotFoundException(999L));

        mockMvc.perform(get("/api/v1/job/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));

        verify(jobService, times(1)).getById(999L);
    }

    @Test
    void getAllJobs_ShouldReturnJobList() throws Exception {
        List<JobDTO> jobs = Arrays.asList(validJob);
        when(jobService.getAllJobs()).thenReturn(jobs);

        mockMvc.perform(get("/api/v1/job"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Senior Java Developer"));

        verify(jobService, times(1)).getAllJobs();
    }

    @Test
    void getJobsByCompany_ShouldReturnFilteredJobs() throws Exception {
        List<JobDTO> jobs = Arrays.asList(validJob);
        when(jobService.getJobsByCompany("Tech Corp")).thenReturn(jobs);

        mockMvc.perform(get("/api/v1/job/company/Tech Corp"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].company").value("Tech Corp"));

        verify(jobService, times(1)).getJobsByCompany("Tech Corp");
    }

    @Test
    void getJobsByLocation_ShouldReturnFilteredJobs() throws Exception {
        List<JobDTO> jobs = Arrays.asList(validJob);
        when(jobService.getJobsByLocation("New York, NY")).thenReturn(jobs);

        mockMvc.perform(get("/api/v1/job/location/New York, NY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        verify(jobService, times(1)).getJobsByLocation("New York, NY");
    }

    @Test
    void getJobsByJobType_ShouldReturnFilteredJobs() throws Exception {
        List<JobDTO> jobs = Arrays.asList(validJob);
        when(jobService.getJobsByJobType(Job.JobType.FULL_TIME)).thenReturn(jobs);

        mockMvc.perform(get("/api/v1/job/type/FULL_TIME"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].jobType").value("FULL_TIME"));

        verify(jobService, times(1)).getJobsByJobType(Job.JobType.FULL_TIME);
    }

    @Test
    void getActiveJobs_ShouldReturnOnlyActiveJobs() throws Exception {
        List<JobDTO> jobs = Arrays.asList(validJob);
        when(jobService.getActiveJobs()).thenReturn(jobs);

        mockMvc.perform(get("/api/v1/job/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].status").value("ACTIVE"));

        verify(jobService, times(1)).getActiveJobs();
    }

    // ==================== UPDATE TESTS ====================

    @Test
    void updateJob_WithValidData_ShouldReturnUpdatedJob() throws Exception {
        JobDTO updatedJob = JobDTO.builder()
                .id(1L)
                .title("Senior Java Developer - Updated")
                .company("Tech Corp")
                .description("Updated description that meets the minimum character requirement for validation purposes.")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .postedBy(1L)
                .build();

        when(jobService.update(eq(1L), any(JobDTO.class))).thenReturn(updatedJob);

        mockMvc.perform(put("/api/v1/job/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedJob)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Senior Java Developer - Updated"));

        verify(jobService, times(1)).update(eq(1L), any(JobDTO.class));
    }

    @Test
    void updateJob_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        JobDTO invalidJob = JobDTO.builder()
                .title("DE") // Too short
                .company("Tech Corp")
                .description("Short")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .postedBy(1L)
                .build();

        mockMvc.perform(put("/api/v1/job/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidJob)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").exists());

        verify(jobService, never()).update(eq(1L), any(JobDTO.class));
    }

    @Test
    void updateJob_WithNonExistentId_ShouldReturnNotFound() throws Exception {
        when(jobService.update(eq(999L), any(JobDTO.class)))
                .thenThrow(new JobNotFoundException(999L));

        mockMvc.perform(put("/api/v1/job/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validJob)))
                .andExpect(status().isNotFound());

        verify(jobService, times(1)).update(eq(999L), any(JobDTO.class));
    }

    // ==================== DELETE TESTS ====================

    @Test
    void deleteJob_WithValidId_ShouldReturnNoContent() throws Exception {
        doNothing().when(jobService).delete(1L);

        mockMvc.perform(delete("/api/v1/job/1"))
                .andExpect(status().isNoContent());

        verify(jobService, times(1)).delete(1L);
    }

    @Test
    void deleteJob_WithNonExistentId_ShouldReturnNotFound() throws Exception {
        doThrow(new JobNotFoundException(999L)).when(jobService).delete(999L);

        mockMvc.perform(delete("/api/v1/job/999"))
                .andExpect(status().isNotFound());

        verify(jobService, times(1)).delete(999L);
    }
}

