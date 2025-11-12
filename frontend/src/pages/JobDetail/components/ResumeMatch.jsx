import React from 'react'
import { useAppSelector } from '../../../store/hooks'

/**
 * ResumeMatch Component
 * 
 * Displays a breakdown of the resume match score with individual factors.
 * Shows how the user's resume matches the job requirements, providing
 * explainable AI recommendations.
 * 
 * This component is part of the job detail sidebar and displays:
 * - Match score breakdown by factor (skills, experience, etc.)
 * - Progress bars for each factor
 * - Visual indicators for match strength
 * 
 * @component
 * @returns {JSX.Element} Rendered resume match breakdown card
 * 
 * @example
 * <ResumeMatch />
 */
function ResumeMatch() {
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

  // ============================================
  // Render
  // ============================================
  
  // Don't render if no match factors are available
  if (factors.length === 0) return null

  return (
    <div className="jobdetail__card card">
      {/* Section Title */}
      {/* Displays the title for the resume match breakdown */}
      <div className="jobdetail__aside-title">Resume Match Breakdown</div>

      {/* Match Factors Grid */}
      {/* 
        Displays individual match factors with:
        - Factor name (label)
        - Match percentage (score * 100)
        - Visual progress bar
      */}
      <div className="jobdetail__factors">
        {factors.map((factor, index) => {
          // Calculate percentage from score (0-1 to 0-100)
          const percentage = Math.round(factor.score * 100)
          
          return (
            <div key={index} className="jobdetail__factor">
              {/* Factor Label and Score Row */}
              <div className="jobdetail__factor-row">
                <span>{factor.label}</span>
                <span className="jobdetail__factor-score">{percentage}%</span>
              </div>
              
              {/* Progress Bar */}
              {/* 
                Visual representation of match strength:
                - Width based on percentage (0-100%)
                - Gradient background for visual appeal
                - Smooth transition animation
              */}
              <div className="jobdetail__bar">
                <div
                  className="jobdetail__bar-fill"
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${factor.label} match: ${percentage}%`}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Improve Fit Button */}
      {/* 
        Call-to-action button for users to improve their resume match:
        - Suggests actions to increase match score
        - Could open a modal or navigate to resume editing page
      */}
      <button
        className="jobdetail__improve"
        type="button"
        onClick={() => {
          alert('Improve fit suggestions coming soon!')
        }}
      >
        <span>Improve fit</span>
      </button>
    </div>
  )
}

export default ResumeMatch

