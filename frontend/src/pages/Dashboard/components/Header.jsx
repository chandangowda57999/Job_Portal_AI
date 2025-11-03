import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setSearchQuery } from '../../../store/slices/dashboardSlice'

/**
 * Header
 * Dashboard top bar: logo/title, search box, and profile placeholder.
 * Uses Redux for search query state.
 */
function Header() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { searchQuery } = useAppSelector((state) => state.dashboard)

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="dash__section">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="gradient-text" style={{ fontWeight: 800, fontSize: '1.25rem' }}>JobPortal AI</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="apps__input"
              placeholder="Search jobs, skills, or location..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="button button--primary button--medium" onClick={handleSearch}>Search</button>
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


