import React, { useState, forwardRef, useImperativeHandle } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

import './FFToast.css'

const FFToast = (props, ref) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState(false)
  const [StatusMessage, setStatusMessage] = useState('success')
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  useImperativeHandle(ref, () => ({
    setToastMessage(messageText, status) {
      setOpen(true)
      setStatusMessage(status)
      setMessage(messageText)
    },
  }))

  return (
    <Snackbar
      className="toast-root"
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={StatusMessage}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default forwardRef(FFToast)
