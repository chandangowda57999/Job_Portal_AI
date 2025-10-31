import React from 'react'

/**
 * SearchBar
 * Search input for roles/skills/location with primary action.
 *
 * @param {{ query: string, onQueryChange: (q: string) => void }} props
 */
function SearchBar({ query, onQueryChange }) {
  return (
    <div className="searchp__section">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
        <input className="apps__input" placeholder="Search roles, skills, location..." value={query} onChange={(e) => onQueryChange(e.target.value)} />
        <button className="button button--primary button--medium">Go</button>
      </div>
    </div>
  )
}

export default SearchBar


