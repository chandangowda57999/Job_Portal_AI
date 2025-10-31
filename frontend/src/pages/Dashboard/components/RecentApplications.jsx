import React from 'react'

/**
 * RecentApplications
 * List of recent applications with status and a link to view job.
 *
 * @param {{ items: {id: string, role: string, company: string, status: string, jobId: string}[], onViewJob: (jobId: string) => void }} props
 */
function RecentApplications({ items, onViewJob }) {
  return (
    <div className="dash__section">
      <div className="dash__section-title">Recent Applications</div>
      <div className="dash__apps">
        {items.map((a) => (
          <div key={a.id} className="dash__app">
            <div>
              <div style={{ fontWeight: 700 }}>{a.role} @ {a.company}</div>
              <div className="dash__app-sub">Status: {a.status}</div>
            </div>
            <div>
              <button className="dash__btn" onClick={() => onViewJob(a.jobId)}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentApplications


