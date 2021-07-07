import React from 'react'
import PropTypes from 'prop-types'
import './ImageCell.css'

const ImageCell = ({ value }) => {
  function getimagesrc(filename) {
    const extension = filename.split('.').pop().toLowerCase()
    if (extension === 'jpg' || extension === 'png' || extension === 'jpeg') {
      return filename
    }
    if (extension === 'mp4') {
      return 'https://freeflowstoragedev.blob.core.windows.net/web/CustomUI/images/VideoIcon.png'
    }
    if (extension === 'pdf') {
      return 'https://freeflowstoragedev.blob.core.windows.net/web/CustomUI/images/PDFIcon.png'
    }
    if (extension === 'xml') {
      return 'https://freeflowstoragedev.blob.core.windows.net/web/CustomUI/images/XMLIcon.png'
    }
    if (extension === 'doc' || extension === 'docx') {
      return 'https://freeflowstoragedev.blob.core.windows.net/web/CustomUI/images/DocIcon.png'
    }
    if (extension === 'xlsx' || extension === 'xls') {
      return 'https://freeflowstoragedev.blob.core.windows.net/web/CustomUI/images/ExcelIcon.png'
    }
    return ''
  }

  function FilePopupScreen() {
    const fileExtension = value.replace(/^.*\./, '')
    const element = document.getElementById('EvidenceBox')
    let lightbox = document.getElementById('EvidenceBox')
    let dimmer = document.createElement('div')

    if (element !== null) {
      element.remove()
    }
    const div = document.createElement('div')
    div.id = 'EvidenceBox'
    if (
      fileExtension.toLowerCase() === 'jpg' ||
      fileExtension.toLowerCase() === 'png' ||
      fileExtension.toLowerCase() === 'bmp' ||
      fileExtension.toLowerCase() === 'jpeg'
    ) {
      div.innerHTML =
        '<img class="mediaview" src = ' +
        `${value.replace(' ', '%20')}` +
        ' alt = ""  >'

      document.body.appendChild(div)

      dimmer.style.width = `${window.innerWidth}px`
      dimmer.style.height = `${window.innerHeight}px`
      dimmer.className = 'dimmer'

      dimmer.onclick = function dimmeronclick() {
        document.body.removeChild(this)
        lightbox.style.visibility = 'hidden'
      }

      document.body.appendChild(dimmer)
    } else if (fileExtension.toLowerCase() === 'mp4') {
      div.innerHTML =
        '<video class="mediaview" controls> <source src=' +
        `${value.replace(' ', '%20')}` +
        '></video>'

      document.body.appendChild(div)
      lightbox = document.getElementById('EvidenceBox')
      dimmer = document.createElement('div')

      dimmer.style.width = `${window.innerWidth}px`
      dimmer.style.height = `${window.innerHeight}px`
      dimmer.className = 'dimmer'

      dimmer.onclick = function dimmeronclick() {
        document.body.removeChild(this)
        lightbox.style.visibility = 'hidden'
      }

      document.body.appendChild(dimmer)
    } else {
      return false
    }

    return false
  }

  return (
    <span
      tabIndex="0"
      className="ImageCell-root"
      role="menu"
      onClick={() => {}}
      onKeyDown={FilePopupScreen}
    >
      <img
        src={getimagesrc(value)}
        alt={value}
        // onClick={FilePopupScreen}
      />
    </span>
  )
}

ImageCell.propTypes = {
  value: PropTypes.string,
}

ImageCell.defaultProps = {
  value: '',
}

export default ImageCell
