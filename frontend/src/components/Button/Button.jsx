import React from 'react';
import './Button.css';

/**
 * Reusable Button Component
 * A flexible button component that supports multiple variants and states
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.children - Button text or content
 * @param {string} [props.variant='primary'] - Button style variant: 'primary', 'secondary', 'outline'
 * @param {string} [props.size='medium'] - Button size: 'small', 'medium', 'large'
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.fullWidth=false] - Whether button should take full width
 * @param {boolean} [props.loading=false] - Whether button is in loading state
 * @param {Function} props.onClick - Click handler function
 * @param {string} [props.type='button'] - HTML button type: 'button', 'submit', 'reset'
 * @param {string} [props.className=''] - Additional CSS classes
 * 
 * @returns {JSX.Element} Rendered button component
 * 
 * @example
 * // Primary button
 * <Button onClick={handleClick}>Click Me</Button>
 * 
 * @example
 * // Loading state button
 * <Button loading={true} variant="primary">Processing...</Button>
 * 
 * @example
 * // Full width secondary button
 * <Button variant="secondary" fullWidth={true}>Submit</Button>
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) => {
  /**
   * Constructs the CSS class string based on props
   * Combines base class with variant, size, and state modifiers
   * 
   * @returns {string} Combined CSS classes
   */
  const getButtonClasses = () => {
    const classes = ['button', `button--${variant}`, `button--${size}`];
    
    if (fullWidth) classes.push('button--full-width');
    if (disabled || loading) classes.push('button--disabled');
    if (loading) classes.push('button--loading');
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
      type={type}
      className={getButtonClasses()}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="button__spinner" aria-hidden="true">
          <span className="spinner"></span>
        </span>
      )}
      <span className={loading ? 'button__text--loading' : 'button__text'}>
        {children}
      </span>
    </button>
  );
};

export default Button;

