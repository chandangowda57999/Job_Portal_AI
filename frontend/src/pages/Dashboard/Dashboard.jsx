import React, { useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setRecommendations, setActiveTab } from '../../store/slices/dashboardSlice'
import Header from './components/Header'
import Stats from './components/Stats'
import Recommendations from './components/Recommendations'
import RecTabs from './components/RecTabs'
import './Dashboard.css'

/**
 * Dashboard Page (Container)
 * Home after sign-in: header with search, stats, recommendations, recent applications.
 * Uses Redux for state management.
 */
function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { stats, recommendations, activeTab } = useAppSelector((state) => state.dashboard)

  // Initialize mock data; replace with API later
  const mockRecs = useMemo(() => ([
    { id: 'r1', company: 'Company A', role: 'Frontend Engineer', match: 88, location: 'Remote • US', workMode: 'Remote', level: 'Mid-level', experience: '3-5 years', applications: 42 },
    { id: 'r2', company: 'Company B', role: 'Fullstack Developer', match: 83, location: 'New York, NY', workMode: 'Hybrid', level: 'Senior', experience: '5+ years', applications: 18 },
    { id: 'r3', company: 'Company C', role: 'UI Engineer', match: 80, location: 'San Francisco, CA', workMode: 'Onsite', level: 'Associate', experience: '1-3 years', applications: 27 },
    { id: 'r4', company: 'Company D', role: 'React Developer', match: 79, location: 'Remote • EU', workMode: 'Remote', level: 'Entry', experience: '0-1 year', applications: 12 },
    { id: 'r5', company: 'Company E', role: 'Senior Frontend', match: 86, location: 'Austin, TX', workMode: 'Hybrid', level: 'Senior', experience: '6-8 years', applications: 33 },
    { id: 'r6', company: 'Company F', role: 'Web Engineer', match: 81, location: 'Remote • Global', workMode: 'Remote', level: 'Mid-level', experience: '3-5 years', applications: 50 },
    { id: 'r7', company: 'Company G', role: 'UI/UX Engineer', match: 78, location: 'Seattle, WA', workMode: 'Onsite', level: 'Associate', experience: '1-3 years', applications: 21 },
    { id: 'r8', company: 'Company H', role: 'Design Systems Engineer', match: 82, location: 'Remote • US', workMode: 'Remote', level: 'Mid-level', experience: '3-5 years', applications: 14 },
    { id: 'r9', company: 'Company I', role: 'Platform Frontend', match: 85, location: 'Boston, MA', workMode: 'Hybrid', level: 'Senior', experience: '5-7 years', applications: 19 },
    { id: 'r10', company: 'Company J', role: 'Frontend Architect', match: 90, location: 'Remote • NA', workMode: 'Remote', level: 'Lead', experience: '8+ years', applications: 7 },
    { id: 'r11', company: 'Company K', role: 'React Native Dev', match: 76, location: 'Toronto, CA', workMode: 'Onsite', level: 'Mid-level', experience: '3-5 years', applications: 29 },
    { id: 'r12', company: 'Company L', role: 'SPA Engineer', match: 77, location: 'Chicago, IL', workMode: 'Hybrid', level: 'Associate', experience: '1-3 years', applications: 24 },
  ]), [])

  useEffect(() => {
    if (recommendations.length === 0) {
      dispatch(setRecommendations(mockRecs))
    }
  }, [dispatch, recommendations.length, mockRecs])

  const counts = { Recommended: recommendations.length, Liked: 0, Applied: 0, External: 0, Notes: 0 }

  return (
    <div className="dash">
      <div className="dash__background" aria-hidden="true">
        <div className="dash__bg-layer dash__bg-layer--1"></div>
        <div className="dash__bg-layer dash__bg-layer--2"></div>
        <div className="dash__bg-layer dash__bg-layer--3"></div>
      </div>

      <div className="dash__container">
        <Header />
        <Stats />
        <div className="dash__section dash__section--compact">
          <RecTabs counts={counts} />
        </div>
        <Recommendations onView={(id) => navigate(`/jobs/${id}`)} />
      </div>
    </div>
  )
}

export default Dashboard


