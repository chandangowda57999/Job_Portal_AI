import React from 'react'
import { useAppSelector } from '../../../store/hooks'

/**
 * JobHeader Component
 * 
 * Header section of the job detail page displaying:
 * - Back navigation button
 * - Company logo and name
 * - Job role/title with save button
 * - Location, compensation, type, and posting date
 * - AI match score visualization
 * - Primary action buttons (Apply, Share)
 * 
 * Uses Redux to access current job data and props for action callbacks.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Callback when back button is clicked
 * @param {Function} props.onSave - Callback when save button is clicked
 * @param {Function} props.onApply - Callback when apply button is clicked
 * 
 * @returns {JSX.Element|null} Rendered job header or null if no job data
 * 
 * @example
 * <JobHeader
 *   onBack={() => navigate('/dashboard')}
 *   onSave={() => toggleSaveJob(jobId)}
 *   onApply={() => applyToJob(jobId)}
 * />
 */
function JobHeader({ onBack, onSave, onApply }) {
  // ============================================
  // Redux State
  // ============================================
  
  /**
   * Get current job from Redux store
   * @type {Object|null}
   */
  const { currentJob } = useAppSelector((state) => state.jobDetail)
  
  // Early return if no job data available
  if (!currentJob) return null
  
  // ============================================
  // Destructure Job Data
  // ============================================
  
  /**
   * Extract relevant job properties for display
   * @type {Object}
   */
  const {
    role,           // Job title/role name
    company,        // Company object with name and logoUrl
    location,       // Job location string
    compensation,   // Salary/compensation range
    type,           // Employment type (Full-time, Contract, etc.)
    postedAt,       // Posting date string
    matchScore      // AI match percentage (0-100)
  } = currentJob
  // ============================================
  // Render
  // ============================================
  
  return (
    <div className="jobdetail__header card hover-shine">
      {/* Back Navigation Button */}
      {/* 
        Returns user to previous page (typically dashboard or search results).
        Uses visual arrow icon for clear navigation affordance.
      */}
      <button
        className="jobdetail__back"
        onClick={onBack}
        aria-label="Back to results"
        type="button"
      >
        <span className="jobdetail__back-icon">←</span>
        <span>Back</span>
      </button>

      {/* Main Header Content */}
      <div className="jobdetail__title">
        {/* Company Logo */}
        {/* 
          Displays company branding for visual recognition.
          Falls back to placeholder if logo URL is invalid.
        */}
        <img
          className="jobdetail__logo"
          src={company.logoUrl}
          alt={`${company.name} logo`}
          onError={(e) => {
            // Fallback to placeholder on image load error
            e.target.src = 'https://via.placeholder.com/64x64.png?text=Logo'
          }}
        />

        {/* Job Metadata Section */}
        <div className="jobdetail__meta">
          {/* Role Title and Save Button Row */}
          <div className="jobdetail__company-row">
            <h1 className="jobdetail__role gradient-text">{role}</h1>
            <button
              className="jobdetail__save interactive"
              onClick={onSave}
              aria-label="Save job"
              type="button"
            >
              ★ Save
            </button>
          </div>

          {/* Company Name */}
          <div className="jobdetail__company">{company.name}</div>

          {/* Job Details Info Line */}
          {/* 
            Displays key job information in a compact, scannable format:
            Location • Compensation • Type • Posted Date
          */}
          <div className="jobdetail__info">
            <span>{location}</span>
            <span>•</span>
            <span>{compensation}</span>
            <span>•</span>
            <span>{type}</span>
            <span>•</span>
            <span>Posted {postedAt}</span>
          </div>
        </div>

        {/* AI Match Score Indicator */}
        {/* 
          Visual representation of the AI-calculated match percentage.
          Uses circular progress indicator for quick visual assessment.
        */}
        <div className="jobdetail__match">
          <div
            className="jobdetail__match-circle"
            aria-label={`Match ${matchScore}%`}
            role="img"
          >
            <span>{matchScore}%</span>
          </div>
          <div className="jobdetail__match-label">AI Match</div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      {/* 
        Main call-to-action buttons for job interactions:
        - Apply Now: Primary action to submit application
        - Share: Secondary action to share job posting
      */}
      <div className="jobdetail__actions">
        <button
          className="button button--primary button--medium"
          onClick={onApply}
          type="button"
        >
          Apply Now
        </button>
        <button
          className="jobdetail__secondary"
          type="button"
          onClick={() => {
            // TODO: Implement share functionality
            if (navigator.share) {
              navigator.share({
                title: `${role} at ${company.name}`,
                text: `Check out this job opportunity!`,
                url: window.location.href,
              })
            } else {
              // Fallback: Copy to clipboard
              navigator.clipboard.writeText(window.location.href)
              alert('Link copied to clipboard!')
            }
          }}
        >
          Share
        </button>
      </div>
    </div>
  )
}

export default JobHeader


