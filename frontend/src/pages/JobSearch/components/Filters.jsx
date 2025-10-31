import React from 'react'

/**
 * Filters
 * Dropdown filters for Location, Type, Experience, Salary.
 *
 * @param {{ filters: {location: string, type: string, experience: string, salary: string}, onChange: (f: any) => void }} props
 */
function Filters({ filters, onChange }) {
  return (
    <div className="searchp__section">
      <div className="searchp__filters">
        <select value={filters.location} onChange={(e) => onChange({ ...filters, location: e.target.value })}>
          {['Any', 'Remote', 'NY', 'SF'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={filters.type} onChange={(e) => onChange({ ...filters, type: e.target.value })}>
          {['Any', 'Full-time', 'Contract', 'Part-time'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={filters.experience} onChange={(e) => onChange({ ...filters, experience: e.target.value })}>
          {['Any', 'Junior', 'Mid', 'Senior'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={filters.salary} onChange={(e) => onChange({ ...filters, salary: e.target.value })}>
          {['Any', '$', '$$', '$$$'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  )
}

export default Filters


