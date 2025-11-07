import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  setStats,
  setRecommendations,
  setRecentApplications,
  setActiveTab,
  setLoading,
  setError,
  clearError,
  updateLastUpdated,
} from '../../store/slices/dashboardSlice'
import { fetchDashboardData } from '../../services/dashboardService'
import Header from './components/Header'
import Stats from './components/Stats'
import Recommendations from './components/Recommendations'
import RecentApplications from './components/RecentApplications'
import RecTabs from './components/RecTabs'
import './Dashboard.css'

/**
 * Dashboard Page (Container)
 * Home after sign-in: header with search, stats, recommendations, recent applications.
 * Uses Redux for state management and fetches real data from backend API.
 */
function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    stats,
    recommendations,
    recentApplications,
    activeTab,
    loading,
    error,
    filters,
    searchQuery,
  } = useAppSelector((state) => state.dashboard)

  // Get user ID from auth state (adjust based on your auth implementation)
  const userId = useAppSelector((state) => state.auth?.user?.id) || 1

  // Fetch dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        dispatch(setLoading(true))
        dispatch(clearError())

        const dashboardData = await fetchDashboardData(userId)

        dispatch(setStats(dashboardData.stats))
        dispatch(setRecommendations(dashboardData.recommendations))
        dispatch(setRecentApplications([])) // TODO: Fetch from applications API when available
        dispatch(updateLastUpdated())
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        dispatch(
          setError(
            err.message || 'Failed to load dashboard data. Please try again later.'
          )
        )
      } finally {
        dispatch(setLoading(false))
      }
    }

    loadDashboardData()
  }, [dispatch, userId])

  // Filter recommendations based on active filters and search query
  const filteredRecommendations = useMemo(() => {
    let filtered = [...recommendations]

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.company.toLowerCase().includes(query) ||
          job.role.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
      )
    }

    // Apply filters
    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.workMode) {
      filtered = filtered.filter(
        (job) => job.workMode.toLowerCase() === filters.workMode.toLowerCase()
      )
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter(
        (job) =>
          job.level.toLowerCase() === filters.experienceLevel.toLowerCase()
      )
    }

    if (filters.jobType) {
      filtered = filtered.filter(
        (job) => job.jobType === filters.jobType
      )
    }

    return filtered
  }, [recommendations, searchQuery, filters])

  // Get counts for tabs
  const counts = useMemo(() => {
    const applied = recentApplications.length
    const saved = recommendations.filter((job) => job.saved).length
    return {
      Recommended: filteredRecommendations.length,
      Liked: 0, // TODO: Implement liked jobs
      Applied: applied,
      External: 0, // TODO: Implement external applications
      Notes: 0, // TODO: Implement notes
    }
  }, [filteredRecommendations, recentApplications, recommendations])

  // Handle job view navigation
  const handleViewJob = (id) => {
    navigate(`/jobs/${id}`)
  }

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Recommended':
        return (
          <Recommendations
            recommendations={filteredRecommendations}
            onView={handleViewJob}
            loading={loading}
          />
        )
      case 'Applied':
        return (
          <RecentApplications
            items={recentApplications}
            onViewJob={handleViewJob}
          />
        )
      default:
        return (
          <div className="dash__section">
            <p>Content for {activeTab} tab coming soon...</p>
          </div>
        )
    }
  }

  return (
    <div className="dash">
      <div className="dash__background" aria-hidden="true">
        <div className="dash__bg-layer dash__bg-layer--1"></div>
        <div className="dash__bg-layer dash__bg-layer--2"></div>
        <div className="dash__bg-layer dash__bg-layer--3"></div>
      </div>

      <div className="dash__container">
        <Header />
        <Stats loading={loading} />

        {/* Error Message */}
        {error && (
          <div className="dash__error" role="alert">
            <span className="dash__error-icon">⚠️</span>
            <span className="dash__error-message">{error}</span>
            <button
              className="dash__error-close"
              onClick={() => dispatch(clearError())}
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        <div className="dash__section dash__section--compact">
          <RecTabs counts={counts} />
        </div>

        {loading && filteredRecommendations.length === 0 ? (
          <div className="dash__loading">
            <div className="dash__loading-spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : filteredRecommendations.length === 0 && !loading ? (
          <div className="dash__empty">
            <p>No jobs found matching your criteria.</p>
            <button
              className="dash__btn"
              onClick={() => {
                dispatch(setSearchQuery(''))
                dispatch(clearFilters())
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  )
}

export default Dashboard


