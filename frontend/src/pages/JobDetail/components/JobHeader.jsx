import React from 'react'

/**
 * JobHeader
 * Displays the job/company identity, posted meta, match badge and primary actions.
 * This component is presentational and stateless.
 *
 * @param {{
 *   role: string,
 *   company: { name: string, logoUrl: string },
 *   location: string,
 *   compensation: string,
 *   type: string,
 *   postedAt: string,
 *   matchScore: number,
 *   onBack: () => void,
 *   onSave: () => void,
 *   onApply: () => void
 * }} props
 */
function JobHeader({ role, company, location, compensation, type, postedAt, matchScore, onBack, onSave, onApply }) {
  return (
    <div className="jobdetail__header card hover-shine">
      <button className="jobdetail__back" onClick={onBack} aria-label="Back to results">
        <span className="jobdetail__back-icon">←</span>
        <span>Back</span>
      </button>

      <div className="jobdetail__title">
        <img className="jobdetail__logo" src={company.logoUrl} alt={`${company.name} logo`} />
        <div className="jobdetail__meta">
          <div className="jobdetail__company-row">
            <h1 className="jobdetail__role gradient-text">{role}</h1>
            <button className="jobdetail__save interactive" onClick={onSave} aria-label="Save job">★ Save</button>
          </div>
          <div className="jobdetail__company">{company.name}</div>
          <div className="jobdetail__info">
            <span>{location}</span>
            <span>•</span>
            <span>{compensation}</span>
            <span>•</span>
            <span>{type}</span>
            <span>•</span>
            <span>Posted {postedAt}</span>
          </div>
        </div>
        <div className="jobdetail__match">
          <div className="jobdetail__match-circle" aria-label={`Match ${matchScore}%`}>
            <span>{matchScore}%</span>
          </div>
          <div className="jobdetail__match-label">AI Match</div>
        </div>
      </div>

      <div className="jobdetail__actions">
        <button className="button button--primary button--medium" onClick={onApply}>Apply Now</button>
        <button className="jobdetail__secondary">Share</button>
      </div>
    </div>
  )
}

export default JobHeader


