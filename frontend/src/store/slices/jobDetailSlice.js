import { createSlice } from '@reduxjs/toolkit'

/**
 * Job Detail Slice
 * Manages state for job detail page including active tab and job data
 */

const initialState = {
  activeTab: 'Description',
  currentJob: null,
  loading: false,
  error: null,
}

const jobDetailSlice = createSlice({
  name: 'jobDetail',
  initialState,
  reducers: {
    /**
     * Sets the active tab in job detail page
     * @param {Object} state - Current state
     * @param {Object} action - Action payload with tab name
     */
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },

    /**
     * Sets the current job data
     * @param {Object} state - Current state
     * @param {Object} action - Action payload with job data
     */
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload
      state.loading = false
      state.error = null
    },

    /**
     * Sets loading state
     * @param {Object} state - Current state
     * @param {Object} action - Action payload with loading boolean
     */
    setLoading: (state, action) => {
      state.loading = action.payload
    },

    /**
     * Sets error state
     * @param {Object} state - Current state
     * @param {Object} action - Action payload with error message
     */
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },

    /**
     * Resets job detail state to initial
     * @param {Object} state - Current state
     */
    resetJobDetail: (state) => {
      state.activeTab = 'Description'
      state.currentJob = null
      state.loading = false
      state.error = null
    },
  },
})

export const { setActiveTab, setCurrentJob, setLoading, setError, resetJobDetail } = jobDetailSlice.actions

export default jobDetailSlice.reducer

