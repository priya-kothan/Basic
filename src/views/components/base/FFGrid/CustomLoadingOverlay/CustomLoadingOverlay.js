import React from 'react'
// import CircularProgress from '@material-ui/core/CircularProgress'

import './CustomLoadingOverlay.css'

const CustomLoadingOverlay = () => {
  return (
    <div className="custom-loading-overlay">
      {/* <CircularProgress /> */}
      <span>Please wait while your records are loading</span>
    </div>
  )
}

export default CustomLoadingOverlay
