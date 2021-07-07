import React, { createRef } from 'react'
import Chip from '@material-ui/core/Chip'
import Dropzone, { useDropzone } from 'react-dropzone'
import './FFDropZone.css'

export const FFDropZone = ({
  id,
  onChange,
  disabled,
  acceptfile,
  Field,
  ...rest
}) => {
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (files) => onChange(files),
    accept: acceptfile,
  })

  if (disabled) {
    return null
  }

  let dropzoneRef

  return (
    <div>
      <br />
      {/* <Dropzone
            ref={node => {
               dropzoneRef = node
            }}
            onDrop={onChange}>
            {({ getRootProps, getInputProps }) => (
               <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <p>Drag and Drop to add attachment/s</p>
               </div>
            )}
         </Dropzone> */}
      <div className="Dropzone_root">
        <div {...getRootProps()} className="dropzone">
          <input id={id} {...getInputProps()} />
          <p>Drag and Drop to add attachment/s</p>
        </div>
      </div>
      <br />
    </div>
  )
}

export default FFDropZone
