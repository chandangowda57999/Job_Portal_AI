import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/theme.css'
import './styles/global.css'

/**
 * Application entry point
 * Renders the root App component into the DOM
 * Uses React 18's createRoot API for concurrent features
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

