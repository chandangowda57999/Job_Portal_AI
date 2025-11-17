import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setSearchQuery } from '../../../store/slices/dashboardSlice'
import NavigationBar from '../../../components/NavigationBar/NavigationBar'

/**
 * Header
 * Dashboard top bar with navigation (logo, user, logout) and search box.
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
    <>
      {/* Navigation Bar - Separate div */}
      <div className="dash__section">
        <NavigationBar />
      </div>

      {/* Search Bar - Separate div */}
      <div className="dash__section">
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="apps__input"
            placeholder="Search jobs, skills, or location..."
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1 }}
          />
          <button className="button button--primary button--medium" onClick={handleSearch}>Search</button>
        </div>
      </div>
    </>
  )
}

export default Header


