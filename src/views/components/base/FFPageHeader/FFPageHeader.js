/*eslint-disable */
import React, { useState, forwardRef, useImperativeHandle } from 'react'

import './FFPageHeader.css'

const FFPageHeader = (props, ref = {}) => {
  const [title, setTitle] = useState('')

  useImperativeHandle(ref, () => ({
    setPageTitle(title) {
      setTitle(title)
    },
  }))

  return (
    <div className="FFPageHeader-root">
      <span className="page-title">{title}</span>
    </div>
  )
}

export default forwardRef(FFPageHeader)
