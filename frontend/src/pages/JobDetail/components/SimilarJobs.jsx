import React from 'react'
import { useAppSelector } from '../../../store/hooks'

/**
 * SimilarJobs Component
 * 
 * Displays a list of similar job opportunities in the sidebar.
 * Helps users discover related jobs that match their profile.
 * 
 * This component is part of the job detail sidebar and displays:
 * - List of similar job opportunities
 * - Job title and company name
 * - Match percentage for each job
 * - Clickable items that navigate to job details
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onJobClick - Callback function when a similar job is clicked
 * @param {string} props.onJobClick.id - Job ID to navigate to
 * 
 * @returns {JSX.Element} Rendered similar jobs list card
 * 
 * @example
 * <SimilarJobs onJobClick={(id) => navigate(`/jobs/${id}`)} />
 */
function SimilarJobs({ onJobClick }) {
  // ============================================
  // Redux State
  // ============================================
  
  /**
   * Get current job from Redux store
   * @type {Object|null}
   */
  const { currentJob } = useAppSelector((state) => state.jobDetail)
  
  /**
   * Extract similar jobs array or use empty array as fallback
   * 
   * Each similar job contains:
   * - id: Unique job identifier
   * - title: Job title/role name
   * - company: Company name
   * - match: Match percentage (0-100)
   * 
   * @type {Array<Object>}
   */
  const similarJobs = currentJob?.similarJobs || []

  // ============================================
  // Render
  // ============================================
  
  // Don't render if no similar jobs are available
  if (similarJobs.length === 0) return null

  return (
    <div className="jobdetail__card card">
      {/* Section Title */}
      {/* Displays the title for the similar jobs section */}
      <div className="jobdetail__aside-title">Similar Opportunities</div>

      {/* Similar Jobs List */}
      {/* 
        Displays a list of similar job opportunities:
        - Job title and company name
        - Match percentage badge
        - Clickable to navigate to job details
      */}
      <ul className="jobdetail__similar">
        {similarJobs.map((job) => (
          <li
            key={job.id}
            className="jobdetail__similar-item"
            style={{ cursor: onJobClick ? 'pointer' : 'default' }}
            onClick={onJobClick ? () => onJobClick(job.id) : undefined}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                if (onJobClick) onJobClick(job.id)
              }
            }}
            aria-label={`View ${job.title} at ${job.company}, ${job.match}% match`}
          >
            {/* Job Title and Company */}
            <div>
              <div className="jobdetail__similar-title">{job.title}</div>
              <div className="jobdetail__similar-sub">{job.company}</div>
            </div>
            
            {/* Match Percentage Badge */}
            {/* 
              Visual indicator of job match:
              - Displays match percentage (0-100)
              - Gradient background for visual appeal
              - Rounded badge style
            */}
            <div className="jobdetail__similar-fit">{job.match}%</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SimilarJobs

