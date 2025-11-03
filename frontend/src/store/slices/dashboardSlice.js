import { createSlice } from '@reduxjs/toolkit'

/**
 * Dashboard Slice
 * Manages dashboard state including stats, recommendations, and active tab
 */

const initialState = {
  stats: [
    { label: 'Matches', value: 24 },
    { label: 'Applied', value: 8 },
    { label: 'Interviews', value: 3 },
    { label: 'Saved', value: 12 },
  ],
  recommendations: [],
  activeTab: 'Recommended',
  searchQuery: '',
  loading: false,
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
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { setStats, setRecommendations, setActiveTab, setSearchQuery, setLoading } =
  dashboardSlice.actions

export default dashboardSlice.reducer

