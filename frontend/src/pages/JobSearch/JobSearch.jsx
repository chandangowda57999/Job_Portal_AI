import React, { useMemo, useState } from 'react'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import JobList from './components/JobList'
import Pagination from './components/Pagination'
import './JobSearch.css'

/**
 * Job Search Page (Container)
 * Search roles with filters and paginated list per wireframe.
 */
function JobSearch() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ location: 'Any', type: 'Any', experience: 'Any', salary: 'Any' })
  const [page, setPage] = useState(1)

  // Mock dataset
  const jobs = useMemo(() => ([
    { id: 's1', role: 'Frontend Engineer', company: 'Acme', location: 'Remote', salary: '$', type: 'Full-time', badges: ['Remote', 'Urgent'] },
    { id: 's2', role: 'React Developer', company: 'Globex', location: 'NY', salary: '$$', type: 'Contract', badges: ['Remote'] },
    { id: 's3', role: 'UI Engineer', company: 'Initech', location: 'SF', salary: '$$$', type: 'Full-time', badges: [] },
    { id: 's4', role: 'Fullstack Dev', company: 'Umbrella', location: 'Remote', salary: '$$', type: 'Full-time', badges: ['Urgent'] },
  ]), [])

  const filtered = jobs.filter(j => (query ? (j.role + ' ' + j.company).toLowerCase().includes(query.toLowerCase()) : true))

  return (
    <div className="searchp">
      <div className="searchp__background" aria-hidden="true">
        <div className="searchp__bg searchp__bg--1"></div>
        <div className="searchp__bg searchp__bg--2"></div>
        <div className="searchp__bg searchp__bg--3"></div>
      </div>
      <div className="searchp__container">
        <SearchBar query={query} onQueryChange={setQuery} />
        <Filters filters={filters} onChange={setFilters} />
        <JobList items={filtered} />
        <Pagination page={page} pages={3} onChange={setPage} />
      </div>
    </div>
  )
}

export default JobSearch


