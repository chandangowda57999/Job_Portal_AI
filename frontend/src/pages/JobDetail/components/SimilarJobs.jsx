import React from 'react'
import { useAppSelector } from '../../../store/hooks'

/**
 * SimilarJobs Component
 * 
 * Displays a list of similar job opportunities related to the current job posting.
 * Each job shows its title, company name, and AI-calculated match percentage.
 * Jobs are clickable and navigate to their detail pages.
 * 
 * This component appears in two places:
 * 1. In the sidebar when "Description" tab is active (quick reference)
 * 2. As full content when "Similar Jobs" tab is active
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} [props.onJobClick] - Optional callback when a job is clicked
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
   * @property {string} id - Job identifier
   * @property {string} title - Job title
   * @property {string} company - Company name
   * @property {number} match - Match percentage (0-100)
   */
  const items = currentJob?.similarJobs || []

  // ============================================
  // Render
  // ============================================
  
  // Don't render if no similar jobs available
  if (items.length === 0) return null

  return (
    <div className="jobdetail__card card">
      {/* Section Title */}
      <div className="jobdetail__aside-title">Similar Jobs</div>

      {/* Similar Jobs List */}
      {/* 
        Renders each similar job as a clickable list item.
        Shows job title, company, and match percentage.
      */}
      <ul className="jobdetail__similar">
        {items.map((s) => (
          <li
            key={s.id}
            className="hover-lift"
            style={{ cursor: onJobClick ? 'pointer' : 'default' }}
            onClick={onJobClick ? () => onJobClick(s.id) : undefined}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              // Enable keyboard navigation
              if (onJobClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                onJobClick(s.id)
              }
            }}
            aria-label={`View ${s.title} at ${s.company}, ${s.match}% match`}
          >
            {/* Job Info */}
            <div>
              <div className="jobdetail__similar-title">{s.title}</div>
              <div className="jobdetail__similar-sub">{s.company}</div>
            </div>
            {/* Match Score */}
            <div className="jobdetail__similar-fit">{s.match}%</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SimilarJobs


