import React from 'react'

/**
 * JobList
 * Renders the list of search results with badges and actions.
 *
 * @param {{ items: {id: string, role: string, company: string, location: string, salary: string, type: string, badges: string[]}[] }} props
 */
function JobList({ items }) {
  return (
    <div className="searchp__section">
      <div className="searchp__list">
        {items.map(j => (
          <div key={j.id} className="searchp__item">
            <div style={{ fontWeight: 700 }}>{j.role} @ {j.company}</div>
            <div style={{ color: 'var(--gray-600)' }}>{j.location} • {j.salary} • {j.type}</div>
            <div className="searchp__badges">
              {j.badges.map(b => <span className="searchp__badge" key={b}>{b}</span>)}
            </div>
            <div className="searchp__item-actions">
              <button className="searchp__btn">Save</button>
              <button className="searchp__btn">Apply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobList


