import React from 'react'

/**
 * Recommendations
 * Grid of recommended jobs with fit badge and quick actions.
 * Displays jobs passed as props (filtered by parent component).
 *
 * @param {{ recommendations: Array, onView: (id: string) => void, loading?: boolean }} props
 */
function Recommendations({ recommendations = [], onView, loading = false }) {
  if (loading && recommendations.length === 0) {
    return (
      <div className="dash__section dash__section--compact">
        <div className="dash__cards dash__cards--stack" role="list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="dash__card dash__card--loading" role="listitem">
              <div className="dash__card-skeleton"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="dash__section dash__section--compact">
        <div className="dash__empty-state">
          <p>No recommendations available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dash__section dash__section--compact">
      <div className="dash__cards dash__cards--stack" role="list">
        {recommendations.map((c) => (
          <div key={c.id} className="dash__card hover-lift" role="listitem">
            <div className="dash__card-header">
              <div style={{ fontWeight: 700 }}>{c.company}</div>
              {c.match && (
                <span className="dash__tag dash__tag--fit">Fit: {c.match}%</span>
              )}
            </div>
            <div className="dash__card-title">{c.role}</div>
            <div className="dash__meta">
              <span>{c.location}</span>
              {c.workMode && (
                <>
                  <span>•</span>
                  <span>{c.workMode}</span>
                </>
              )}
              {c.level && (
                <>
                  <span>•</span>
                  <span>{c.level}</span>
                </>
              )}
              {c.experience && (
                <>
                  <span>•</span>
                  <span>{c.experience}</span>
                </>
              )}
            </div>
            <div className="dash__tags">
              {c.applications !== undefined && (
                <span className="dash__tag">Applied: {c.applications}</span>
              )}
              {c.salaryMin && c.salaryMax && (
                <span className="dash__tag">
                  {c.salaryCurrency} {c.salaryMin.toLocaleString()} - {c.salaryMax.toLocaleString()}
                </span>
              )}
              {c.jobType && (
                <span className="dash__tag">{c.jobType}</span>
              )}
            </div>
            <div className="dash__card-actions">
              <button className="dash__btn" onClick={() => onView(c.id)}>
                View
              </button>
              <button className="dash__btn dash__btn--secondary">Save</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Recommendations


