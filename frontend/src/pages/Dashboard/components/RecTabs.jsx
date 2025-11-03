import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setActiveTab } from '../../../store/slices/dashboardSlice'

/**
 * RecTabs
 * Tab bar for job recommendation views with counters.
 * Uses Redux for active tab state.
 *
 * @param {{ counts: { Recommended: number, Liked: number, Applied: number, External: number, Notes: number } }} props
 */
function RecTabs({ counts }) {
  const dispatch = useAppDispatch()
  const { activeTab } = useAppSelector((state) => state.dashboard)
  const tabs = ['Recommended', 'Liked', 'Applied', 'External', 'Notes']

  return (
    <div className="rectabs" role="tablist" aria-label="Job recommendation views">
      {tabs.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={activeTab === t}
          className={`rectabs__tab ${activeTab === t ? 'rectabs__tab--active' : ''}`}
          onClick={() => dispatch(setActiveTab(t))}
        >
          <span className="rectabs__label">{t}</span>
          <span className="rectabs__count">{counts[t] ?? 0}</span>
        </button>
      ))}
    </div>
  )
}

export default RecTabs


