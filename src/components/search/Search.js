import React, { useState } from 'react'
import '../css/search.css'

function Search({ onSearchData }) {
  const [keyword, setKeyword] = useState('')
  return (
    <table className="filter-table">
      <thead>
        <tr>
          <th colSpan="2">Bộ lọc tìm kiếm</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Tổng cộng</td>
          <td className="total-count">6</td>
        </tr>
        <tr>
          <td>Tìm kiếm</td>
          <td>
            <input
              type="text"
              className="search-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button onClick={() => onSearchData(keyword)} className="submit-btn">
              Submit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default Search
