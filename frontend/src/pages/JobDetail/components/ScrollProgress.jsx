import React, { useState, useEffect } from 'react'

/**
 * ScrollProgress Component
 * 
 * Displays a scroll progress indicator at the top of the page.
 * Shows how far the user has scrolled through the job detail content.
 * 
 * @component
 * @returns {JSX.Element} Rendered scroll progress bar
 * 
 * @example
 * <ScrollProgress />
 */
function ScrollProgress() {
  // ============================================
  // State
  // ============================================
  
  /**
   * Scroll progress percentage (0-100)
   * @type {[number, Function]}
   */
  const [scrollProgress, setScrollProgress] = useState(0)

  // ============================================
  // Side Effects
  // ============================================
  
  /**
   * Calculate scroll progress based on scroll position
   * 
   * @effect
   * @dependencies {[]} - Runs once on mount
   */
  useEffect(() => {
    /**
     * Calculate scroll progress percentage
     * 
     * @function calculateScrollProgress
     * @returns {void}
     */
    const calculateScrollProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      
      const scrollableHeight = documentHeight - windowHeight
      
      const progress = scrollableHeight > 0 
        ? (scrollTop / scrollableHeight) * 100 
        : 0
      
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    // Calculate initial progress
    calculateScrollProgress()
    
    // Add scroll and resize event listeners
    window.addEventListener('scroll', calculateScrollProgress, { passive: true })
    window.addEventListener('resize', calculateScrollProgress, { passive: true })

    // Cleanup: remove event listeners on unmount
    return () => {
      window.removeEventListener('scroll', calculateScrollProgress)
      window.removeEventListener('resize', calculateScrollProgress)
    }
  }, [])

  // ============================================
  // Render
  // ============================================
  
  return (
    <div className="jobdetail__scroll-progress">
      <div 
        className="jobdetail__scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Scroll progress: ${Math.round(scrollProgress)}%`}
      />
    </div>
  )
}

export default ScrollProgress

