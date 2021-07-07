import React from 'react'
import { Backdrop, CircularProgress } from '@material-ui/core'
import { useIsFetching } from 'react-query'
import './FFBackdrop.css'

const FFBackdrop = (props, ref) => {
  const [open, setOpen] = React.useState(false)
  const isFetching = useIsFetching()
  React.useImperativeHandle(ref, () => ({
    showLoading: (state) => {
      setOpen(state || false)
    },
  }))
  return (
    <Backdrop className="backdrop" open={isFetching || open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
export default React.forwardRef(FFBackdrop)
