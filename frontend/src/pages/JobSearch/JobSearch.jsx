import React, { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setQuery, setJobs, setFilters as setJobSearchFilters, setTotalPages, setLoading, setError } from '../../store/slices/jobSearchSlice'
import { fetchActiveJobs, transformJobForSearch } from '../../services/dashboardService'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import JobList from './components/JobList'
import Pagination from './components/Pagination'
import './JobSearch.css'

/**
 * Job Search Page (Container)
 * Search roles with filters and paginated list per wireframe.
 * Uses Redux for state management.
 * Fetches jobs from backend API.
 */
function JobSearch() {
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const { query, filters, jobs, page, loading, error } = useAppSelector((state) => state.jobSearch)

  // Fetch jobs from API on component mount
  useEffect(() => {
    const loadJobs = async () => {
      try {
        dispatch(setLoading(true))
        dispatch(setError(null))
        
        // Fetch active jobs from backend
        const activeJobs = await fetchActiveJobs()
        
        // Transform jobs to search page format
        const transformedJobs = activeJobs.map(transformJobForSearch)
        
        // Set jobs in Redux store
        dispatch(setJobs(transformedJobs))
        
        // Calculate total pages (assuming 10 jobs per page)
        const jobsPerPage = 10
        const totalPages = Math.ceil(transformedJobs.length / jobsPerPage)
        dispatch(setTotalPages(totalPages || 1))
      } catch (err) {
        console.error('Error loading jobs:', err)
        dispatch(setError(err.message || 'Failed to load jobs. Please try again later.'))
        // Set empty jobs on error
        dispatch(setJobs([]))
      } finally {
        dispatch(setLoading(false))
      }
    }

    // Only fetch if jobs are empty (avoid refetching on every render)
    if (jobs.length === 0 && !loading) {
      loadJobs()
    }
  }, [dispatch]) // Only run on mount

  // Handle search query from URL params
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      dispatch(setQuery(q))
    }
  }, [dispatch, searchParams])

  // Filter jobs based on search query and filters
  const filtered = useMemo(() => {
    return jobs.filter(j => {
      // Search query filter
      const matchesQuery = query 
        ? (j.role + ' ' + j.company + ' ' + j.location).toLowerCase().includes(query.toLowerCase())
        : true
      
      // Location filter
      const matchesLocation = filters.location === 'Any' || j.location === filters.location
      
      // Type filter
      const matchesType = filters.type === 'Any' || j.type === filters.type
      
      // Experience filter (simplified - can be enhanced)
      const matchesExperience = filters.experience === 'Any' || 
        (j.experienceLevel && j.experienceLevel.toLowerCase() === filters.experience.toLowerCase())
      
      // Salary filter
      const matchesSalary = filters.salary === 'Any' || j.salary === filters.salary
      
      return matchesQuery && matchesLocation && matchesType && matchesExperience && matchesSalary
    })
  }, [jobs, query, filters])

  return (
    <div className="searchp">
      <div className="searchp__background" aria-hidden="true">
        <div className="searchp__bg searchp__bg--1"></div>
        <div className="searchp__bg searchp__bg--2"></div>
        <div className="searchp__bg searchp__bg--3"></div>
      </div>
      <div className="searchp__container">
        <SearchBar />
        <Filters />
        
        {/* Loading state */}
        {loading && (
          <div className="searchp__section" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading jobs...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && !loading && (
          <div className="searchp__section" style={{ textAlign: 'center', padding: '2rem', color: 'var(--error)' }}>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Jobs list */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="searchp__section" style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No jobs found. Try adjusting your search or filters.</p>
              </div>
            ) : (
              <>
                <JobList items={filtered} />
                <Pagination />
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default JobSearch


