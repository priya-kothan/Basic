import React from 'react'
import InfoIcon from '@material-ui/icons/Info'
import Tooltip from '@material-ui/core/Tooltip'
import './FFHelpText.css'

const FFHelpText = ({ LongText = '' }) => {
  return (
    <Tooltip
      className="tooltip"
      title={LongText && LongText}
      arrow
      placement="top-start"
    >
      <InfoIcon />
    </Tooltip>
  )
}

export default FFHelpText
