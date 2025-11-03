import { createSlice } from '@reduxjs/toolkit'

/**
 * Auth Slice
 * Manages authentication state, user data, and login/signup form state
 */

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  // Sign in form state
  signInForm: {
    email: '',
    password: '',
    rememberMe: false,
    showPassword: false,
    errors: {},
    generalError: '',
    isLoading: false,
    hoveredElement: null,
  },
  // Sign up form state
  signUpForm: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    errors: {},
    generalError: '',
    isLoading: false,
    hovered: null,
  },
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    // Sign in form actions
    updateSignInField: (state, action) => {
      const { field, value } = action.payload
      state.signInForm[field] = value
      if (state.signInForm.errors[field]) {
        state.signInForm.errors[field] = ''
      }
      if (state.signInForm.generalError) {
        state.signInForm.generalError = ''
      }
    },
    setSignInErrors: (state, action) => {
      state.signInForm.errors = action.payload
    },
    setSignInGeneralError: (state, action) => {
      state.signInForm.generalError = action.payload
    },
    setSignInLoading: (state, action) => {
      state.signInForm.isLoading = action.payload
    },
    resetSignInForm: (state) => {
      state.signInForm = initialState.signInForm
    },
    // Sign up form actions
    updateSignUpField: (state, action) => {
      const { field, value } = action.payload
      state.signUpForm[field] = value
      if (state.signUpForm.errors[field]) {
        state.signUpForm.errors[field] = ''
      }
      if (state.signUpForm.generalError) {
        state.signUpForm.generalError = ''
      }
    },
    setSignUpErrors: (state, action) => {
      state.signUpForm.errors = action.payload
    },
    setSignUpGeneralError: (state, action) => {
      state.signUpForm.generalError = action.payload
    },
    setSignUpLoading: (state, action) => {
      state.signUpForm.isLoading = action.payload
    },
    resetSignUpForm: (state) => {
      state.signUpForm = initialState.signUpForm
    },
  },
})

export const {
  setUser,
  setToken,
  logout,
  updateSignInField,
  setSignInErrors,
  setSignInGeneralError,
  setSignInLoading,
  resetSignInForm,
  updateSignUpField,
  setSignUpErrors,
  setSignUpGeneralError,
  setSignUpLoading,
  resetSignUpForm,
} = authSlice.actions

export default authSlice.reducer

