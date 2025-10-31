import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn/SignIn'
import SignUp from './pages/SignUp/SignUp'
import JobDetail from './pages/JobDetail/JobDetail'
import ApplicationsTracker from './pages/ApplicationsTracker/ApplicationsTracker'
import Dashboard from './pages/Dashboard/Dashboard'
import JobSearch from './pages/JobSearch/JobSearch'
import './styles/App.css'

/**
 * Main Application Component
 * Configures routing and provides the application structure
 * 
 * @returns {JSX.Element} The main application component with routing
 */
function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Sign In Route - Main authentication page */}
          <Route path="/signin" element={<SignIn />} />
          {/* Sign Up Route */}
          <Route path="/signup" element={<SignUp />} />
          {/* Job Detail */}
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          {/* Applications Tracker */}
          <Route path="/applications" element={<ApplicationsTracker />} />
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Job Search */}
          <Route path="/search" element={<JobSearch />} />
          
          {/* Default route redirects to sign in */}
          <Route path="/" element={<Navigate to="/signin" replace />} />
          
          {/* OAuth Callback Routes - Handle OAuth redirects */}
          <Route path="/auth/google/callback" element={<div>Processing Google authentication...</div>} />
          <Route path="/auth/linkedin/callback" element={<div>Processing LinkedIn authentication...</div>} />
          
          {/* 404 Not Found Route */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

