import React from 'react'

/**
 * Pagination
 * Simple pager with previous/next and numeric buttons.
 *
 * @param {{ page: number, pages: number, onChange: (n: number) => void }} props
 */
function Pagination({ page, pages, onChange }) {
  const items = Array.from({ length: pages }, (_, i) => i + 1)
  return (
    <div className="searchp__section" style={{ paddingTop: 0 }}>
      <div className="searchp__pager">
        <button className="searchp__btn" disabled={page === 1} onClick={() => onChange(page - 1)}>«</button>
        {items.map(n => (
          <button key={n} className="searchp__btn" style={{ background: n === page ? 'var(--primary-500)' : undefined, color: n === page ? 'white' : undefined }} onClick={() => onChange(n)}>{n}</button>
        ))}
        <button className="searchp__btn" disabled={page === pages} onClick={() => onChange(page + 1)}>»</button>
      </div>
    </div>
  )
}

export default Pagination


