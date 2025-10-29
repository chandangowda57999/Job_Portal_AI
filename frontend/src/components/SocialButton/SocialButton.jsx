import React from 'react';
import './SocialButton.css';

/**
 * Social Login Button Component
 * Specialized button for OAuth authentication providers (Google, LinkedIn)
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.provider - Social provider: 'google' or 'linkedin'
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {boolean} [props.loading=false] - Whether button is in loading state
 * @param {string} [props.className=''] - Additional CSS classes
 * 
 * @returns {JSX.Element} Rendered social button component
 * 
 * @example
 * // Google sign-in button
 * <SocialButton provider="google" onClick={handleGoogleLogin} />
 * 
 * @example
 * // LinkedIn sign-in button with loading state
 * <SocialButton provider="linkedin" onClick={handleLinkedInLogin} loading={true} />
 */
const SocialButton = ({
  provider,
  onClick,
  disabled = false,
  loading = false,
  className = '',
  ...rest
}) => {
  /**
   * Configuration for each social provider
   * Contains display text, icons, and styling information
   */
  const providerConfig = {
    google: {
      name: 'Google',
      icon: (
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
      ),
      text: 'Continue with Google',
      ariaLabel: 'Sign in with Google'
    },
    linkedin: {
      name: 'LinkedIn',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077B5" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      text: 'Continue with LinkedIn',
      ariaLabel: 'Sign in with LinkedIn'
    }
  };

  /**
   * Gets the configuration for the current provider
   * Falls back to generic config if provider not found
   * 
   * @returns {Object} Provider configuration object
   */
  const getProviderConfig = () => {
    return providerConfig[provider.toLowerCase()] || {
      name: provider,
      icon: null,
      text: `Continue with ${provider}`,
      ariaLabel: `Sign in with ${provider}`
    };
  };

  const config = getProviderConfig();

  /**
   * Constructs CSS classes based on provider and state
   * 
   * @returns {string} Combined CSS classes
   */
  const getButtonClasses = () => {
    const classes = ['social-button', `social-button--${provider.toLowerCase()}`];
    
    if (disabled || loading) classes.push('social-button--disabled');
    if (loading) classes.push('social-button--loading');
    if (className) classes.push(className);
    
    return classes.join(' ');
  };

  /**
   * Handles button click events
   * Prevents action if button is disabled or loading
   * 
   * @param {Event} event - Click event object
   */
  const handleClick = (event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      type="button"
      className={getButtonClasses()}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={config.ariaLabel}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <span className="social-button__spinner">
          <span className="spinner"></span>
        </span>
      ) : (
        <span className="social-button__icon" aria-hidden="true">
          {config.icon}
        </span>
      )}
      <span className="social-button__text">
        {loading ? 'Connecting...' : config.text}
      </span>
    </button>
  );
};

export default SocialButton;

