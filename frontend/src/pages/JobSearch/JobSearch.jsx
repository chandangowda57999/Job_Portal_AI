import React, { useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setQuery, setJobs, setFilters as setJobSearchFilters, setTotalPages } from '../../store/slices/jobSearchSlice'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import JobList from './components/JobList'
import Pagination from './components/Pagination'
import './JobSearch.css'

/**
 * Job Search Page (Container)
 * Search roles with filters and paginated list per wireframe.
 * Uses Redux for state management.
 */
function JobSearch() {
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const { query, filters, jobs, page } = useAppSelector((state) => state.jobSearch)

  // Initialize mock data; replace with API later
  const mockJobs = useMemo(() => ([
    { id: 's1', role: 'Frontend Engineer', company: 'Acme', location: 'Remote', salary: '$', type: 'Full-time', badges: ['Remote', 'Urgent'] },
    { id: 's2', role: 'React Developer', company: 'Globex', location: 'NY', salary: '$$', type: 'Contract', badges: ['Remote'] },
    { id: 's3', role: 'UI Engineer', company: 'Initech', location: 'SF', salary: '$$$', type: 'Full-time', badges: [] },
    { id: 's4', role: 'Fullstack Dev', company: 'Umbrella', location: 'Remote', salary: '$$', type: 'Full-time', badges: ['Urgent'] },
  ]), [])

  useEffect(() => {
    if (jobs.length === 0) {
      dispatch(setJobs(mockJobs))
      dispatch(setTotalPages(3))
    }
    const q = searchParams.get('q')
    if (q) {
      dispatch(setQuery(q))
    }
  }, [dispatch, jobs.length, mockJobs, searchParams])

  const filtered = jobs.filter(j => (query ? (j.role + ' ' + j.company).toLowerCase().includes(query.toLowerCase()) : true))

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
        <JobList items={filtered} />
        <Pagination />
      </div>
    </div>
  )
}

export default JobSearch


