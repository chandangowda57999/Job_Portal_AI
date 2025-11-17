import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setActiveTab, setCurrentJob, resetJobDetail, setLoading, setError } from '../../store/slices/jobDetailSlice'
import { fetchJobDetail } from '../../services/dashboardService'
import JobHeader from './components/JobHeader'
import JobSections from './components/JobSections'
import JobSidebar from './components/JobSidebar'
import ScrollProgress from './components/ScrollProgress'
import './JobDetail.css'

/**
 * JobDetail Page Component
 * 
 * Main container component for displaying detailed information about a specific job posting.
 * Features include:
 * - Job header with company logo, role, location, and match score
 * - Tabbed interface for Description, Requirements, Company, and Similar Jobs
 * - Resume match breakdown with explainable factors
 * - Company information sidebar
 * - Similar job recommendations
 * 
 * @component
 * @returns {JSX.Element} Rendered job detail page with all subcomponents
 * 
 * @example
 * // Route: /jobs/:jobId
 * <JobDetail />
 * 
 * @todo Replace mock data with actual API call to fetch job details by ID
 * @todo Implement save functionality to persist user's saved jobs
 * @todo Add application tracking when user applies to a job
 */
function JobDetail() {
  // ============================================
  // Hooks & Router
  // ============================================
  
  /**
   * Navigation hook for programmatic routing
   * @type {Function}
   */
  const navigate = useNavigate()
  
  /**
   * Extract jobId from URL parameters
   * @type {string}
   */
  const { jobId } = useParams()
  
  /**
   * Redux dispatch function for state updates
   * @type {Function}
   */
  const dispatch = useAppDispatch()
  
  /**
   * Get active tab, current job, loading, and error from Redux store
   * @type {Object}
   * @property {string} activeTab - Currently active tab ('Description', 'Requirements', etc.)
   * @property {Object|null} currentJob - Current job data object or null
   * @property {boolean} loading - Loading state
   * @property {string|null} error - Error message or null
   */
  const { activeTab, currentJob, loading, error } = useAppSelector((state) => state.jobDetail)


  // ============================================
  // Side Effects
  // ============================================
  
  /**
   * Fetch job detail from API when component mounts or jobId changes
   * 
   * This effect:
   * 1. Fetches job detail from backend API
   * 2. Updates Redux store with job data
   * 3. Sets loading and error states
   * 4. Resets state when component unmounts (cleanup)
   * 
   * @effect
   * @dependencies {dispatch, jobId} - Re-runs when jobId changes or component mounts
   */
  useEffect(() => {
    // Only fetch if jobId is provided
    if (!jobId) {
      dispatch(setError('Job ID is required'))
      return
    }

    const loadJobDetail = async () => {
      try {
        dispatch(setLoading(true))
        dispatch(setError(null))
        
        // Fetch job detail from backend API
        // userId is optional - can be added later for match score calculation
        const jobDetail = await fetchJobDetail(jobId, null)
        
        // Set current job in Redux store
        dispatch(setCurrentJob(jobDetail))
        
        // Set default active tab to Description when job loads
        if (!activeTab) {
          dispatch(setActiveTab('Description'))
        }
      } catch (err) {
        console.error('Error loading job detail:', err)
        dispatch(setError(err.message || 'Failed to load job details. Please try again later.'))
      } finally {
        dispatch(setLoading(false))
      }
    }

    loadJobDetail()
    
    // Cleanup: Reset state when leaving the page to prevent stale data
    return () => {
      dispatch(resetJobDetail())
    }
  }, [dispatch, jobId])

  // ============================================
  // Computed Values
  // ============================================
  
  /**
   * Get current job from Redux store
   * 
   * @type {Object|null}
   * @constant
   */
  const job = currentJob

  // ============================================
  // Event Handlers
  // ============================================
  
  /**
   * Navigate back to previous page or search page
   * Called when user clicks the "Back" button in the job header
   * 
   * @function onBack
   * @returns {void}
   */
  const onBack = () => {
    navigate(-1) // Go back to previous page (search or dashboard)
  }
  
  /**
   * Handle job application submission
   * 
   * Currently shows an alert placeholder. Should:
   * 1. Track application in backend
   * 2. Update application tracker state
   * 3. Show success/error notification
   * 
   * @function onApply
   * @returns {void}
   * @todo Implement actual application API call
   * @todo Add application tracking
   * @todo Add success/error notifications
   */
  const onApply = () => {
    // TODO: Replace with actual API call
    // await applyToJob(job.id)
    alert('Apply flow coming soon')
  }
  
  /**
   * Handle saving a job for later
   * 
   * Currently shows an alert placeholder. Should:
   * 1. Toggle save state in backend
   * 2. Update local state optimistically
   * 3. Show visual feedback (save icon fill)
   * 
   * @function onSave
   * @returns {void}
   * @todo Implement save/unsave API call
   * @todo Update UI state optimistically
   */
  const onSave = () => {
    // TODO: Replace with actual API call
    // await toggleSaveJob(job.id)
    alert('Saved!')
  }
  

  // ============================================
  // Render
  // ============================================
  
  return (
    <div className="jobdetail">
      <ScrollProgress />
      
      {/* Animated gradient background layers for visual consistency with SignIn page */}
      <div className="jobdetail__background" aria-hidden="true">
        <div className="jobdetail__background-layer jobdetail__background-layer--1"></div>
        <div className="jobdetail__background-layer jobdetail__background-layer--2"></div>
        <div className="jobdetail__background-layer jobdetail__background-layer--3"></div>
      </div>

      <div className="jobdetail__container">
        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p>Loading job details...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--error)' }}>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
            >
              Retry
            </button>
            <button 
              onClick={onBack} 
              style={{ marginTop: '1rem', marginLeft: '0.5rem', padding: '0.5rem 1rem' }}
            >
              Go Back
            </button>
          </div>
        )}

        {/* Job Detail Content */}
        {!loading && !error && job && (
          <>
            {/* Job Header Section */}
            {/* Contains: Company logo, role title, location, compensation, match score, action buttons */}
            <JobHeader
              onBack={onBack}
              onSave={onSave}
              onApply={onApply}
            />

            {/* Main Content Body */}
            {/* 
              Two-column layout:
              - Left: All job sections (Description, Requirements, Company) with sticky tabs
              - Right: Sticky sidebar with Resume Match and Similar Opportunities
            */}
            <div className="jobdetail__body">
              {/* Left Column: Main Content Area */}
              {/* 
                Single scrollable page displaying all sections:
                - Description: Job description, requirements, keywords
                - Requirements: Detailed requirements list
                - Company: Company information
              */}
              <div className="jobdetail__main-content">
                <JobSections />
              </div>

              {/* Right Column: Sticky Sidebar */}
              {/* 
                Sticky sidebar with:
                - Resume Match: Breakdown of match score factors with progress bars
                - Similar Opportunities: List of similar job opportunities
                - Remains visible while scrolling
              */}
              {((job.matchFactors && job.matchFactors.length > 0) || (job.similarJobs && job.similarJobs.length > 0)) && (
                <aside className="jobdetail__sidebar jobdetail__sidebar--sticky">
                  <JobSidebar onJobClick={(id) => navigate(`/jobs/${id}`)} />
                </aside>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default JobDetail


