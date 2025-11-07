import React from 'react'
import { useAppSelector } from '../../../store/hooks'

/**
 * Stats
 * Displays quick stats per wireframe (Matches, Applied, Interviews, Saved)
 * Uses Redux for stats data.
 */
function Stats({ loading = false }) {
  const { stats } = useAppSelector((state) => state.dashboard)

  if (loading && stats.every((s) => s.value === 0)) {
    return (
      <div className="dash__row">
        <div className="dash__stats">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="dash__stat dash__stat--loading">
              <div className="dash__stat-skeleton dash__stat-skeleton--value"></div>
              <div className="dash__stat-skeleton dash__stat-skeleton--label"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="dash__row">
      <div className="dash__stats">
        {stats.map((s) => (
          <div key={s.label} className="dash__stat">
            <div className="dash__stat-value">{s.value}</div>
            <div className="dash__stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats


