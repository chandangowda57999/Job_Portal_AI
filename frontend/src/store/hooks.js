import { useDispatch, useSelector } from 'react-redux'

/**
 * Redux Hooks Wrappers
 * 
 * Custom hooks that wrap react-redux hooks for consistency and future extensibility.
 * These hooks follow the same pattern as Redux Toolkit's TypeScript recommendations,
 * making it easy to migrate to TypeScript later if needed.
 */

/**
 * Custom useDispatch Hook
 * 
 * Wrapper around react-redux's useDispatch hook.
 * Provides a consistent API and makes it easy to add middleware or
 * additional logic in the future.
 * 
 * @function useAppDispatch
 * @returns {Function} Redux dispatch function for dispatching actions
 * 
 * @example
 * const dispatch = useAppDispatch()
 * dispatch(setUser(userData))
 */
export const useAppDispatch = () => useDispatch()

/**
 * Custom useSelector Hook
 * 
 * Wrapper around react-redux's useSelector hook.
 * Provides a consistent API for selecting state from the Redux store.
 * 
 * @function useAppSelector
 * @param {Function} selector - Selector function that extracts specific state from store
 * @returns {*} Selected state value from the Redux store
 * 
 * @example
 * // Select entire auth state
 * const authState = useAppSelector(state => state.auth)
 * 
 * @example
 * // Select specific property
 * const user = useAppSelector(state => state.auth.user)
 */
export const useAppSelector = (selector) => useSelector(selector)

