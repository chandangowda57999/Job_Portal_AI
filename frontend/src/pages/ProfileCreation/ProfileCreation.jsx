import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, setUserData } from '../../services/authService';
import './ProfileCreation.css';

/**
 * Profile Creation Page Component
 * Collects user profile information after registration
 * Self-contained page with inline UI elements
 * 
 * @component
 * @returns {JSX.Element} Profile creation form
 */
const ProfileCreation = () => {
  const navigate = useNavigate();
  
  // Get current user data and initialize form
  const currentUser = getUserData();
  
  // Form state
  // Note: firstName and lastName start empty even if set during registration
  // This allows users to enter their profile information fresh on this page
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneCountryCode: currentUser?.phoneCountryCode || '+1',
    phoneNumber: currentUser?.phoneNumber || '',
    userType: currentUser?.userType || 'candidate',
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [hoveredElement, setHoveredElement] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handles input field changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (generalError) {
      setGeneralError('');
    }
  };

  /**
   * Validates the profile form
   */
  const validateForm = () => {
    const newErrors = {};

    // Validate firstName - backend expects: 2-120 chars, letters/spaces/hyphens/apostrophes only
    if (!formData.firstName || formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (formData.firstName.trim().length > 120) {
      newErrors.firstName = 'First name must not exceed 120 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Validate lastName - backend expects: 2-120 chars if provided, letters/spaces/hyphens/apostrophes only
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (formData.lastName.trim().length > 120) {
      newErrors.lastName = 'Last name must not exceed 120 characters';
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Validate phone number if provided
    // Backend expects: 10-15 digits only (no spaces, dashes, etc.)
    if (formData.phoneNumber && formData.phoneNumber.trim().length > 0) {
      const cleanedPhone = formData.phoneNumber.trim().replace(/\D/g, '');
      if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
        newErrors.phoneNumber = 'Phone number must be between 10 and 15 digits';
      }
    }

    // Resume is optional - users can upload it later if needed
    // Validation is done at upload time, not here

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  /**
   * Handles resume file selection and basic validation
   * Accepts only PDF up to 5MB
   */
  const handleResumeChange = (file) => {
    if (!file) return;

    // Reset previous errors for resume
    if (errors.resume) {
      setErrors((prev) => ({ ...prev, resume: '' }));
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isUnder5Mb = file.size <= 5 * 1024 * 1024;

    if (!isPdf) {
      setErrors((prev) => ({ ...prev, resume: 'Only PDF files are allowed' }));
      setResumeFile(null);
      setResumePreview(null);
      return;
    }
    if (!isUnder5Mb) {
      setErrors((prev) => ({ ...prev, resume: 'File too large. Max size is 5MB' }));
      setResumeFile(null);
      setResumePreview(null);
      return;
    }

    setResumeFile(file);
    setResumePreview({ name: file.name, size: file.size });
  };

  /**
   * Attempts to upload resume to backend API.
   * Returns an object with resume metadata on success.
   * 
   * @returns {Promise<Object|null>} Resume metadata or null if no file provided
   * @throws {Error} If upload fails
   */
  const uploadResumeIfProvided = async () => {
    if (!resumeFile) return null;

    const currentUser = getUserData();
    if (!currentUser || !currentUser.id) {
      throw new Error('User not authenticated. Please sign in again.');
    }

    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', resumeFile);

      // Backend expects: POST /api/v1/resumes/upload/{userId}
      // Use relative URL to leverage Vite proxy in development
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      const response = await fetch(`${apiBaseUrl}/v1/resumes/upload/${currentUser.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jobportal_auth_token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Failed to upload resume';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      // Backend returns ResumeDTO with: id, fileName, originalFileName, fileSize, filePath, etc.
      return {
        resumeId: data.id,
        resumeFileName: data.originalFileName || data.fileName || resumeFile.name,
        resumeFileSize: data.fileSize || resumeFile.size,
        resumeFilePath: data.filePath,
        resumeSource: 'api',
      };
    } catch (apiError) {
      // Handle network errors (Failed to fetch, CORS, etc.)
      if (apiError instanceof TypeError && apiError.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check if the backend is running and try again.');
      }
      // Re-throw other errors with original message
      throw apiError;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Handles form submission
   * Submits profile data to the backend API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setGeneralError('');

    const validation = validateForm();
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      const currentUser = getUserData();
      if (!currentUser || !currentUser.id) {
        throw new Error('User not authenticated. Please sign in again.');
      }
      
      // Ensure email exists - it's required by backend validation
      if (!currentUser.email) {
        console.error('Current user data:', currentUser);
        throw new Error('User email is missing. Please sign in again.');
      }

      // Upload resume if provided (non-blocking - profile can be saved without resume)
      let resumeMeta = null;
      let resumeUploadError = null;
      if (resumeFile) {
        try {
          resumeMeta = await uploadResumeIfProvided();
          console.log('✅ Resume uploaded successfully');
        } catch (uploadErr) {
          // Log error but don't block profile creation
          resumeUploadError = uploadErr.message || 'Failed to upload resume';
          console.error('Resume upload error:', uploadErr);
          // Show warning but allow user to continue
          // The profile will be saved without resume, and user can upload resume later
        }
      }

      // Note: Resume metadata is not stored in user profile in the current backend structure
      // Resumes are managed separately via the resume API
      // If resume was uploaded successfully, it's already stored in the database

      // Update user profile via API
      try {
        // Clean phone number: remove all non-digit characters
        const cleanedPhoneNumber = formData.phoneNumber.trim().replace(/\D/g, '');
        
        // Clean and validate phone country code
        // Backend expects: ^\+?[1-9]\d{0,3}$ (e.g., +1, +91, 1, 91)
        let phoneCountryCode = formData.phoneCountryCode.trim();
        if (phoneCountryCode && !/^\+?[1-9]\d{0,3}$/.test(phoneCountryCode)) {
          // Invalid format, use default
          phoneCountryCode = '+1';
        }
        
        // Prepare request body - send null for empty optional fields to avoid validation errors
        // Note: Email is required by backend, so we must include it from current user
        const requestBody = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: currentUser.email || currentUser.emailAddress, // Email is required by backend validation
          userType: formData.userType,
          // Only include phone fields if they have values
          phoneCountryCode: phoneCountryCode && phoneCountryCode.length > 0 ? phoneCountryCode : null,
          phoneNumber: cleanedPhoneNumber && cleanedPhoneNumber.length > 0 ? cleanedPhoneNumber : null,
        };
        
        // Validate email is present before sending
        if (!requestBody.email) {
          console.error('Email is missing from user data:', currentUser);
          throw new Error('Email is required but missing. Please sign in again.');
        }
        
        console.log('Sending profile update request:', { 
          ...requestBody, 
          phoneNumber: cleanedPhoneNumber ? '***' : null,
          email: requestBody.email ? '***' : null 
        });

        // Use relative URL to leverage Vite proxy in development
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
        const response = await fetch(`${apiBaseUrl}/v1/users/${currentUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jobportal_auth_token')}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          let errorMessage = 'Failed to update profile';
          let fieldErrors = {};
          
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
            
            // Extract field-specific validation errors
            if (errorData.errors && typeof errorData.errors === 'object') {
              fieldErrors = errorData.errors;
            }
          } catch (e) {
            errorMessage = response.statusText || errorMessage;
          }
          
          // If there are field-specific errors, show them in the form
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            // Also show general error message
            setGeneralError(errorMessage);
          } else {
            // No field-specific errors, just show general error
            throw new Error(errorMessage);
          }
          return; // Stop execution if validation failed
        }

        const updatedUser = await response.json();
        setUserData(updatedUser);
        console.log('✅ Profile updated via API');

        // Handle resume upload status
        if (resumeUploadError) {
          // Profile saved but resume upload failed
          // Show warning but don't block - user can upload resume later
          console.warn('⚠️ Profile saved but resume upload failed:', resumeUploadError);
          // Note: Profile is complete, user can upload resume later from their profile
        } else if (resumeMeta) {
          console.log('✅ Profile and resume saved successfully');
        }

        // Profile saved successfully - redirect to dashboard
        // Resume upload failure doesn't block profile creation since resume is optional
        navigate('/dashboard');
      } catch (apiError) {
        // Handle network errors
        if (apiError instanceof TypeError && apiError.message === 'Failed to fetch') {
          throw new Error('Unable to connect to server. Please check if the backend is running on port 8080 and try again.');
        }
        // Re-throw other errors to be caught by outer catch block
        throw apiError;
      }
      
    } catch (error) {
      // Set user-friendly error message
      const errorMessage = error.message || 'Failed to create profile. Please try again.';
      setGeneralError(errorMessage);
      console.error('Profile creation error:', error);
      
      // Log additional debugging info
      if (error.message.includes('Failed to fetch') || error.message.includes('Unable to connect')) {
        console.error('Backend connection error. Please check:');
        console.error('1. Backend server is running on port 8080');
        console.error('2. Backend is accessible at http://localhost:8080');
        console.error('3. Vite proxy is configured correctly (vite.config.js)');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-creation">
      {/* Animated Background */}
      <div className="profile-creation__background" aria-hidden="true">
        <div className="profile-creation__bg profile-creation__bg--1"></div>
        <div className="profile-creation__bg profile-creation__bg--2"></div>
        <div className="profile-creation__bg profile-creation__bg--3"></div>
      </div>

      <div className="profile-creation__container">
        {/* Header */}
        <div className="profile-creation__header">
          <div 
            className="profile-creation__logo"
            onMouseEnter={() => setHoveredElement('logo')}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <svg width="50" height="50" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="url(#gradient)" />
              <path d="M20 10L30 15V25L20 30L10 25V15L20 10Z" fill="white" />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#667eea" />
                  <stop offset="1" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
            {hoveredElement === 'logo' && (
              <div className="profile-creation__logo-glow"></div>
            )}
          </div>
          <h1 className="profile-creation__title">
            <span className="profile-creation__title-text">Complete Your Profile</span>
          </h1>
          <p className="profile-creation__subtitle">
            Tell us a bit about yourself to get started
          </p>
        </div>

        {/* Card */}
        <div 
          className={`profile-creation__card ${isLoading ? 'profile-creation__card--loading' : ''}`}
          onMouseEnter={() => setHoveredElement('card')}
          onMouseLeave={() => setHoveredElement(null)}
        >
          <div className="profile-creation__card-header">
            <h2>Profile Information</h2>
            <p>We need some details to personalize your experience</p>
          </div>

          {/* Error Message */}
          {generalError && (
            <div className="profile-creation__error" role="alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>{generalError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="profile-creation__form" noValidate>
            {/* Name Row */}
            <div className="profile-creation__row">
              <div className="input input--floating">
                <div className="input__container">
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                    disabled={isLoading}
                    className={`input__field ${errors.firstName ? 'input__field--error' : ''}`}
                    autoComplete="given-name"
                  />
                  <label htmlFor="firstName" className="input__label">
                    First Name<span className="input__required">*</span>
                  </label>
                  <div className="input__focus-line"></div>
                </div>
                {errors.firstName && (
                  <p className="input__error" role="alert">{errors.firstName}</p>
                )}
              </div>

              <div className="input input--floating">
                <div className="input__container">
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                    disabled={isLoading}
                    className={`input__field ${errors.lastName ? 'input__field--error' : ''}`}
                    autoComplete="family-name"
                  />
                  <label htmlFor="lastName" className="input__label">
                    Last Name<span className="input__required">*</span>
                  </label>
                  <div className="input__focus-line"></div>
                </div>
                {errors.lastName && (
                  <p className="input__error" role="alert">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="profile-creation__phone">
              <div className="input input--floating">
                <div className="input__container">
                  <input
                    id="phoneCountryCode"
                    type="text"
                    name="phoneCountryCode"
                    value={formData.phoneCountryCode}
                    onChange={handleInputChange}
                    placeholder=" "
                    disabled={isLoading}
                    className="input__field"
                  />
                  <label htmlFor="phoneCountryCode" className="input__label">Country Code</label>
                  <div className="input__focus-line"></div>
                </div>
              </div>

              <div className="input input--floating">
                <div className="input__container">
                  <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder=" "
                    disabled={isLoading}
                    className={`input__field ${errors.phoneNumber ? 'input__field--error' : ''}`}
                    autoComplete="tel"
                  />
                  <label htmlFor="phoneNumber" className="input__label">Phone Number</label>
                  <div className="input__focus-line"></div>
                </div>
                {errors.phoneNumber && (
                  <p className="input__error" role="alert">{errors.phoneNumber}</p>
                )}
              </div>
            </div>

            {/* User Type */}
            <div className="profile-creation__user-type">
              <label className="profile-creation__label">
                I am a:<span className="input__required">*</span>
              </label>
              <div className="profile-creation__radio-group">
                <label className={`profile-creation__radio ${formData.userType === 'candidate' ? 'profile-creation__radio--checked' : ''}`}>
                  <input
                    type="radio"
                    name="userType"
                    value="candidate"
                    checked={formData.userType === 'candidate'}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <span className="profile-creation__radio-custom"></span>
                  <span>Job Seeker</span>
                </label>
                <label className={`profile-creation__radio ${formData.userType === 'employer' ? 'profile-creation__radio--checked' : ''}`}>
                  <input
                    type="radio"
                    name="userType"
                    value="employer"
                    checked={formData.userType === 'employer'}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <span className="profile-creation__radio-custom"></span>
                  <span>Employer</span>
                </label>
              </div>
            </div>

            {/* Resume Upload */}
            <div className="profile-creation__resume">
              <label className="profile-creation__label">
                Resume <span className="profile-creation__optional">(Optional - you can upload it later)</span>
              </label>

              <div
                className={`resume-dropzone ${errors.resume ? 'resume-dropzone--error' : ''} ${isUploading ? 'resume-dropzone--uploading' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (isLoading || isUploading) return;
                  const file = e.dataTransfer.files?.[0];
                  handleResumeChange(file);
                }}
              >
                <input
                  id="resume"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleResumeChange(e.target.files?.[0])}
                  disabled={isLoading || isUploading}
                  className="resume-input"
                />
                <div className="resume-content">
                  <div className="resume-icon" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className="resume-text">
                    {resumePreview ? (
                      <>
                        <span className="resume-file-name">{resumePreview.name}</span>
                        <span className="resume-file-size">{Math.round(resumePreview.size / 1024)} KB</span>
                      </>
                    ) : (
                      <>
                        <span className="resume-title">Drag & drop your resume here</span>
                        <span className="resume-subtitle">or click to browse (PDF, max 5MB)</span>
                      </>
                    )}
                  </div>
                  {isUploading && <div className="resume-spinner" aria-label="Uploading"></div>}
                </div>
              </div>
              {errors.resume && (
                <p className="input__error" role="alert">{errors.resume}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`button button--primary button--medium button--full-width ${isLoading ? 'button--loading' : ''}`}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              <span className={isLoading ? 'button__text--loading' : 'button__text'}>
                {isLoading ? 'Creating Profile...' : 'Complete Profile'}
              </span>
              <div className="button__ripple"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreation;
