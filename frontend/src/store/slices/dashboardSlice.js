import { createSlice } from '@reduxjs/toolkit'

/**
 * Dashboard Slice
 * Manages dashboard state including stats, recommendations, and active tab
 */

const initialState = {
  stats: [
    { label: 'Matches', value: 0 },
    { label: 'Applied', value: 0 },
    { label: 'Interviews', value: 0 },
    { label: 'Saved', value: 0 },
  ],
  recommendations: [],
  recentApplications: [],
  activeTab: 'Recommended',
  searchQuery: '',
  loading: false,
  error: null,
  lastUpdated: null,
  filters: {
    location: '',
    workMode: '',
    experienceLevel: '',
    jobType: '',
  },
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload
    },
    setRecommendations: (state, action) => {
      state.recommendations = action.payload
    },
    setRecentApplications: (state, action) => {
      state.recentApplications = action.payload
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    updateLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString()
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setStats,
  setRecommendations,
  setRecentApplications,
  setActiveTab,
  setSearchQuery,
  setLoading,
  setError,
  setFilters,
  clearFilters,
  updateLastUpdated,
  clearError,
} = dashboardSlice.actions

export default dashboardSlice.reducer

