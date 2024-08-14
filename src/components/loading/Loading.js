import { CSpinner } from '@coreui/react'
import React from 'react'

function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <CSpinner color="primary" />
    </div>
  )
}

export default Loading