import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * JobList
 * Renders the list of search results with badges and actions.
 * Jobs are clickable and navigate to job detail page.
 *
 * @param {{ items: {id: string, role: string, company: string, location: string, salary: string, type: string, badges: string[]}[] }} props
 */
function JobList({ items }) {
  const navigate = useNavigate()

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`)
  }

  return (
    <div className="searchp__section">
      <div className="searchp__list">
        {items.map(j => (
          <div 
            key={j.id} 
            className="searchp__item"
            onClick={() => handleJobClick(j.id)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleJobClick(j.id)
              }
            }}
            aria-label={`View details for ${j.role} at ${j.company}`}
          >
            <div style={{ fontWeight: 700 }}>{j.role} @ {j.company}</div>
            <div style={{ color: 'var(--gray-600)' }}>{j.location} • {j.salary} • {j.type}</div>
            <div className="searchp__badges">
              {j.badges && j.badges.map(b => <span className="searchp__badge" key={b}>{b}</span>)}
            </div>
            <div 
              className="searchp__item-actions"
              onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking buttons
            >
              <button 
                className="searchp__btn"
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: Implement save functionality
                }}
              >
                Save
              </button>
              <button 
                className="searchp__btn"
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: Implement apply functionality
                }}
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobList


