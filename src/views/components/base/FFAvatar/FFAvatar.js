import React from 'react'
import Avatar from '@material-ui/core/Avatar'

import './FFAvatar.css'

const FFAvatar = ({
  imgSource = '/broken-image.jpg',
  altText = '',
  className,
}) => {
  return (
    <div className="ffavatar">
      <Avatar
        // className="ffavatar__avatar-image"
        className={`ffavatar__avatar-image ${className}`}
        id="userIcon"
        alt={altText}
        src={imgSource}
      />
    </div>
  )
}

export default FFAvatar
