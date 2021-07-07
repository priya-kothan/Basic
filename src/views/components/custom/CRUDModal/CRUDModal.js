import React from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@material-ui/core'

import './CRUDModal.css'

function Header({ children, CSSClass }) {
  return <div className={`addmodal__header ${CSSClass}`}>{children}</div>
}

function Title({ children }) {
  return <span className="addmodal__title">{children}</span>
}

function Close({ children, onClick }) {
  return (
    <span className="addmodal__close">
      <IconButton aria-label="Close" disableRipple onClick={onClick}>
        {children}
      </IconButton>
    </span>
  )
}

function Content({ children, CSSClass }) {
  return <div className={`addmodal__content ${CSSClass}`}>{children}</div>
}

function Footer({ children }) {
  return <div className="addmodal__footer">{children}</div>
}
const CRUDModal = ({ open, children, width, top, right, bottom }) => {
  if (!open) return null

  return (
    <div
      id="EntityPopup"
      className="addmodal"
      style={{
        width: width || '420px',
        top: top || '64px',
        bottom: bottom || '0',
        right: right || '0',
      }}
    >
      {children}
    </div>
  )
}

CRUDModal.defaultProps = {
  open: true,
  onClose: () => {},
  onSuccess: () => {},
  modalData: () => {},
}

CRUDModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  modalData: PropTypes.arrayOf(PropTypes.object),
}

CRUDModal.Header = Header
CRUDModal.Title = Title
CRUDModal.Close = Close
CRUDModal.Content = Content
CRUDModal.Footer = Footer

export default CRUDModal
