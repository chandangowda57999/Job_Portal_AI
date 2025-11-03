import React, { useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setActiveTab, setCurrentJob, resetJobDetail } from '../../store/slices/jobDetailSlice'
import JobHeader from './components/JobHeader'
import JobSections from './components/JobSections'
import ResumeMatch from './components/ResumeMatch'
import CompanyAbout from './components/CompanyAbout'
import SimilarJobs from './components/SimilarJobs'
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
   * Get active tab and current job from Redux store
   * @type {Object}
   * @property {string} activeTab - Currently active tab ('Description', 'Requirements', etc.)
   * @property {Object|null} currentJob - Current job data object or null
   */
  const { activeTab, currentJob } = useAppSelector((state) => state.jobDetail)

  // ============================================
  // Mock Data (Temporary - Replace with API)
  // ============================================
  
  /**
   * Mock job data for demonstration purposes
   * 
   * This should be replaced with an API call to fetch actual job details.
   * The structure matches the expected job data schema.
   * 
   * @type {Object}
   * @property {string} id - Unique job identifier
   * @property {Object} company - Company information
   * @property {string} company.name - Company name
   * @property {string} company.logoUrl - URL to company logo image
   * @property {string} role - Job title/role name
   * @property {string} location - Job location (e.g., "Remote • US")
   * @property {string} compensation - Salary/compensation range
   * @property {string} type - Employment type (Full-time, Contract, etc.)
   * @property {string} postedAt - When the job was posted
   * @property {string[]} keywords - Array of relevant keywords extracted from JD
   * @property {string} description - Full job description
   * @property {string[]} requirements - Array of required skills/experience
   * @property {string} companyInfo - Company description/about text
   * @property {Object[]} similarJobs - Array of similar job opportunities
   * @property {number} matchScore - AI-calculated match percentage (0-100)
   * @property {Object[]} matchFactors - Breakdown of match score by factor
   * @property {boolean} saved - Whether user has saved this job
   */
  const mockJob = useMemo(() => ({
    id: jobId || '123',
    role: 'Senior Frontend Engineer',
    company: {
      name: 'Acme Corp',
      logoUrl: 'https://via.placeholder.com/64x64.png?text=A',
    },
    location: 'Remote • US',
    compensation: '$150k–$190k + equity',
    type: 'Full-time',
    postedAt: '2 days ago',
    keywords: ['React', 'TypeScript', 'GraphQL', 'Vite', 'Testing', 'Leadership'],
    description:
      'We are looking for a Senior Frontend Engineer to build delightful user experiences. You will work closely with design and product to ship high-impact features with strong attention to performance, accessibility, and quality.',
    requirements: [
      '5+ years building modern web applications',
      'Expertise with React and TypeScript',
      'Experience with testing frameworks (Jest, Testing Library)',
      'Strong understanding of accessibility and performance',
    ],
    companyInfo:
      'Acme Corp builds AI-powered tools for job seekers and recruiters with a focus on explainable recommendations and delightful UX.',
    similarJobs: [
      { id: '201', title: 'Staff Frontend Engineer', company: 'Globex', match: 82 },
      { id: '202', title: 'Senior UI Engineer', company: 'Initech', match: 79 },
    ],
    matchScore: 88,
    matchFactors: [
      { label: 'React', weight: 0.25, score: 1 },
      { label: 'TypeScript', weight: 0.2, score: 0.9 },
      { label: 'GraphQL', weight: 0.15, score: 0.8 },
      { label: 'Testing', weight: 0.15, score: 0.85 },
      { label: 'Accessibility', weight: 0.1, score: 0.9 },
      { label: 'Leadership', weight: 0.15, score: 0.6 },
    ],
    saved: false,
  }), [jobId])

  // ============================================
  // Side Effects
  // ============================================
  
  /**
   * Initialize job data in Redux store when component mounts or jobId changes
   * 
   * This effect:
   * 1. Dispatches the mock job data to Redux store when component mounts
   * 2. Resets the job detail state when component unmounts (cleanup)
   * 
   * @todo Replace with API call: fetchJobDetails(jobId).then(setCurrentJob)
   * 
   * @effect
   * @dependencies {dispatch, jobId, mockJob} - Re-runs when jobId changes or component mounts
   */
  useEffect(() => {
    // Set current job in Redux store
    dispatch(setCurrentJob(mockJob))
    
    // Cleanup: Reset state when leaving the page to prevent stale data
    return () => {
      dispatch(resetJobDetail())
    }
  }, [dispatch, jobId, mockJob])

  // ============================================
  // Computed Values
  // ============================================
  
  /**
   * Get current job from Redux store, fallback to mock data if not loaded
   * 
   * @type {Object}
   * @constant
   */
  const job = currentJob || mockJob

  // ============================================
  // Event Handlers
  // ============================================
  
  /**
   * Navigate back to dashboard
   * Called when user clicks the "Back" button in the job header
   * 
   * @function onBack
   * @returns {void}
   */
  const onBack = () => {
    navigate('/dashboard')
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
  
  /**
   * Handle tab change in job detail sections
   * 
   * Updates the active tab in Redux store, which controls:
   * - Which content is displayed in JobSections
   * - Whether sidebar (ResumeMatch, CompanyAbout, SimilarJobs) is shown
   * - Layout adjustments (full-width for Company/Similar Jobs tabs)
   * 
   * @function handleTabChange
   * @param {string} tab - Tab name ('Description', 'Requirements', 'Company', 'Similar Jobs')
   * @returns {void}
   */
  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab))
  }

  // ============================================
  // Render
  // ============================================
  
  return (
    <div className="jobdetail">
      {/* Animated gradient background layers for visual consistency with SignIn page */}
      <div className="jobdetail__background" aria-hidden="true">
        <div className="jobdetail__background-layer jobdetail__background-layer--1"></div>
        <div className="jobdetail__background-layer jobdetail__background-layer--2"></div>
        <div className="jobdetail__background-layer jobdetail__background-layer--3"></div>
      </div>

      <div className="jobdetail__container">
        {/* Job Header Section */}
        {/* Contains: Company logo, role title, location, compensation, match score, action buttons */}
        {job && (
          <JobHeader
            onBack={onBack}
            onSave={onSave}
            onApply={onApply}
          />
        )}

        {/* Main Content Body */}
        {/* 
          Layout adapts based on active tab:
          - Description/Requirements: Two-column (main content + sidebar)
          - Company/Similar Jobs: Full-width (no sidebar)
        */}
        <div
          className={`jobdetail__body ${
            activeTab === 'Company' || activeTab === 'Similar Jobs' ? 'jobdetail__body--full-width' : ''
          }`}
        >
          {/* Left Column: Main Content Area */}
          {/* 
            Tabbed interface displaying:
            - Description: Job description, requirements, keywords
            - Requirements: Detailed requirements list
            - Company: Company information
            - Similar Jobs: List of similar opportunities
          */}
          <JobSections
            onJobClick={(id) => navigate(`/jobs/${id}`)}
          />

          {/* Right Column: Sidebar (Only shown on Description tab) */}
          {/* 
            Contains contextual information:
            - Resume Match: Breakdown of match score factors
            - Company About: Company description
            - Similar Jobs: Quick list of related opportunities
          */}
          {activeTab === 'Description' && job && (
            <aside className="jobdetail__aside">
              <ResumeMatch />
              <CompanyAbout />
              <SimilarJobs onJobClick={(id) => navigate(`/jobs/${id}`)} />
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobDetail


