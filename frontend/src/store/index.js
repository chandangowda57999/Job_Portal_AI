import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import dashboardReducer from './slices/dashboardSlice'
import applicationsReducer from './slices/applicationsSlice'
import jobSearchReducer from './slices/jobSearchSlice'
import jobDetailReducer from './slices/jobDetailSlice'

/**
 * Redux Store Configuration
 * 
 * Centralized state management for the entire application.
 * Configured Redux store using @reduxjs/toolkit with all application slices.
 * 
 * @type {Object}
 * @property {Function} dispatch - Store dispatch function
 * @property {Function} getState - Store state getter function
 * @property {Function} subscribe - Store subscription function
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    applications: applicationsReducer,
    jobSearch: jobSearchReducer,
    jobDetail: jobDetailReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
})

/**
 * Type definitions for TypeScript support (if project is migrated to TS)
 * 
 * These are commented out for JavaScript projects.
 * Uncomment if converting to TypeScript.
 * 
 * @typedef {Object} RootState
 * @typedef {Function} AppDispatch
 * 
 * // TypeScript equivalents (for reference):
 * // export type RootState = ReturnType<typeof store.getState>
 * // export type AppDispatch = typeof store.dispatch
 */

