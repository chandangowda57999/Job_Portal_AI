import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/SignIn/SignIn'
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

