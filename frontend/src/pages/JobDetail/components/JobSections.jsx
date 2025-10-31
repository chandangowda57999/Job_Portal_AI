import React from 'react'

/**
 * JobSections
 * Main content area showing description, requirements and JD keywords.
 * Presentational; does not manage internal state.
 *
 * @param {{ description: string, requirements: string[], keywords: string[] }} props
 */
function JobSections({ description, requirements, keywords }) {
  return (
    <div className="jobdetail__main card">
      <div className="jobdetail__tabs">
        <button className="jobdetail__tab jobdetail__tab--active">Description</button>
        <button className="jobdetail__tab" disabled>Requirements</button>
        <button className="jobdetail__tab" disabled>Company</button>
        <button className="jobdetail__tab" disabled>Similar Jobs</button>
      </div>

      <div className="jobdetail__section">
        <h3>About the role</h3>
        <p className="jobdetail__text">{description}</p>
      </div>

      <div className="jobdetail__section">
        <h3>Key requirements</h3>
        <ul className="jobdetail__list">
          {requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
      </div>

      <div className="jobdetail__section">
        <h3>Keywords from JD</h3>
        <div className="jobdetail__keywords">
          {keywords.map((kw) => (
            <span key={kw} className="jobdetail__keyword">{kw}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default JobSections


