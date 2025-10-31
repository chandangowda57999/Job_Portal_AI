import React, { useState } from 'react'

/**
 * Header
 * Dashboard top bar: logo/title, search box, and profile placeholder.
 *
 * @param {{ onSearch: (q: string) => void }} props
 */
function Header({ onSearch }) {
  const [q, setQ] = useState('')
  return (
    <div className="dash__section">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="gradient-text" style={{ fontWeight: 800, fontSize: '1.25rem' }}>JobPortal AI</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="apps__input"
              placeholder="Search jobs, skills, or location..."
            />
            <button className="button button--primary button--medium" onClick={() => onSearch(q)}>Search</button>
          </div>
        </div>
        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', border: '2px solid var(--gray-200)' }}></div>
        </div>
      </div>
    </div>
  )
}

export default Header


