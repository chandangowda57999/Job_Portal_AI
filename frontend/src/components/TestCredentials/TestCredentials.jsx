/**
 * Test Credentials Display Component
 * Shows available test credentials for development/testing
 * Only visible in development mode
 * 
 * @component
 * @returns {JSX.Element|null} Test credentials panel or null in production
 */
import React, { useState } from 'react';
import { TEST_CREDENTIALS } from '../../services/mockUsers';
import './TestCredentials.css';

/**
 * Test Credentials Component
 * Displays test user credentials for easy testing
 */
const TestCredentials = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show in development and when mock mode is enabled
  // This is handled by parent component, but double-check here
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className={`test-credentials ${isExpanded ? 'test-credentials--expanded' : ''}`}>
      <button
        className="test-credentials__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Toggle test credentials"
      >
        <span className="test-credentials__icon">🔧</span>
        <span className="test-credentials__text">
          {isExpanded ? 'Hide' : 'Show'} Test Credentials
        </span>
      </button>

      {isExpanded && (
        <div className="test-credentials__panel">
          <div className="test-credentials__header">
            <h3>Mock Test Credentials</h3>
            <p>Use these credentials to test different user scenarios</p>
          </div>

          <div className="test-credentials__list">
            {Object.entries(TEST_CREDENTIALS).map(([key, cred]) => (
              <div key={key} className="test-credentials__item">
                <div className="test-credentials__item-header">
                  <span className="test-credentials__item-title">{key.replace('_', ' ')}</span>
                  <span className={`test-credentials__badge test-credentials__badge--${cred.profileStatus.toLowerCase()}`}>
                    {cred.profileStatus}
                  </span>
                </div>
                <div className="test-credentials__item-content">
                  <div className="test-credentials__field">
                    <span className="test-credentials__label">Email:</span>
                    <code className="test-credentials__value">{cred.email}</code>
                  </div>
                  <div className="test-credentials__field">
                    <span className="test-credentials__label">Password:</span>
                    <code className="test-credentials__value">{cred.password}</code>
                  </div>
                  <div className="test-credentials__field">
                    <span className="test-credentials__label">Flow:</span>
                    <span className="test-credentials__value">{cred.description}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="test-credentials__instructions">
            <h4>Test Scenarios:</h4>
            <ul>
              <li><strong>Complete Profile:</strong> Sign in → Goes directly to Dashboard</li>
              <li><strong>Incomplete Profile:</strong> Sign in → Redirects to Profile Creation</li>
              <li><strong>New User:</strong> Sign up → Redirects to Profile Creation</li>
              <li><strong>All passwords:</strong> Test@123</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCredentials;

