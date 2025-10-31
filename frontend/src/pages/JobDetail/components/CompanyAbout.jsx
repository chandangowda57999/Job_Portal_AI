import React from 'react'

/**
 * CompanyAbout
 * Brief company description side card.
 *
 * @param {{ companyName: string, text: string }} props
 */
function CompanyAbout({ companyName, text }) {
  return (
    <div className="jobdetail__card card">
      <div className="jobdetail__aside-title">About {companyName}</div>
      <p className="jobdetail__text">{text}</p>
    </div>
  )
}

export default CompanyAbout


