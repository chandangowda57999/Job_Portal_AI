import React from 'react'

/**
 * Stats
 * Displays quick stats per wireframe (Matches, Applied, Interviews, Saved)
 *
 * @param {{ items: {label: string, value: number}[] }} props
 */
function Stats({ items }) {
  return (
    <div className="dash__row">
      <div className="dash__stats">
        {items.map((s) => (
          <div key={s.label} className="dash__stat">
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.value}</div>
            <div className="dash__stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats


