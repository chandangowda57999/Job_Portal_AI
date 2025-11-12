import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setActiveTab } from '../../../store/slices/jobDetailSlice'

/**
 * JobSections Component
 * 
 * Main content area component that displays job information in a scrollable single-page interface.
 * Features:
 * - Sticky tab navigation that auto-updates based on scroll position
 * - Smooth scroll to sections when tabs are clicked
 * - All sections visible in a single scrollable page
 * - Intersection Observer for scroll-based tab highlighting
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onJobClick - Callback function when similar job is clicked
 * 
 * @returns {JSX.Element} Rendered scrollable content area with all job information sections
 * 
 * @example
 * <JobSections onJobClick={(id) => navigate(`/jobs/${id}`)} />
 */
function JobSections() {
  // ============================================
  // Refs for Section Elements
  // ============================================
  
  /**
   * Refs for each scrollable section to enable scroll spy
   * @type {Object<RefObject<HTMLElement>>}
   */
  const sectionRefs = {
    description: useRef(null),
    requirements: useRef(null),
    company: useRef(null),
  }

  /**
   * Flag to prevent tab updates during programmatic scrolling
   * @type {RefObject<boolean>}
   */
  const isScrolling = useRef(false)

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
  const { description, requirements, keywords, companyInfo, company } = job
  
  /**
   * Extract company name with fallback
   * @type {string}
   */
  const companyName = company?.name || ''

  /**
   * Available tab names in order with their corresponding section IDs
   * Memoized to prevent unnecessary re-renders
   * @type {Array<{name: string, id: string}>}
   */
  const tabs = useMemo(() => [
    { name: 'Description', id: 'description' },
    { name: 'Requirements', id: 'requirements' },
    { name: 'Company', id: 'company' },
  ], [])

  // ============================================
  // Intersection Observer for Scroll Spy
  // ============================================
  
  /**
   * Handle scroll spy using Intersection Observer
   * Updates active tab based on which section is currently in view
   * 
   * @effect
   * @dependencies {description, requirements, companyInfo, similarJobs, activeTab, dispatch, tabs}
   */
  useEffect(() => {
    // Don't set up observer if no sections are available
    const hasSections = description || (requirements && requirements.length > 0) || companyInfo
    if (!hasSections) return

    const observerOptions = {
      root: null,
      rootMargin: '-140px 0px -40% 0px', // Trigger zone: 140px from top (accounts for sticky tabs + progress bar)
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // Fine-grained thresholds for accurate detection
    }

    /**
     * Callback for Intersection Observer
     * Updates active tab when a section enters the viewport
     */
    const handleIntersection = (entries) => {
      if (isScrolling.current) return

      const intersectingEntries = []
      const triggerPoint = 140 // Match rootMargin top offset
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect
          const sectionTop = rect.top
          const distanceFromTrigger = Math.abs(sectionTop - triggerPoint)
          
          const visibleTop = Math.max(0, -rect.top)
          const visibleBottom = Math.min(rect.height, window.innerHeight - rect.top)
          const visibleHeight = Math.max(0, visibleBottom - visibleTop)
          const visibleRatio = visibleHeight / rect.height
          
          let score = 0
          if (sectionTop <= triggerPoint + 100) {
            score = (1 - Math.min(distanceFromTrigger / 200, 1)) * 2 + visibleRatio
          } else {
            score = visibleRatio * 0.5
          }
          
          intersectingEntries.push({
            id: entry.target.id,
            score,
            distance: distanceFromTrigger,
            ratio: entry.intersectionRatio,
            visibleRatio,
          })
        }
      })

      if (intersectingEntries.length === 0) return

      intersectingEntries.sort((a, b) => {
        if (Math.abs(a.score - b.score) > 0.1) {
          return b.score - a.score
        }
        return a.distance - b.distance
      })

      const bestSection = intersectingEntries[0]
      if (bestSection && bestSection.score > 0) {
        const tab = tabs.find((t) => t.id === bestSection.id)
        if (tab && activeTab !== tab.name) {
          dispatch(setActiveTab(tab.name))
        }
      }
    }

    // Create observer
    const observer = new IntersectionObserver(handleIntersection, observerOptions)

    // Function to observe all available sections
    const observeSections = () => {
      Object.entries(sectionRefs).forEach(([key, ref]) => {
        // Only observe if the section has content and ref is attached
        const shouldObserve = 
          (key === 'description' && description && ref.current) ||
          (key === 'requirements' && requirements && requirements.length > 0 && ref.current) ||
          (key === 'company' && companyInfo && ref.current)

        if (shouldObserve) {
          observer.observe(ref.current)
        }
      })
    }

    // Observe sections after a short delay to ensure refs are attached
    // Use requestAnimationFrame to wait for DOM to be ready
    const timeoutId = setTimeout(() => {
      observeSections()
    }, 100)

    // Backup scroll listener for robust detection
    const handleScroll = () => {
      if (isScrolling.current) return
      
      let currentSection = null
      let minDistance = Infinity
      const triggerPoint = 140
      
      Object.entries(sectionRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect()
          const distance = Math.abs(rect.top - triggerPoint)
          
          if (rect.top <= triggerPoint + 100 && rect.bottom > triggerPoint - 50) {
            if (distance < minDistance) {
              minDistance = distance
              currentSection = key
            }
          }
        }
      })
      
      if (currentSection) {
        const tab = tabs.find((t) => t.id === currentSection)
        if (tab && activeTab !== tab.name) {
          dispatch(setActiveTab(tab.name))
        }
      }
    }

    let scrollTimeout = null
    const throttledScroll = () => {
      if (scrollTimeout) return
      scrollTimeout = setTimeout(() => {
        handleScroll()
        scrollTimeout = null
      }, 100)
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })

    // Cleanup: disconnect observer on unmount
    return () => {
      clearTimeout(timeoutId)
      if (scrollTimeout) clearTimeout(scrollTimeout)
      observer.disconnect()
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [description, requirements, companyInfo, activeTab, dispatch, tabs])

  // ============================================
  // Event Handlers
  // ============================================
  
  /**
   * Handle tab click with smooth scroll to section
   * 
   * When a tab is clicked:
   * 1. Sets scrolling flag to prevent observer from updating tab during scroll
   * 2. Smoothly scrolls to the corresponding section
   * 3. Updates active tab in Redux
   * 4. Resets scrolling flag after scroll completes
   * 
   * @function handleTabClick
   * @param {string} tabId - Section ID to scroll to
   * @param {string} tabName - Tab name to set as active
   * @returns {void}
   */
  const handleTabClick = useCallback((tabId, tabName) => {
    const section = sectionRefs[tabId]?.current
    if (!section) return

    // Set flag to prevent observer from updating during scroll
    isScrolling.current = true
    dispatch(setActiveTab(tabName))

    // Calculate offset for sticky tabs (adjust based on your sticky tab height)
    const stickyOffset = 120 // Approximate height of sticky header + tabs + progress bar
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - stickyOffset

    // Smooth scroll to section
    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth',
    })

    // Reset flag after scroll completes (approximate duration of smooth scroll)
    setTimeout(() => {
      isScrolling.current = false
    }, 1000) // Adjust based on scroll duration
  }, [sectionRefs, dispatch])

  // ============================================
  // Render
  // ============================================
  
  return (
    <div className="jobdetail__main card">
      {/* Sticky Tab Navigation Bar */}
      {/* 
        Sticky tabs that remain visible while scrolling.
        Active tab is highlighted based on scroll position or click.
      */}
      <div className="jobdetail__tabs-container">
        <div className="jobdetail__tabs jobdetail__tabs--sticky">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name
            
            return (
              <button
                key={tab.id}
                className={`jobdetail__tab ${isActive ? 'jobdetail__tab--active' : ''}`}
                onClick={() => handleTabClick(tab.id, tab.name)}
                aria-selected={isActive}
                role="tab"
                type="button"
                aria-label={`${tab.name} section${isActive ? ' - Currently viewing' : ''}`}
              >
                <span className="jobdetail__tab-label">
                  {isActive && <span className="jobdetail__tab-active-indicator" aria-hidden="true">●</span>}
                  {tab.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* All Sections Rendered - Single Scrollable Page */}
      <div className="jobdetail__sections-container">
        {/* Section: Description */}
        {description && (
          <section
            id="description"
            ref={sectionRefs.description}
            className="jobdetail__scroll-section"
          >
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
          </section>
        )}

        {/* Section: Requirements */}
        {requirements && requirements.length > 0 && (
          <section
            id="requirements"
            ref={sectionRefs.requirements}
            className="jobdetail__scroll-section"
          >
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
          </section>
        )}

        {/* Section: Company */}
        {companyInfo && (
          <section
            id="company"
            ref={sectionRefs.company}
            className="jobdetail__scroll-section"
          >
            <div className="jobdetail__section">
              <h3>About {companyName}</h3>
              <p className="jobdetail__text">{companyInfo}</p>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}

export default JobSections


