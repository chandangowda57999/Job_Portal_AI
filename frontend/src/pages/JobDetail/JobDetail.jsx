import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import JobHeader from './components/JobHeader'
import JobSections from './components/JobSections'
import ResumeMatch from './components/ResumeMatch'
import CompanyAbout from './components/CompanyAbout'
import SimilarJobs from './components/SimilarJobs'
import './JobDetail.css'

/**
 * Job Detail Page
 * Themed to match SignIn page visuals. Shows job info, company, match score,
 * actions, description, keywords, and explainable resume match breakdown.
 */
/**
 * JobDetail Page (Container)
 * Orchestrates subcomponents; currently uses mock data.
 * Replace mock with real API integration in a data-fetch effect.
 */
function JobDetail() {
  const navigate = useNavigate()
  const { jobId } = useParams()

  // Mock data for demonstration; replace with API fetch later
  const job = useMemo(() => ({
    id: jobId || '123',
    role: 'Senior Frontend Engineer',
    company: {
      name: 'Acme Corp',
      logoUrl: 'https://via.placeholder.com/64x64.png?text=A',
    },
    location: 'Remote • US',
    compensation: '$150k–$190k + equity',
    type: 'Full-time',
    postedAt: '2 days ago',
    keywords: ['React', 'TypeScript', 'GraphQL', 'Vite', 'Testing', 'Leadership'],
    description:
      'We are looking for a Senior Frontend Engineer to build delightful user experiences. You will work closely with design and product to ship high-impact features with strong attention to performance, accessibility, and quality.',
    requirements: [
      '5+ years building modern web applications',
      'Expertise with React and TypeScript',
      'Experience with testing frameworks (Jest, Testing Library)',
      'Strong understanding of accessibility and performance',
    ],
    companyInfo:
      'Acme Corp builds AI-powered tools for job seekers and recruiters with a focus on explainable recommendations and delightful UX.',
    similarJobs: [
      { id: '201', title: 'Staff Frontend Engineer', company: 'Globex', match: 82 },
      { id: '202', title: 'Senior UI Engineer', company: 'Initech', match: 79 },
    ],
    matchScore: 88,
    matchFactors: [
      { label: 'React', weight: 0.25, score: 1 },
      { label: 'TypeScript', weight: 0.2, score: 0.9 },
      { label: 'GraphQL', weight: 0.15, score: 0.8 },
      { label: 'Testing', weight: 0.15, score: 0.85 },
      { label: 'Accessibility', weight: 0.1, score: 0.9 },
      { label: 'Leadership', weight: 0.15, score: 0.6 },
    ],
    saved: false,
  }), [jobId])

  const onBack = () => navigate('/dashboard')
  const onApply = () => alert('Apply flow coming soon')
  const onSave = () => alert('Saved!')

  return (
    <div className="jobdetail">
      {/* Animated gradient background layers like SignIn */}
      <div className="jobdetail__background" aria-hidden="true">
        <div className="jobdetail__background-layer jobdetail__background-layer--1"></div>
        <div className="jobdetail__background-layer jobdetail__background-layer--2"></div>
        <div className="jobdetail__background-layer jobdetail__background-layer--3"></div>
      </div>

      <div className="jobdetail__container">
        {/* Header */}
        <JobHeader
          role={job.role}
          company={job.company}
          location={job.location}
          compensation={job.compensation}
          type={job.type}
          postedAt={job.postedAt}
          matchScore={job.matchScore}
          onBack={onBack}
          onSave={onSave}
          onApply={onApply}
        />

        {/* Body */}
        <div className="jobdetail__body">
          {/* Left: Description & requirements */}
          <JobSections description={job.description} requirements={job.requirements} keywords={job.keywords} />

          {/* Right: Match explainability & company */}
          <aside className="jobdetail__aside">
            <ResumeMatch factors={job.matchFactors} />
            <CompanyAbout companyName={job.company.name} text={job.companyInfo} />
            <SimilarJobs items={job.similarJobs} />
          </aside>
        </div>
      </div>
    </div>
  )
}

export default JobDetail


