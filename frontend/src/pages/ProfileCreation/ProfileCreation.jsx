import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, setUserData } from '../../services/authService';
import { updateMockUserProfile } from '../../services/mockUsers';
import { appConfig, shouldUseMockMode } from '../../config/appConfig';
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
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phoneCountryCode: currentUser?.phoneCountryCode || '+1',
    phoneNumber: currentUser?.phoneNumber || '',
    userType: currentUser?.userType || 'candidate',
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [hoveredElement, setHoveredElement] = useState(null);

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

    if (!formData.firstName || formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName || formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (formData.phoneNumber && formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  /**
   * Handles form submission
   * Uses mock mode (local storage) if backend is unavailable
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

      // Prepare updated user data
      const updatedUserData = {
        ...currentUser,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneCountryCode: formData.phoneCountryCode,
        phoneNumber: formData.phoneNumber.trim(),
        userType: formData.userType,
      };

      // Try to update via API, fallback to mock mode if unavailable
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/v1/users/${currentUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jobportal_auth_token')}`,
          },
          body: JSON.stringify({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phoneCountryCode: formData.phoneCountryCode,
            phoneNumber: formData.phoneNumber.trim(),
            userType: formData.userType,
          }),
        });

        if (!response.ok) {
          throw new Error('API call failed');
        }

        const updatedUser = await response.json();
        setUserData(updatedUser);
        console.log('✅ Profile updated via API');
      } catch (apiError) {
        // Check if mock mode should be used (only if enabled in config)
        if (shouldUseMockMode(apiError) && appConfig.ENABLE_MOCK_MODE) {
          console.warn('⚠️ Backend unavailable, using mock mode for profile update');
          
          // Update in mock users database if user exists there
          const updatedMockUser = updateMockUserProfile(currentUser.email, {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phoneCountryCode: formData.phoneCountryCode,
            phoneNumber: formData.phoneNumber.trim(),
            userType: formData.userType,
          });
          
          // Use updated mock user if available, otherwise use local data
          const finalUserData = updatedMockUser || updatedUserData;
          setUserData(finalUserData);
          
          console.log('🔧 Mock Mode: Profile saved to mock database');
          console.log(`   Profile Status: ${finalUserData.profileComplete ? 'Complete' : 'Incomplete'}`);
        } else {
          // Mock mode disabled or real API error - rethrow
          throw apiError;
        }
      }

      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      setGeneralError(error.message || 'Failed to create profile. Please try again.');
      console.error('Profile creation error:', error);
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
