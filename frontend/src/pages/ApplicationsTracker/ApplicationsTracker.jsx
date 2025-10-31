import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ApplicationsTracker.css'

/**
 * Applications Tracker Page
 * Themed, filterable list with pipeline overview per WIREFRAMES.md
 */
function ApplicationsTracker() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ role: 'All', company: 'All', status: 'All' })
  const [sort, setSort] = useState('Recent')

  // Mock applications; replace with API
  const applications = useMemo(() => ([
    { id: 'a1', role: 'Frontend Engineer', company: 'Acme Corp', appliedAt: 'Oct 20, 2025', status: 'Screening', jobId: '123' },
    { id: 'a2', role: 'Senior UI Engineer', company: 'Globex', appliedAt: 'Oct 18, 2025', status: 'Interview', jobId: '201' },
    { id: 'a3', role: 'Fullstack Developer', company: 'Initech', appliedAt: 'Oct 10, 2025', status: 'Applied', jobId: '301' },
    { id: 'a4', role: 'React Developer', company: 'Umbrella', appliedAt: 'Oct 05, 2025', status: 'Offer', jobId: '401' },
  ]), [])

  const companies = useMemo(() => ['All', ...Array.from(new Set(applications.map(a => a.company)))], [applications])
  const roles = useMemo(() => ['All', ...Array.from(new Set(applications.map(a => a.role)))], [applications])

  const filtered = applications
    .filter(a => (filters.company === 'All' ? true : a.company === filters.company))
    .filter(a => (filters.role === 'All' ? true : a.role === filters.role))
    .filter(a => (filters.status === 'All' ? true : a.status === filters.status))
    .filter(a => (query.trim() ? (a.role + ' ' + a.company).toLowerCase().includes(query.toLowerCase()) : true))
    .sort((a, b) => (sort === 'Recent' ? 0 : a.company.localeCompare(b.company)))

  const pipeline = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired']

  const statusIndex = (s) => pipeline.indexOf(s)

  return (
    <div className="apps">
      {/* Background */}
      <div className="apps__background" aria-hidden="true">
        <div className="apps__background-layer apps__background-layer--1"></div>
        <div className="apps__background-layer apps__background-layer--2"></div>
        <div className="apps__background-layer apps__background-layer--3"></div>
      </div>

      <div className="apps__container">
        <div className="apps__header">
          <h1 className="gradient-text">Applications</h1>
          <p className="apps__subtitle">Track and manage your job applications</p>
        </div>

        <div className="apps__controls card">
          <div className="apps__search">
            <input
              className="apps__input"
              placeholder="Search roles or companies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="apps__filters">
            <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select value={filters.company} onChange={(e) => setFilters({ ...filters, company: e.target.value })}>
              {companies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              {['All', ...pipeline].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {['Recent', 'Company A→Z'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="apps__pipeline card">
          <div className="apps__stages">
            {pipeline.map((stage) => (
              <div key={stage} className="apps__stage">
                <div className="apps__stage-name">{stage}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="apps__list">
          {filtered.map((a) => (
            <div key={a.id} className="apps__item card hover-lift">
              <div className="apps__item-main">
                <div className="apps__item-title">{a.role}</div>
                <div className="apps__item-sub">{a.company} • Applied: {a.appliedAt}</div>
                <div className="apps__item-status">
                  <div className="apps__progress">
                    <div className="apps__progress-fill" style={{ width: `${((statusIndex(a.status) + 1) / pipeline.length) * 100}%` }}></div>
                  </div>
                  <span className="apps__status-badge">{a.status}</span>
                </div>
              </div>
              <div className="apps__item-actions">
                <button className="apps__btn" onClick={() => navigate(`/jobs/${a.jobId}`)}>View Job</button>
                <button className="apps__btn apps__btn--primary">Update Status ▾</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ApplicationsTracker


