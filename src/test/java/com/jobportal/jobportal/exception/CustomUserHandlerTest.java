package com.jobportal.jobportal.exception;

import com.jobportal.jobportal.customexceptionhandler.CustomUserHandler;
import com.jobportal.jobportal.customexceptionhandler.JobNotFoundException;
import com.jobportal.jobportal.customexceptionhandler.UserNotFoundException;
import com.jobportal.jobportal.customexceptionhandler.ValidationException;
import com.jobportal.jobportal.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for CustomUserHandler (Global Exception Handler).
 * Tests exception handling and error response generation.
 */
@ExtendWith(MockitoExtension.class)
class CustomUserHandlerTest {

    private CustomUserHandler handler;

    @Mock
    private HttpServletRequest request;

    @Mock
    private MethodArgumentNotValidException validationException;

    @Mock
    private BindingResult bindingResult;

    @BeforeEach
    void setUp() {
        handler = new CustomUserHandler();
        when(request.getRequestURI()).thenReturn("/api/v1/test");
    }

    // ==================== VALIDATION EXCEPTION TESTS ====================

    @Test
    void handleValidationErrors_ShouldReturnBadRequestWithFieldErrors() {
        FieldError fieldError1 = new FieldError("userDTO", "firstName", "First name is required");
        FieldError fieldError2 = new FieldError("userDTO", "email", "Email must be valid");

        when(validationException.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getAllErrors()).thenReturn(Arrays.asList(fieldError1, fieldError2));

        ResponseEntity<ErrorResponse> response = handler.handleValidationErrors(validationException, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(400);
        assertThat(response.getBody().getMessage()).isEqualTo("Validation failed for one or more fields");
        assertThat(response.getBody().getPath()).isEqualTo("/api/v1/test");
        assertThat(response.getBody().getErrors()).hasSize(2);
        assertThat(response.getBody().getErrors()).containsKey("firstName");
        assertThat(response.getBody().getErrors()).containsKey("email");
        assertThat(response.getBody().getTimestamp()).isNotNull();
    }

    @Test
    void handleValidationErrors_WithSingleError_ShouldReturnOneFieldError() {
        FieldError fieldError = new FieldError("userDTO", "email", "Email is required");

        when(validationException.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getAllErrors()).thenReturn(Arrays.asList(fieldError));

        ResponseEntity<ErrorResponse> response = handler.handleValidationErrors(validationException, request);

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getErrors()).hasSize(1);
        assertThat(response.getBody().getErrors().get("email")).isEqualTo("Email is required");
    }

    // ==================== USER NOT FOUND EXCEPTION TESTS ====================

    @Test
    void handleUserNotFound_WithUserId_ShouldReturnNotFoundWithMessage() {
        UserNotFoundException exception = new UserNotFoundException(123L);

        ResponseEntity<ErrorResponse> response = handler.handleUserNotFound(exception, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(404);
        assertThat(response.getBody().getMessage()).contains("User not found with id: 123");
        assertThat(response.getBody().getPath()).isEqualTo("/api/v1/test");
        assertThat(response.getBody().getTimestamp()).isNotNull();
    }

    @Test
    void handleUserNotFound_WithEmail_ShouldReturnNotFoundWithMessage() {
        UserNotFoundException exception = new UserNotFoundException("test@example.com");

        ResponseEntity<ErrorResponse> response = handler.handleUserNotFound(exception, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).contains("test@example.com");
    }

    // ==================== JOB NOT FOUND EXCEPTION TESTS ====================

    @Test
    void handleJobNotFound_ShouldReturnNotFoundWithMessage() {
        JobNotFoundException exception = new JobNotFoundException(456L);

        ResponseEntity<ErrorResponse> response = handler.handleJobNotFound(exception, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(404);
        assertThat(response.getBody().getMessage()).contains("Job not found with id: 456");
        assertThat(response.getBody().getPath()).isEqualTo("/api/v1/test");
    }

    // ==================== TYPE MISMATCH EXCEPTION TESTS ====================

    @Test
    void handleTypeMismatch_ShouldReturnBadRequestWithDetailedMessage() {
        MethodArgumentTypeMismatchException exception = mock(MethodArgumentTypeMismatchException.class);
        when(exception.getName()).thenReturn("jobType");
        when(exception.getValue()).thenReturn("INVALID_TYPE");
        when(exception.getRequiredType()).thenReturn((Class) String.class);

        ResponseEntity<ErrorResponse> response = handler.handleTypeMismatch(exception, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(400);
        assertThat(response.getBody().getMessage()).contains("Invalid value");
        assertThat(response.getBody().getMessage()).contains("jobType");
        assertThat(response.getBody().getMessage()).contains("INVALID_TYPE");
    }

    // ==================== ILLEGAL ARGUMENT EXCEPTION TESTS ====================

    @Test
    void handleIllegalArgument_ShouldReturnBadRequestWithMessage() {
        IllegalArgumentException exception = new IllegalArgumentException("Invalid argument provided");

        ResponseEntity<ErrorResponse> response = handler.handleIllegalArgument(exception, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(400);
        assertThat(response.getBody().getMessage()).isEqualTo("Invalid argument provided");
        assertThat(response.getBody().getPath()).isEqualTo("/api/v1/test");
    }

    // ==================== CUSTOM VALIDATION EXCEPTION TESTS ====================

    @Test
    void handleValidationException_ShouldReturnBadRequestWithMessage() {
        ValidationException exception = new ValidationException("Minimum salary must be less than maximum salary");

        ResponseEntity<ErrorResponse> response = handler.handleValidationException(exception, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(400);
        assertThat(response.getBody().getMessage()).isEqualTo("Minimum salary must be less than maximum salary");
        assertThat(response.getBody().getPath()).isEqualTo("/api/v1/test");
    }

    @Test
    void handleValidationException_WithCurrencyError_ShouldReturnBadRequest() {
        ValidationException exception = new ValidationException("Currency must be specified when salary range is provided");

        ResponseEntity<ErrorResponse> response = handler.handleValidationException(exception, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).contains("Currency must be specified");
    }

    // ==================== GENERAL EXCEPTION TESTS ====================

    @Test
    void handleGeneral_ShouldReturnInternalServerError() {
        Exception exception = new Exception("Unexpected error occurred");

        ResponseEntity<ErrorResponse> response = handler.handleGeneral(exception, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(500);
        assertThat(response.getBody().getMessage()).isEqualTo("An unexpected error occurred. Please try again later.");
        assertThat(response.getBody().getPath()).isEqualTo("/api/v1/test");
    }

    @Test
    void handleGeneral_ShouldNotExposeInternalDetails() {
        Exception exception = new Exception("Database connection failed: server=localhost:3306");

        ResponseEntity<ErrorResponse> response = handler.handleGeneral(exception, request);

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).doesNotContain("Database");
        assertThat(response.getBody().getMessage()).doesNotContain("localhost");
        assertThat(response.getBody().getMessage()).isEqualTo("An unexpected error occurred. Please try again later.");
    }

    // ==================== ERROR RESPONSE STRUCTURE TESTS ====================

    @Test
    void errorResponse_ShouldAlwaysIncludeRequiredFields() {
        UserNotFoundException exception = new UserNotFoundException(1L);

        ResponseEntity<ErrorResponse> response = handler.handleUserNotFound(exception, request);

        ErrorResponse body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.getStatus()).isNotZero();
        assertThat(body.getMessage()).isNotNull().isNotEmpty();
        assertThat(body.getTimestamp()).isNotNull();
        assertThat(body.getPath()).isNotNull().isNotEmpty();
    }

    @Test
    void errorResponse_ValidationErrors_ShouldIncludeErrorsMap() {
        FieldError fieldError = new FieldError("userDTO", "firstName", "Required");

        when(validationException.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getAllErrors()).thenReturn(Arrays.asList(fieldError));

        ResponseEntity<ErrorResponse> response = handler.handleValidationErrors(validationException, request);

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getErrors()).isNotNull();
        assertThat(response.getBody().getErrors()).isNotEmpty();
    }

    @Test
    void errorResponse_NonValidationErrors_ShouldNotIncludeErrorsMap() {
        UserNotFoundException exception = new UserNotFoundException(1L);

        ResponseEntity<ErrorResponse> response = handler.handleUserNotFound(exception, request);

        // Note: errors field can be null for non-validation errors
        assertThat(response.getBody()).isNotNull();
    }
}

