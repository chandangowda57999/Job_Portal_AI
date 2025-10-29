import React, { useState } from 'react';
import './Input.css';

/**
 * Reusable Input Component
 * A flexible input field component with validation, labels, and error handling
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Input label text
 * @param {string} props.type - Input type: 'text', 'email', 'password', etc.
 * @param {string} props.name - Input name attribute
 * @param {string} props.value - Input value (controlled component)
 * @param {Function} props.onChange - Change handler function
 * @param {Function} [props.onBlur] - Blur handler function
 * @param {string} [props.placeholder=''] - Input placeholder text
 * @param {string} [props.error=''] - Error message to display
 * @param {boolean} [props.required=false] - Whether input is required
 * @param {boolean} [props.disabled=false] - Whether input is disabled
 * @param {string} [props.autoComplete='off'] - Autocomplete attribute
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.icon] - Optional icon to display
 * 
 * @returns {JSX.Element} Rendered input component
 * 
 * @example
 * // Email input with validation
 * <Input
 *   label="Email Address"
 *   type="email"
 *   name="email"
 *   value={email}
 *   onChange={handleEmailChange}
 *   error={emailError}
 *   required
 * />
 * 
 * @example
 * // Password input with toggle visibility
 * <Input
 *   label="Password"
 *   type="password"
 *   name="password"
 *   value={password}
 *   onChange={handlePasswordChange}
 * />
 */
const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  onBlur,
  placeholder = '',
  error = '',
  required = false,
  disabled = false,
  autoComplete = 'off',
  className = '',
  icon,
  ...rest
}) => {
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Determines the actual input type to render
   * Handles password visibility toggle
   * 
   * @returns {string} The input type to use
   */
  const getInputType = () => {
    if (type === 'password' && showPassword) {
      return 'text';
    }
    return type;
  };

  /**
   * Toggles password visibility
   * Only applicable for password type inputs
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Constructs CSS classes based on component state
   * 
   * @returns {string} Combined CSS classes
   */
  const getInputClasses = () => {
    const classes = ['input__field'];
    
    if (error) classes.push('input__field--error');
    if (disabled) classes.push('input__field--disabled');
    if (icon) classes.push('input__field--with-icon');
    
    return classes.join(' ');
  };

  /**
   * Constructs wrapper CSS classes
   * 
   * @returns {string} Combined wrapper CSS classes
   */
  const getWrapperClasses = () => {
    const classes = ['input'];
    if (className) classes.push(className);
    return classes.join(' ');
  };

  return (
    <div className={getWrapperClasses()}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className="input__label">
          {label}
          {required && <span className="input__required" aria-label="required">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="input__container">
        {/* Optional Icon */}
        {icon && (
          <span className="input__icon" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Input Field */}
        <input
          id={name}
          type={getInputType()}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={getInputClasses()}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...rest}
        />

        {/* Password Visibility Toggle */}
        {type === 'password' && (
          <button
            type="button"
            className="input__toggle-password"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
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
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p id={`${name}-error`} className="input__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;

