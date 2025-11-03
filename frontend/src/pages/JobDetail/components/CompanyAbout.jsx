import React from 'react'
import { useAppSelector } from '../../../store/hooks'

/**
 * CompanyAbout Component
 * 
 * Displays a brief company description and information in a sidebar card.
 * Provides context about the company posting the job, helping users make
 * informed decisions about applying.
 * 
 * This component is part of the job detail sidebar and is only visible
 * when the "Description" tab is active.
 * 
 * @component
 * @returns {JSX.Element} Rendered company about card
 * 
 * @example
 * <CompanyAbout />
 */
function CompanyAbout() {
  // ============================================
  // Redux State
  // ============================================
  
  /**
   * Get current job from Redux store
   * @type {Object|null}
   */
  const { currentJob } = useAppSelector((state) => state.jobDetail)
  
  /**
   * Extract company name with safe fallback
   * @type {string}
   */
  const companyName = currentJob?.company?.name || ''
  
  /**
   * Extract company description/info text with safe fallback
   * @type {string}
   */
  const text = currentJob?.companyInfo || ''

  // ============================================
  // Render
  // ============================================
  
  // Don't render if no company info is available
  if (!text) return null

  return (
    <div className="jobdetail__card card">
      {/* Section Title */}
      {/* Displays company name in the section header */}
      <div className="jobdetail__aside-title">About {companyName}</div>

      {/* Company Description */}
      {/* 
        Company information text describing:
        - Company mission and values
        - Products/services
        - Company culture
        - Recent achievements
      */}
      <p className="jobdetail__text">{text}</p>
    </div>
  )
}

export default CompanyAbout


