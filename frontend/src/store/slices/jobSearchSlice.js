import { createSlice } from '@reduxjs/toolkit'

/**
 * Job Search Slice
 * Manages job search state including query, filters, results, and pagination
 */

const initialState = {
  query: '',
  filters: {
    location: 'Any',
    type: 'Any',
    experience: 'Any',
    salary: 'Any',
  },
  jobs: [],
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
}

const jobSearchSlice = createSlice({
  name: 'jobSearch',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setJobs: (state, action) => {
      state.jobs = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    resetSearch: (state) => {
      state.query = ''
      state.filters = initialState.filters
      state.page = 1
      state.error = null
    },
  },
})

export const {
  setQuery,
  setFilters,
  setJobs,
  setPage,
  setTotalPages,
  setLoading,
  setError,
  resetSearch,
} = jobSearchSlice.actions

export default jobSearchSlice.reducer

