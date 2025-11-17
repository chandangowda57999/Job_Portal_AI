import React from 'react'
import { useAppSelector } from '../../../store/hooks'
import ResumeMatch from './ResumeMatch'
import SimilarJobs from './SimilarJobs'

/**
 * JobSidebar Component
 * 
 * Combined sidebar component that displays:
 * - Resume Match Breakdown: Shows how the user's resume matches the job requirements
 * - Similar Opportunities: List of similar job opportunities
 * 
 * This component appears in the sidebar of the job detail page.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} [props.onJobClick] - Optional callback when a similar job is clicked
 * @param {string} props.onJobClick.id - Job ID to navigate to
 * 
 * @returns {JSX.Element} Rendered sidebar with resume match and similar jobs
 * 
 * @example
 * <JobSidebar onJobClick={(id) => navigate(`/jobs/${id}`)} />
 */
function JobSidebar({ onJobClick }) {
  // ============================================
  // Redux State
  // ============================================
  
  /**
   * Get current job from Redux store
   * @type {Object|null}
   */
  const { currentJob } = useAppSelector((state) => state.jobDetail)
  
  /**
   * Extract match factors array or use empty array as fallback
   * 
   * Each factor contains:
   * - label: Name of the factor (e.g., "React", "TypeScript")
   * - weight: Importance weight (0-1)
   * - score: Match score for this factor (0-1)
   * 
   * @type {Array<Object>}
   */
  const factors = currentJob?.matchFactors || []
  
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
  
  // Don't render if no match factors or similar jobs
  if (factors.length === 0 && similarJobs.length === 0) return null

  return (
    <div className="jobdetail__sidebar-content">
      {/* Resume Match Breakdown */}
      {factors.length > 0 && <ResumeMatch />}

      {/* Similar Opportunities */}
      {similarJobs.length > 0 && <SimilarJobs onJobClick={onJobClick} />}
    </div>
  )
}

export default JobSidebar

