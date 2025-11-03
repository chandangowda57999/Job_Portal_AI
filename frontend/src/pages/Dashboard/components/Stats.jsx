import React from 'react'
import { useAppSelector } from '../../../store/hooks'

/**
 * Stats
 * Displays quick stats per wireframe (Matches, Applied, Interviews, Saved)
 * Uses Redux for stats data.
 */
function Stats() {
  const { stats } = useAppSelector((state) => state.dashboard)

  return (
    <div className="dash__row">
      <div className="dash__stats">
        {stats.map((s) => (
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


