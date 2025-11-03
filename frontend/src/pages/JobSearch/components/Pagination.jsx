import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setPage } from '../../../store/slices/jobSearchSlice'

/**
 * Pagination
 * Simple pager with previous/next and numeric buttons.
 * Uses Redux for page state.
 */
function Pagination() {
  const dispatch = useAppDispatch()
  const { page, totalPages } = useAppSelector((state) => state.jobSearch)
  const items = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="searchp__section" style={{ paddingTop: 0 }}>
      <div className="searchp__pager">
        <button className="searchp__btn" disabled={page === 1} onClick={() => dispatch(setPage(page - 1))}>«</button>
        {items.map(n => (
          <button
            key={n}
            className="searchp__btn"
            style={{ background: n === page ? 'var(--primary-500)' : undefined, color: n === page ? 'white' : undefined }}
            onClick={() => dispatch(setPage(n))}
          >
            {n}
          </button>
        ))}
        <button className="searchp__btn" disabled={page === totalPages} onClick={() => dispatch(setPage(page + 1))}>»</button>
      </div>
    </div>
  )
}

export default Pagination


