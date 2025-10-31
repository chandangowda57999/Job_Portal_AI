import React from 'react'

/**
 * ResumeMatch
 * Shows explainable factor bars for the resume/job match.
 *
 * @param {{ factors: {label: string, weight: number, score: number}[] }} props
 */
function ResumeMatch({ factors }) {
  return (
    <div className="jobdetail__card card">
      <div className="jobdetail__aside-title">Resume Match Breakdown</div>
      <div className="jobdetail__factors">
        {factors.map((f) => {
          const pct = Math.round(f.score * 100)
          return (
            <div key={f.label} className="jobdetail__factor">
              <div className="jobdetail__factor-row">
                <span>{f.label}</span>
                <span className="jobdetail__factor-score">{pct}%</span>
              </div>
              <div className="jobdetail__bar">
                <div className="jobdetail__bar-fill" style={{ width: `${pct}%` }}></div>
              </div>
            </div>
          )
        })}
      </div>
      <button className="jobdetail__improve">Improve fit</button>
    </div>
  )
}

export default ResumeMatch


