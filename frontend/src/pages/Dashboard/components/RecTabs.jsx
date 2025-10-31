import React from 'react'

/**
 * RecTabs
 * Tab bar for job recommendation views with counters.
 *
 * @param {{
 *  active: string,
 *  counts: { Recommended: number, Liked: number, Applied: number, External: number, Notes: number },
 *  onChange: (key: string) => void
 * }} props
 */
function RecTabs({ active, counts, onChange }) {
  const tabs = ['Recommended', 'Liked', 'Applied', 'External', 'Notes']
  return (
    <div className="rectabs" role="tablist" aria-label="Job recommendation views">
      {tabs.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={active === t}
          className={`rectabs__tab ${active === t ? 'rectabs__tab--active' : ''}`}
          onClick={() => onChange(t)}
        >
          <span className="rectabs__label">{t}</span>
          <span className="rectabs__count">{counts[t] ?? 0}</span>
        </button>
      ))}
    </div>
  )
}

export default RecTabs


