import React from 'react'

/**
 * SimilarJobs
 * Lists similar jobs with their fit score.
 *
 * @param {{ items: {id: string, title: string, company: string, match: number}[] }} props
 */
function SimilarJobs({ items }) {
  return (
    <div className="jobdetail__card card">
      <div className="jobdetail__aside-title">Similar Jobs</div>
      <ul className="jobdetail__similar">
        {items.map((s) => (
          <li key={s.id} className="hover-lift">
            <div>
              <div className="jobdetail__similar-title">{s.title}</div>
              <div className="jobdetail__similar-sub">{s.company}</div>
            </div>
            <div className="jobdetail__similar-fit">{s.match}%</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SimilarJobs


