import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setQuery } from '../../../store/slices/jobSearchSlice'

/**
 * SearchBar
 * Search input for roles/skills/location with primary action.
 * Uses Redux for query state.
 */
function SearchBar() {
  const dispatch = useAppDispatch()
  const { query } = useAppSelector((state) => state.jobSearch)

  return (
    <div className="searchp__section">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
        <input
          className="apps__input"
          placeholder="Search roles, skills, location..."
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
        />
        <button className="button button--primary button--medium">Go</button>
      </div>
    </div>
  )
}

export default SearchBar


