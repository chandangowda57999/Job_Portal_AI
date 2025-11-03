import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setActiveTab } from '../../../store/slices/jobDetailSlice'

/**
 * JobSections Component
 * 
 * Main content area component that displays job information in a tabbed interface.
 * Manages four distinct tabs: Description, Requirements, Company, and Similar Jobs.
 * 
 * Features:
 * - Tab navigation with active state management via Redux
 * - Conditional rendering based on active tab
 * - Responsive layout that adapts when sidebar is hidden
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onJobClick - Callback function when similar job is clicked
 * @param {Function} props.onJobClick.id - Job ID to navigate to
 * 
 * @returns {JSX.Element} Rendered tabbed content area with job information
 * 
 * @example
 * <JobSections onJobClick={(id) => navigate(`/jobs/${id}`)} />
 */
function JobSections({ onJobClick }) {
  // ============================================
  // Redux State
  // ============================================
  
  /**
   * Redux dispatch function for state updates
   * @type {Function}
   */
  const dispatch = useAppDispatch()
  
  /**
   * Get active tab and current job from Redux store
   * @type {Object}
   * @property {string} activeTab - Currently active tab name
   * @property {Object|null} currentJob - Current job data object
   */
  const { activeTab, currentJob } = useAppSelector((state) => state.jobDetail)

  // ============================================
  // Computed Values
  // ============================================
  
  /**
   * Get job data or empty object fallback
   * @type {Object}
   */
  const job = currentJob || {}
  
  /**
   * Destructure job properties with safe defaults
   * @type {Object}
   */
  const { description, requirements, keywords, companyInfo, company, similarJobs } = job
  
  /**
   * Extract company name with fallback
   * @type {string}
   */
  const companyName = company?.name || ''

  /**
   * Available tab names in order
   * @type {string[]}
   * @constant
   */
  const tabs = ['Description', 'Requirements', 'Company', 'Similar Jobs']

  // ============================================
  // Event Handlers
  // ============================================
  
  /**
   * Handle tab change event
   * 
   * Updates the active tab in Redux store, which triggers conditional rendering
   * of tab content and layout adjustments in the parent JobDetail component.
   * 
   * @function handleTabChange
   * @param {string} tab - Tab name to activate
   * @returns {void}
   */
  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab))
  }

  // ============================================
  // Render
  // ============================================
  
  return (
    <div className="jobdetail__main card">
      {/* Tab Navigation Bar */}
      {/* 
        Renders clickable tabs for navigating between different job information sections.
        Active tab is highlighted with CSS class for visual feedback.
      */}
      <div className="jobdetail__tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`jobdetail__tab ${activeTab === tab ? 'jobdetail__tab--active' : ''}`}
            onClick={() => handleTabChange(tab)}
            aria-selected={activeTab === tab}
            role="tab"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content: Description */}
      {/* 
        Shows job description, key requirements, and keywords extracted from job posting.
        This is the default tab when viewing a job.
      */}
      {activeTab === 'Description' && description && (
        <>
          <div className="jobdetail__section">
            <h3>About the role</h3>
            <p className="jobdetail__text">{description}</p>
          </div>

          {requirements && requirements.length > 0 && (
            <div className="jobdetail__section">
              <h3>Key requirements</h3>
              <ul className="jobdetail__list">
                {requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {keywords && keywords.length > 0 && (
            <div className="jobdetail__section">
              <h3>Keywords from JD</h3>
              <div className="jobdetail__keywords">
                {keywords.map((kw) => (
                  <span key={kw} className="jobdetail__keyword">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Tab Content: Requirements */}
      {/* 
        Displays detailed list of required skills and experience.
        Also shows technical keywords as tags for quick scanning.
      */}
      {activeTab === 'Requirements' && requirements && (
        <div className="jobdetail__section">
          <h3>Required Skills & Experience</h3>
          <ul className="jobdetail__list">
            {requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
          {/* Technical Keywords Section */}
          {keywords && keywords.length > 0 && (
            <div className="jobdetail__section" style={{ marginTop: 'var(--space-6)' }}>
              <h3>Technical Keywords</h3>
              <div className="jobdetail__keywords">
                {keywords.map((kw) => (
                  <span key={kw} className="jobdetail__keyword">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Company */}
      {/* 
        Shows detailed company information and description.
        When this tab is active, the sidebar is hidden for full-width display.
      */}
      {activeTab === 'Company' && companyInfo && (
        <div className="jobdetail__section">
          <h3>About {companyName}</h3>
          <p className="jobdetail__text">{companyInfo}</p>
        </div>
      )}

      {/* Tab Content: Similar Jobs */}
      {/* 
        Displays a list of similar job opportunities with their match scores.
        Jobs are clickable and navigate to their detail pages.
        When this tab is active, the sidebar is hidden for full-width display.
      */}
      {activeTab === 'Similar Jobs' && similarJobs && similarJobs.length > 0 && (
        <div className="jobdetail__section">
          <h3>Similar Opportunities</h3>
          <ul className="jobdetail__similar" style={{ marginTop: 'var(--space-4)' }}>
            {similarJobs.map((job) => (
              <li
                key={job.id}
                className="hover-lift"
                style={{ cursor: 'pointer' }}
                onClick={() => onJobClick(job.id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onJobClick(job.id)
                  }
                }}
              >
                <div>
                  <div className="jobdetail__similar-title">{job.title}</div>
                  <div className="jobdetail__similar-sub">{job.company}</div>
                </div>
                <div className="jobdetail__similar-fit">{job.match}%</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default JobSections


