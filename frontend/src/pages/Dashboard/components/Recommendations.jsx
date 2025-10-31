import React from 'react'

/**
 * Recommendations
 * Grid of recommended jobs with fit badge and quick actions.
 *
 * @param {{ items: {id: string, company: string, role: string, match: number}[], onView: (id: string) => void }} props
 */
function Recommendations({ items, onView }) {
  return (
    <div className="dash__section dash__section--compact">
      <div className="dash__cards dash__cards--stack" role="list">
        {items.map((c) => (
          <div key={c.id} className="dash__card hover-lift" role="listitem">
            <div style={{ fontWeight: 700 }}>{c.company}</div>
            <div>{c.role}</div>
            <div className="dash__meta">
              <span>{c.location}</span>
              <span>•</span>
              <span>{c.workMode}</span>
              <span>•</span>
              <span>{c.level}</span>
              <span>•</span>
              <span>{c.experience}</span>
            </div>
            <div className="dash__tags">
              <span className="dash__tag">Applied: {c.applications}</span>
              <span className="dash__tag dash__tag--fit">Fit: {c.match}%</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="dash__btn" onClick={() => onView(c.id)}>View</button>
              <button className="dash__btn">Save</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Recommendations


