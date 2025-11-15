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
import { login, isProfileComplete, getUserData } from '../../services/authService';
import { sanitizeInput } from '../../utils/validators';
import './SignIn.css';

/**
 * SignIn Page Component
 * Self-contained authentication page with rich UI and hover effects
 * Everything is implemented inline within this single page component
 * 
 * Features:
 * - Rich hover effects and animations
 * - Traditional email/password authentication
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

    // Skip client-side validation for login
    // Always send to backend and show generic "Invalid email or password" for any error
    // This ensures we don't reveal validation details (security best practice)
    
    // Basic check: ensure fields are not completely empty
    if (!signInForm.email || !signInForm.password) {
      dispatch(setSignInGeneralError('Invalid email or password'));
      return;
    }

    // Set loading state
    dispatch(setSignInLoading(true));

    try {
      // Attempt login - let backend handle all validation
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
      // Always clear field-specific errors for any login error
      // This ensures we show "Invalid email or password" instead of field errors
      dispatch(setSignInErrors({}));
      
      // Always show generic error message for login failures
      // This includes: invalid email format, invalid password, wrong credentials, etc.
      // This is a security best practice - don't reveal validation details
      dispatch(setSignInGeneralError('Invalid email or password'));
      console.error('Login error:', error);
    } finally {
      dispatch(setSignInLoading(false));
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

          {/* Login form with enhanced inputs */}
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
    </div>
  );
};

export default SignIn;