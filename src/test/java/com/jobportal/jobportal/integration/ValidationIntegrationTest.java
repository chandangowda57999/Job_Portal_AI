package com.jobportal.jobportal.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.jobportal.dto.JobDTO;
import com.jobportal.jobportal.dto.UserDTO;
import com.jobportal.jobportal.entity.Job;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for validation across the entire application stack.
 * Tests validation from controller through to service layer.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ValidationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // ==================== USER VALIDATION INTEGRATION TESTS ====================

    @Test
    void createUser_WithCompleteValidData_ShouldSucceed() throws Exception {
        UserDTO validUser = new UserDTO();
        validUser.setFirstName("John");
        validUser.setLastName("Doe");
        validUser.setEmail("john.doe.integration@example.com");
        validUser.setPhoneNumber("1234567890");
        validUser.setPhoneCountryCode("+1");
        validUser.setUserType("candidate");

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.email").value("john.doe.integration@example.com"));
    }

    @Test
    void createUser_WithMultipleInvalidFields_ShouldReturnStructuredErrors() throws Exception {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setFirstName("J"); // Too short
        invalidUser.setLastName("D"); // Too short
        invalidUser.setEmail("not-an-email"); // Invalid format
        invalidUser.setPhoneNumber("123"); // Too short
        invalidUser.setUserType("invalid"); // Invalid type

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed for one or more fields"))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").value("/api/v1/users"))
                .andExpect(jsonPath("$.errors").isMap())
                .andExpect(jsonPath("$.errors.firstName").exists())
                .andExpect(jsonPath("$.errors.lastName").exists())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.phoneNumber").exists())
                .andExpect(jsonPath("$.errors.userType").exists());
    }

    @Test
    void createUser_WithInvalidEmailFormat_ShouldReturnSpecificError() throws Exception {
        UserDTO user = new UserDTO();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("invalid.email.format");
        user.setUserType("candidate");

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").value("Email must be a valid email address"));
    }

    @Test
    void createUser_WithInvalidNameCharacters_ShouldReturnValidationError() throws Exception {
        UserDTO user = new UserDTO();
        user.setFirstName("John123"); // Numbers not allowed
        user.setLastName("Doe@#$"); // Special chars not allowed
        user.setEmail("john@example.com");
        user.setUserType("candidate");

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.firstName").value(containsString("can only contain letters")))
                .andExpect(jsonPath("$.errors.lastName").value(containsString("can only contain letters")));
    }

    // ==================== JOB VALIDATION INTEGRATION TESTS ====================

    @Test
    void createJob_WithValidData_ShouldSucceed() throws Exception {
        JobDTO validJob = JobDTO.builder()
                .title("Software Engineer")
                .company("Tech Company")
                .description("This is a comprehensive job description that meets the minimum character requirement for validation purposes.")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .postedBy(1L)
                .build();

        mockMvc.perform(post("/api/v1/job")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validJob)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Software Engineer"));
    }

    @Test
    void createJob_WithShortDescription_ShouldReturnValidationError() throws Exception {
        JobDTO job = JobDTO.builder()
                .title("Software Engineer")
                .company("Tech Company")
                .description("Short") // Less than 50 characters
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .postedBy(1L)
                .build();

        mockMvc.perform(post("/api/v1/job")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(job)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.description").value("Description must be between 50 and 5000 characters"));
    }

    @Test
    void createJob_WithInvalidSalaryRange_ShouldReturnBusinessValidationError() throws Exception {
        JobDTO job = JobDTO.builder()
                .title("Software Engineer")
                .company("Tech Company")
                .description("This is a comprehensive job description that meets the minimum character requirement for validation purposes.")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .salaryMin(new BigDecimal("150000"))
                .salaryMax(new BigDecimal("100000")) // Max less than min
                .salaryCurrency("USD")
                .postedBy(1L)
                .build();

        mockMvc.perform(post("/api/v1/job")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(job)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Minimum salary must be less than maximum salary"))
                .andExpect(jsonPath("$.errors").doesNotExist()); // Business validation doesn't have field errors
    }

    @Test
    void createJob_WithSalaryButNoCurrency_ShouldReturnBusinessValidationError() throws Exception {
        JobDTO job = JobDTO.builder()
                .title("Software Engineer")
                .company("Tech Company")
                .description("This is a comprehensive job description that meets the minimum character requirement for validation purposes.")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .salaryMin(new BigDecimal("100000"))
                .salaryMax(new BigDecimal("150000"))
                .salaryCurrency(null) // Missing currency
                .postedBy(1L)
                .build();

        mockMvc.perform(post("/api/v1/job")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(job)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("Currency must be specified")));
    }

    @Test
    void createJob_WithInvalidCurrencyFormat_ShouldReturnValidationError() throws Exception {
        JobDTO job = JobDTO.builder()
                .title("Software Engineer")
                .company("Tech Company")
                .description("This is a comprehensive job description that meets the minimum character requirement for validation purposes.")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .salaryMin(new BigDecimal("100000"))
                .salaryMax(new BigDecimal("150000"))
                .salaryCurrency("US") // Invalid - must be 3 letters
                .postedBy(1L)
                .build();

        mockMvc.perform(post("/api/v1/job")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(job)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.salaryCurrency").exists());
    }

    @Test
    void createJob_WithInvalidWorkMode_ShouldReturnValidationError() throws Exception {
        JobDTO job = JobDTO.builder()
                .title("Software Engineer")
                .company("Tech Company")
                .description("This is a comprehensive job description that meets the minimum character requirement for validation purposes.")
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .workMode("INVALID_MODE")
                .postedBy(1L)
                .build();

        mockMvc.perform(post("/api/v1/job")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(job)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.workMode").value(containsString("REMOTE, ONSITE, or HYBRID")));
    }

    // ==================== ERROR RESPONSE FORMAT TESTS ====================

    @Test
    void validationError_ShouldHaveConsistentStructure() throws Exception {
        UserDTO invalidUser = new UserDTO();
        invalidUser.setFirstName("J");
        invalidUser.setEmail("invalid");
        invalidUser.setUserType("wrong");

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").isNumber())
                .andExpect(jsonPath("$.message").isString())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").isString())
                .andExpect(jsonPath("$.errors").isMap());
    }

    @Test
    void notFoundError_ShouldHaveConsistentStructure() throws Exception {
        mockMvc.perform(get("/api/v1/users/99999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").value("/api/v1/users/99999"));
    }

    // ==================== COMBINED VALIDATION SCENARIOS ====================

    @Test
    void createJob_WithMultipleFieldAndBusinessValidationErrors_ShouldReturnFieldErrorsFirst() throws Exception {
        JobDTO job = JobDTO.builder()
                .title("SE") // Too short - field validation
                .company("T") // Too short - field validation
                .description("Short") // Too short - field validation
                .jobType(Job.JobType.FULL_TIME)
                .status(Job.JobStatus.ACTIVE)
                .salaryMin(new BigDecimal("150000")) // Would fail business validation
                .salaryMax(new BigDecimal("100000"))
                .salaryCurrency("USD")
                .build(); // Missing postedBy - field validation

        mockMvc.perform(post("/api/v1/job")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(job)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").exists())
                .andExpect(jsonPath("$.errors.company").exists())
                .andExpect(jsonPath("$.errors.description").exists())
                .andExpect(jsonPath("$.errors.postedBy").exists());
        // Business validation won't run because field validation fails first
    }

    @Test
    void updateUser_WithValidData_ShouldEnforceValidationRules() throws Exception {
        // First create a valid user
        UserDTO createUser = new UserDTO();
        createUser.setFirstName("John");
        createUser.setLastName("Doe");
        createUser.setEmail("john.update.test@example.com");
        createUser.setUserType("candidate");

        String createResponse = mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createUser)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        UserDTO createdUser = objectMapper.readValue(createResponse, UserDTO.class);

        // Try to update with invalid data
        UserDTO updateUser = new UserDTO();
        updateUser.setFirstName("J"); // Invalid
        updateUser.setLastName("Doe");
        updateUser.setEmail("john.update.test@example.com");
        updateUser.setUserType("candidate");

        mockMvc.perform(put("/api/v1/users/" + createdUser.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.firstName").exists());
    }
}

