import { createSlice } from '@reduxjs/toolkit'

/**
 * Applications Tracker Slice
 * Manages applications list, filters, and sorting
 */

const initialState = {
  applications: [],
  query: '',
  filters: {
    role: 'All',
    company: 'All',
    status: 'All',
  },
  sort: 'Recent',
  pipeline: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'],
  loading: false,
}

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplications: (state, action) => {
      state.applications = action.payload
    },
    setQuery: (state, action) => {
      state.query = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setSort: (state, action) => {
      state.sort = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    resetFilters: (state) => {
      state.query = ''
      state.filters = initialState.filters
      state.sort = 'Recent'
    },
  },
})

export const { setApplications, setQuery, setFilters, setSort, setLoading, resetFilters } =
  applicationsSlice.actions

export default applicationsSlice.reducer

