package com.jobportal.jobportal.service;

import com.jobportal.jobportal.customexceptionhandler.JobNotFoundException;
import com.jobportal.jobportal.customexceptionhandler.ValidationException;
import com.jobportal.jobportal.dto.JobDTO;
import com.jobportal.jobportal.entity.Job;
import com.jobportal.jobportal.repo.JobRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for JobService.
 * Tests business logic, validation, and repository interactions.
 */
@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepo jobRepo;

    @InjectMocks
    private JobService jobService;

    private Job job;
    private JobDTO jobDTO;

    @BeforeEach
    void setUp() {
        job = Job.builder()
                .id(1L)
                .title("Senior Java Developer")
                .company("Tech Corp")
                .location("New York, NY")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .experienceLevel("SENIOR")
                .description("Test description that is long enough to meet validation requirements.")
                .salaryMin(new BigDecimal("100000"))
                .salaryMax(new BigDecimal("150000"))
                .salaryCurrency("USD")
                .postedBy(1L)
                .build();

        jobDTO = JobDTO.builder()
                .id(1L)
                .title("Senior Java Developer")
                .company("Tech Corp")
                .location("New York, NY")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .experienceLevel("SENIOR")
                .description("Test description that is long enough to meet validation requirements.")
                .salaryMin(new BigDecimal("100000"))
                .salaryMax(new BigDecimal("150000"))
                .salaryCurrency("USD")
                .postedBy(1L)
                .build();
    }

    // ==================== CREATE TESTS ====================

    @Test
    void create_WithValidData_ShouldReturnCreatedJob() {
        when(jobRepo.save(any(Job.class))).thenReturn(job);

        JobDTO result = jobService.create(jobDTO);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Senior Java Developer");
        assertThat(result.getCompany()).isEqualTo("Tech Corp");
        verify(jobRepo, times(1)).save(any(Job.class));
    }

    @Test
    void create_WithValidSalaryRange_ShouldSucceed() {
        jobDTO.setSalaryMin(new BigDecimal("80000"));
        jobDTO.setSalaryMax(new BigDecimal("120000"));
        jobDTO.setSalaryCurrency("USD");

        when(jobRepo.save(any(Job.class))).thenReturn(job);

        JobDTO result = jobService.create(jobDTO);

        assertThat(result).isNotNull();
        verify(jobRepo, times(1)).save(any(Job.class));
    }

    @Test
    void create_WithInvalidSalaryRange_ShouldThrowValidationException() {
        jobDTO.setSalaryMin(new BigDecimal("150000"));
        jobDTO.setSalaryMax(new BigDecimal("100000"));
        jobDTO.setSalaryCurrency("USD");

        assertThatThrownBy(() -> jobService.create(jobDTO))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Minimum salary must be less than maximum salary");

        verify(jobRepo, never()).save(any(Job.class));
    }

    @Test
    void create_WithEqualSalaries_ShouldThrowValidationException() {
        jobDTO.setSalaryMin(new BigDecimal("100000"));
        jobDTO.setSalaryMax(new BigDecimal("100000"));
        jobDTO.setSalaryCurrency("USD");

        assertThatThrownBy(() -> jobService.create(jobDTO))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Minimum salary must be less than maximum salary");

        verify(jobRepo, never()).save(any(Job.class));
    }

    @Test
    void create_WithSalaryButNoCurrency_ShouldThrowValidationException() {
        jobDTO.setSalaryMin(new BigDecimal("100000"));
        jobDTO.setSalaryMax(new BigDecimal("150000"));
        jobDTO.setSalaryCurrency(null);

        assertThatThrownBy(() -> jobService.create(jobDTO))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Currency must be specified");

        verify(jobRepo, never()).save(any(Job.class));
    }

    @Test
    void create_WithOnlySalaryMinAndNoCurrency_ShouldThrowValidationException() {
        jobDTO.setSalaryMin(new BigDecimal("100000"));
        jobDTO.setSalaryMax(null);
        jobDTO.setSalaryCurrency(null);

        assertThatThrownBy(() -> jobService.create(jobDTO))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Currency must be specified");

        verify(jobRepo, never()).save(any(Job.class));
    }

    @Test
    void create_WithNoSalary_ShouldSucceed() {
        jobDTO.setSalaryMin(null);
        jobDTO.setSalaryMax(null);
        jobDTO.setSalaryCurrency(null);

        when(jobRepo.save(any(Job.class))).thenReturn(job);

        JobDTO result = jobService.create(jobDTO);

        assertThat(result).isNotNull();
        verify(jobRepo, times(1)).save(any(Job.class));
    }

    // ==================== GET BY ID TESTS ====================

    @Test
    void getById_WithExistingId_ShouldReturnJob() {
        when(jobRepo.findById(1L)).thenReturn(Optional.of(job));

        JobDTO result = jobService.getById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Senior Java Developer");
        verify(jobRepo, times(1)).findById(1L);
    }

    @Test
    void getById_WithNonExistentId_ShouldThrowException() {
        when(jobRepo.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.getById(999L))
                .isInstanceOf(JobNotFoundException.class)
                .hasMessageContaining("999");

        verify(jobRepo, times(1)).findById(999L);
    }

    // ==================== GET ALL TESTS ====================

    @Test
    void getAllJobs_ShouldReturnAllJobs() {
        Job job2 = Job.builder()
                .id(2L)
                .title("Junior Developer")
                .company("Startup Inc")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .description("Junior position")
                .postedBy(1L)
                .build();

        List<Job> jobs = Arrays.asList(job, job2);
        when(jobRepo.findAll()).thenReturn(jobs);

        List<JobDTO> result = jobService.getAllJobs();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTitle()).isEqualTo("Senior Java Developer");
        assertThat(result.get(1).getTitle()).isEqualTo("Junior Developer");
        verify(jobRepo, times(1)).findAll();
    }

    @Test
    void getJobsByCompany_ShouldReturnFilteredJobs() {
        List<Job> jobs = Arrays.asList(job);
        when(jobRepo.findByCompany("Tech Corp")).thenReturn(jobs);

        List<JobDTO> result = jobService.getJobsByCompany("Tech Corp");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCompany()).isEqualTo("Tech Corp");
        verify(jobRepo, times(1)).findByCompany("Tech Corp");
    }

    @Test
    void getJobsByLocation_ShouldReturnFilteredJobs() {
        List<Job> jobs = Arrays.asList(job);
        when(jobRepo.findByLocation("New York, NY")).thenReturn(jobs);

        List<JobDTO> result = jobService.getJobsByLocation("New York, NY");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getLocation()).isEqualTo("New York, NY");
        verify(jobRepo, times(1)).findByLocation("New York, NY");
    }

    @Test
    void getJobsByJobType_ShouldReturnFilteredJobs() {
        List<Job> jobs = Arrays.asList(job);
        when(jobRepo.findByJobType(Job.JobType.FULL_TIME)).thenReturn(jobs);

        List<JobDTO> result = jobService.getJobsByJobType(Job.JobType.FULL_TIME);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getJobType()).isEqualTo(Job.JobType.FULL_TIME);
        verify(jobRepo, times(1)).findByJobType(Job.JobType.FULL_TIME);
    }

    @Test
    void getActiveJobs_ShouldReturnOnlyActiveJobs() {
        List<Job> jobs = Arrays.asList(job);
        when(jobRepo.findByStatus(Job.JobStatus.ACTIVE)).thenReturn(jobs);

        List<JobDTO> result = jobService.getActiveJobs();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(Job.JobStatus.ACTIVE);
        verify(jobRepo, times(1)).findByStatus(Job.JobStatus.ACTIVE);
    }

    // ==================== UPDATE TESTS ====================

    @Test
    void update_WithValidData_ShouldReturnUpdatedJob() {
        JobDTO updateDTO = JobDTO.builder()
                .title("Updated Title")
                .company("Tech Corp")
                .description("Updated description that is long enough to meet validation requirements.")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .salaryMin(new BigDecimal("120000"))
                .salaryMax(new BigDecimal("180000"))
                .salaryCurrency("USD")
                .postedBy(1L)
                .build();

        when(jobRepo.findById(1L)).thenReturn(Optional.of(job));
        when(jobRepo.save(any(Job.class))).thenAnswer(invocation -> invocation.getArgument(0));

        JobDTO result = jobService.update(1L, updateDTO);

        assertThat(result).isNotNull();
        verify(jobRepo, times(1)).findById(1L);
        verify(jobRepo, times(1)).save(any(Job.class));
    }

    @Test
    void update_WithInvalidSalaryRange_ShouldThrowValidationException() {
        JobDTO updateDTO = JobDTO.builder()
                .title("Updated Title")
                .company("Tech Corp")
                .description("Updated description that is long enough to meet validation requirements.")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .salaryMin(new BigDecimal("180000"))
                .salaryMax(new BigDecimal("120000"))
                .salaryCurrency("USD")
                .postedBy(1L)
                .build();

        assertThatThrownBy(() -> jobService.update(1L, updateDTO))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Minimum salary must be less than maximum salary");

        verify(jobRepo, never()).findById(anyLong());
        verify(jobRepo, never()).save(any(Job.class));
    }

    @Test
    void update_WithNonExistentId_ShouldThrowException() {
        when(jobRepo.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.update(999L, jobDTO))
                .isInstanceOf(JobNotFoundException.class)
                .hasMessageContaining("999");

        verify(jobRepo, times(1)).findById(999L);
        verify(jobRepo, never()).save(any(Job.class));
    }

    // ==================== DELETE TESTS ====================

    @Test
    void delete_WithExistingId_ShouldDeleteJob() {
        when(jobRepo.existsById(1L)).thenReturn(true);
        doNothing().when(jobRepo).deleteById(1L);

        assertThatCode(() -> jobService.delete(1L))
                .doesNotThrowAnyException();

        verify(jobRepo, times(1)).existsById(1L);
        verify(jobRepo, times(1)).deleteById(1L);
    }

    @Test
    void delete_WithNonExistentId_ShouldThrowException() {
        when(jobRepo.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> jobService.delete(999L))
                .isInstanceOf(JobNotFoundException.class)
                .hasMessageContaining("999");

        verify(jobRepo, times(1)).existsById(999L);
        verify(jobRepo, never()).deleteById(anyLong());
    }
}

