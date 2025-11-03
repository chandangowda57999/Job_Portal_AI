import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  updateSignInField,
  setSignInErrors,
  setSignInGeneralError,
  setSignInLoading,
  resetSignInForm,
  setUser,
  setToken,
} from '../../store/slices/authSlice';
import { login, initiateGoogleLogin, initiateLinkedInLogin, isProfileComplete, getUserData } from '../../services/authService';
import { validateSignInForm, sanitizeInput } from '../../utils/validators';
import { printTestCredentials } from '../../services/mockUsers';
import { appConfig } from '../../config/appConfig';
import TestCredentials from '../../components/TestCredentials/TestCredentials';
import './SignIn.css';

/**
 * SignIn Page Component
 * Self-contained authentication page with rich UI and hover effects
 * Everything is implemented inline within this single page component
 * 
 * Features:
 * - Rich hover effects and animations
 * - Traditional email/password authentication
 * - Google OAuth integration
 * - LinkedIn OAuth integration
 * - Form validation with smooth error animations
 * - Loading states with spinners
 * - Responsive design
 * - All UI elements inline (no separate components)
 * 
 * @component
 * @returns {JSX.Element} Rendered sign-in page with rich interactions
 */
const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { signInForm } = useAppSelector((state) => state.auth);
  const [hoveredElement, setHoveredElement] = React.useState(null);

  // Reset form on mount
  useEffect(() => {
    return () => {
      dispatch(resetSignInForm());
    };
  }, [dispatch]);

  /**
   * Print test credentials to console on component mount
   * Only in development mode and when mock mode is enabled
   */
  useEffect(() => {
    if (appConfig.PRINT_TEST_CREDENTIALS) {
      printTestCredentials();
    }
  }, []);

  /**
   * Handles input field changes with smooth validation
   * Updates form data and clears field-specific errors
   * 
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    dispatch(updateSignInField({ field: name, value: sanitizedValue }));
  };

  /**
   * Handles remember me checkbox change
   * 
   * @param {Event} e - Checkbox change event
   */
  const handleRememberMeChange = (e) => {
    dispatch(updateSignInField({ field: 'rememberMe', value: e.target.checked }));
  };

  /**
   * Toggles password visibility with smooth animation
   */
  const togglePasswordVisibility = () => {
    dispatch(updateSignInField({ field: 'showPassword', value: !signInForm.showPassword }));
  };

  /**
   * Handles traditional email/password login form submission
   * Validates input, calls authentication service, and handles response
   * 
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    dispatch(setSignInErrors({}));
    dispatch(setSignInGeneralError(''));

    // Validate form data
    const formData = {
      email: signInForm.email,
      password: signInForm.password,
    };
    const validation = validateSignInForm(formData);
    
    if (!validation.isValid) {
      dispatch(setSignInErrors(validation.errors));
      return;
    }

    // Set loading state
    dispatch(setSignInLoading(true));

    try {
      // Attempt login
      const response = await login({
        email: signInForm.email,
        password: signInForm.password,
        rememberMe: signInForm.rememberMe,
      });

      // Store user and token in Redux
      dispatch(setUser(response.user));
      dispatch(setToken(response.token));

      // Check if user profile is complete and redirect accordingly
      const user = getUserData();
      if (isProfileComplete(user)) {
        // Profile complete - redirect to dashboard
        navigate('/dashboard');
      } else {
        // Profile incomplete - redirect to profile creation
        navigate('/profile/create');
      }
    } catch (error) {
      // Handle login error
      dispatch(setSignInGeneralError(error.message || 'Failed to sign in. Please try again.'));
      console.error('Login error:', error);
    } finally {
      dispatch(setSignInLoading(false));
    }
  };

  /**
   * Handles Google OAuth login initiation
   * Redirects user to Google's authentication page
   */
  const handleGoogleLogin = () => {
    try {
      initiateGoogleLogin();
    } catch (error) {
      dispatch(setSignInGeneralError('Failed to initiate Google login. Please try again.'));
      console.error('Google login error:', error);
    }
  };

  /**
   * Handles LinkedIn OAuth login initiation
   * Redirects user to LinkedIn's authentication page
   */
  const handleLinkedInLogin = () => {
    try {
      initiateLinkedInLogin();
    } catch (error) {
      dispatch(setSignInGeneralError('Failed to initiate LinkedIn login. Please try again.'));
      console.error('LinkedIn login error:', error);
    }
  };

  /**
   * Navigates to the sign-up page
   */
  const handleSignUpClick = () => {
    navigate('/signup');
  };

  /**
   * Navigates to the forgot password page
   */
  const handleForgotPasswordClick = () => {
    alert('Password reset functionality coming soon!');
  };

  return (
    <div className="signin">
      {/* Animated Background with Multiple Layers */}
      <div className="signin__background" aria-hidden="true">
        <div className="signin__background-layer signin__background-layer--1"></div>
        <div className="signin__background-layer signin__background-layer--2"></div>
        <div className="signin__background-layer signin__background-layer--3"></div>
      </div>

      {/* Floating Particles */}
      <div className="signin__particles" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`signin__particle signin__particle--${i + 1}`}></div>
        ))}
      </div>

      {/* Main content container */}
      <div className="signin__container">
        {/* Logo and branding with enhanced animations */}
        <div className="signin__header">
          <div 
            className="signin__logo"
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
              <div className="signin__logo-glow"></div>
            )}
          </div>
          <h1 className="signin__title">
            <span className="signin__title-text">JobPortal AI</span>
            <div className="signin__title-underline"></div>
          </h1>
          <p className="signin__subtitle">
            Find your dream job with AI-powered recommendations
          </p>
        </div>

        {/* Sign-in card with enhanced glass effect */}
        <div 
          className={`signin__card ${signInForm.isLoading ? 'signin__card--loading' : ''}`}
          onMouseEnter={() => setHoveredElement('card')}
          onMouseLeave={() => setHoveredElement(null)}
        >
          <div className="signin__card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your account</p>
          </div>

          {/* General error message with shake animation */}
          {signInForm.generalError && (
            <div className="signin__error" role="alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>{signInForm.generalError}</span>
            </div>
          )}

          {/* Social login buttons with rich hover effects */}
          <div className="signin__social">
            {/* Google Button with enhanced animations */}
            <button
              type="button"
              className={`social-button social-button--google ${hoveredElement === 'google' ? 'social-button--hovered' : ''}`}
              onClick={handleGoogleLogin}
              disabled={signInForm.isLoading}
              aria-label="Sign in with Google"
              onMouseEnter={() => setHoveredElement('google')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <span className="social-button__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </span>
              <span className="social-button__text">Continue with Google</span>
              <div className="social-button__ripple"></div>
            </button>

            {/* LinkedIn Button with enhanced animations */}
            <button
              type="button"
              className={`social-button social-button--linkedin ${hoveredElement === 'linkedin' ? 'social-button--hovered' : ''}`}
              onClick={handleLinkedInLogin}
              disabled={signInForm.isLoading}
              aria-label="Sign in with LinkedIn"
              onMouseEnter={() => setHoveredElement('linkedin')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              <span className="social-button__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077B5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </span>
              <span className="social-button__text">Continue with LinkedIn</span>
              <div className="social-button__ripple"></div>
            </button>
          </div>

          {/* Enhanced divider with animation */}
          <div className="signin__divider">
            <div className="signin__divider-line"></div>
            <span>OR</span>
            <div className="signin__divider-line"></div>
          </div>

          {/* Traditional login form with enhanced inputs */}
          <form onSubmit={handleSubmit} className="signin__form" noValidate>
            {/* Email input with floating label effect */}
            <div className="input input--floating">
              <div className="input__container">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={signInForm.email}
                  onChange={handleInputChange}
                  placeholder=" "
                  required
                  disabled={signInForm.isLoading}
                  autoComplete="email"
                  className={`input__field ${signInForm.errors.email ? 'input__field--error' : ''} ${hoveredElement === 'email' ? 'input__field--focused' : ''}`}
                  aria-invalid={!!signInForm.errors.email}
                  aria-describedby={signInForm.errors.email ? 'email-error' : undefined}
                  onFocus={() => setHoveredElement('email')}
                  onBlur={() => setHoveredElement(null)}
                />
                <label htmlFor="email" className="input__label">
                  Email Address
                  <span className="input__required">*</span>
                </label>
                <div className="input__focus-line"></div>
              </div>
              {signInForm.errors.email && (
                <p id="email-error" className="input__error" role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {signInForm.errors.email}
                </p>
              )}
            </div>

            {/* Password input with floating label and toggle */}
            <div className="input input--floating">
              <div className="input__container">
                <input
                  id="password"
                  type={signInForm.showPassword ? 'text' : 'password'}
                  name="password"
                  value={signInForm.password}
                  onChange={handleInputChange}
                  placeholder=" "
                  required
                  disabled={signInForm.isLoading}
                  autoComplete="current-password"
                  className={`input__field ${signInForm.errors.password ? 'input__field--error' : ''} ${hoveredElement === 'password' ? 'input__field--focused' : ''}`}
                  aria-invalid={!!signInForm.errors.password}
                  aria-describedby={signInForm.errors.password ? 'password-error' : undefined}
                  onFocus={() => setHoveredElement('password')}
                  onBlur={() => setHoveredElement(null)}
                />
                <label htmlFor="password" className="input__label">
                  Password
                  <span className="input__required">*</span>
                </label>
                <button
                  type="button"
                  className="input__toggle-password"
                  onClick={togglePasswordVisibility}
                  aria-label={signInForm.showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {signInForm.showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                <div className="input__focus-line"></div>
              </div>
              {signInForm.errors.password && (
                <p id="password-error" className="input__error" role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {signInForm.errors.password}
                </p>
              )}
            </div>

            {/* Remember me and forgot password row with enhanced styling */}
            <div className="signin__options">
              <label className="signin__checkbox">
                <input
                  type="checkbox"
                  checked={signInForm.rememberMe}
                  onChange={handleRememberMeChange}
                  disabled={signInForm.isLoading}
                />
                <span className="signin__checkbox-custom"></span>
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="signin__link"
                onClick={handleForgotPasswordClick}
                disabled={signInForm.isLoading}
                onMouseEnter={() => setHoveredElement('forgot')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                Forgot password?
              </button>
            </div>

            {/* Enhanced submit button with loading animation */}
            <button
              type="submit"
              className={`button button--primary button--medium button--full-width ${signInForm.isLoading ? 'button--loading' : ''} ${hoveredElement === 'submit' ? 'button--hovered' : ''}`}
              disabled={signInForm.isLoading}
              aria-busy={signInForm.isLoading}
              onMouseEnter={() => setHoveredElement('submit')}
              onMouseLeave={() => setHoveredElement(null)}
            >
              {signInForm.isLoading && (
                <span className="button__spinner" aria-hidden="true">
                  <div className="spinner">
                    <div className="spinner__circle"></div>
                    <div className="spinner__circle"></div>
                    <div className="spinner__circle"></div>
                  </div>
                </span>
              )}
              <span className={signInForm.isLoading ? 'button__text--loading' : 'button__text'}>
                {signInForm.isLoading ? 'Signing In...' : 'Sign In'}
              </span>
              <div className="button__ripple"></div>
            </button>
          </form>

          {/* Sign up link with enhanced hover effect */}
          <div className="signin__footer">
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="signin__link signin__link--primary"
                onClick={handleSignUpClick}
                disabled={signInForm.isLoading}
                onMouseEnter={() => setHoveredElement('signup')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Enhanced footer */}
        <div className="signin__page-footer">
          <p>&copy; 2025 JobPortal AI. All rights reserved.</p>
        </div>
      </div>

      {/* Test Credentials Component (Development Only, when mock mode enabled) */}
      {appConfig.SHOW_TEST_CREDENTIALS && <TestCredentials />}
    </div>
  );
};

export default SignIn;