import React from 'react'
import { useAppSelector } from '../../../store/hooks'

/**
 * ResumeMatch Component
 * 
 * Displays an explainable breakdown of how the user's resume matches the job requirements.
 * Shows individual match factors (skills, experience, etc.) with their respective scores
 * as visual progress bars. This transparency helps users understand why they received
 * a particular match score and what areas they could improve.
 * 
 * Features:
 * - Visual progress bars for each match factor
 * - Percentage scores for each factor
 * - "Improve fit" action button
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
   * @property {string} label - Factor name
   * @property {number} weight - Weight importance (0-1)
   * @property {number} score - Match score (0-1)
   */
  const factors = currentJob?.matchFactors || []

  // ============================================
  // Render
  // ============================================
  
  return (
    <div className="jobdetail__card card">
      {/* Section Title */}
      <div className="jobdetail__aside-title">Resume Match Breakdown</div>

      {/* Match Factors List */}
      {/* 
        Renders each match factor as a progress bar showing:
        - Factor name (e.g., "React", "TypeScript")
        - Match percentage for that factor
        - Visual progress bar representation
      */}
      <div className="jobdetail__factors">
        {factors.map((f) => {
          /**
           * Calculate percentage score (0-100) from decimal score (0-1)
           * @type {number}
           */
          const pct = Math.round(f.score * 100)

          return (
            <div key={f.label} className="jobdetail__factor">
              {/* Factor Header Row */}
              {/* Shows factor name and percentage score */}
              <div className="jobdetail__factor-row">
                <span>{f.label}</span>
                <span className="jobdetail__factor-score">{pct}%</span>
              </div>

              {/* Progress Bar Visualization */}
              {/* 
                Visual representation of match percentage.
                Width of fill bar corresponds to match percentage.
              */}
              <div className="jobdetail__bar">
                <div
                  className="jobdetail__bar-fill"
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${f.label} match: ${pct}%`}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Button */}
      {/* 
        Provides action to help user improve their match score.
        Could open suggestions, skill recommendations, or resume tips.
      */}
      <button
        className="jobdetail__improve"
        type="button"
        onClick={() => {
          // TODO: Implement improve fit functionality
          // Could open modal with suggestions, link to resume builder, etc.
          alert('Improve fit suggestions coming soon!')
        }}
      >
        Improve fit
      </button>
    </div>
  )
}

export default ResumeMatch


