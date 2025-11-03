import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setFilters } from '../../../store/slices/jobSearchSlice'

/**
 * Filters
 * Dropdown filters for Location, Type, Experience, Salary.
 * Uses Redux for filters state.
 */
function Filters() {
  const dispatch = useAppDispatch()
  const { filters } = useAppSelector((state) => state.jobSearch)

  return (
    <div className="searchp__section">
      <div className="searchp__filters">
        <select value={filters.location} onChange={(e) => dispatch(setFilters({ location: e.target.value }))}>
          {['Any', 'Remote', 'NY', 'SF'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={filters.type} onChange={(e) => dispatch(setFilters({ type: e.target.value }))}>
          {['Any', 'Full-time', 'Contract', 'Part-time'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={filters.experience} onChange={(e) => dispatch(setFilters({ experience: e.target.value }))}>
          {['Any', 'Junior', 'Mid', 'Senior'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={filters.salary} onChange={(e) => dispatch(setFilters({ salary: e.target.value }))}>
          {['Any', '$', '$$', '$$$'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  )
}

export default Filters


