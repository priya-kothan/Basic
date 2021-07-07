import React from 'react'

import PermPhoneMsgIcon from '@material-ui/icons/PermPhoneMsg'
import FontDownloadIcon from '@material-ui/icons/FontDownload'
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes'
import AssignmentIcon from '@material-ui/icons/Assignment'
import AttachmentIcon from '@material-ui/icons/Attachment'
import EmailIcon from '@material-ui/icons/Email'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import FFAvatar from '../../../base/FFAvatar/FFAvatar'

const TimeLineItems = ({ title, datasource }) => {
  if (!datasource ?? datasource == null) return null
  return (
    datasource &&
    datasource.map((item, index) => {
      const {
        Name,
        CallTimestamp,
        CallDirection,
        CallDuration,
        CalledPhoneNo,
        EmailCc,
        EmailTimestamp,
        EmailTo,
        SubjectLine,
        PostalMethod,
        PostedAddress,
        AttachmentType,
        OriginalFileName,
        CreatedOn,
        TaskTimestamp,
      } = item

      function getFieldProperties(Name) {
        switch (Name) {
          case 'Phone':
            return <PermPhoneMsgIcon />
          case 'Letter':
            return <AssignmentIcon />
          case 'Email':
            return <EmailIcon />
          case 'Note':
            return <SpeakerNotesIcon />
          case 'Task':
            return <PlaylistAddCheckIcon />
          case 'Attachment':
            return <AttachmentIcon />
          default:
            return <AssignmentIcon />
        }
      }

      return (
        Name && (
          <div className="item-container">
            <div className="item-avatar">{getFieldProperties(Name)}</div>
            <div className="item-body">
              {/* <div className="item-content item__timestamp">
                {CallTimestamp ?? EmailTimestamp}
              </div>
              <div className="item-Subtitle">
                {title == 'All' ? Name && Name : title}
              </div> */}
              <div className="item-content">
                <span>
                  {(CallDirection && `Direction : ${CallDirection}`) ??
                    (PostalMethod && `Postal Method : ${PostalMethod}`) ??
                    (EmailCc && `EmailCc : ${EmailCc}`) ??
                    (AttachmentType && `Attachment Type : ${AttachmentType}`) ??
                    (TaskTimestamp && `TaskTimeStamp : ${TaskTimestamp}`)}
                </span>
              </div>
              <div className="item-content">
                {(CallDuration && `Duration : ${CallDuration}`) ??
                  (SubjectLine && `Subject Line : ${SubjectLine}`) ??
                  (EmailTo && `EmailTo : ${EmailTo}`) ??
                  (OriginalFileName &&
                    `Original FileName : ${OriginalFileName}`)}
              </div>
              <div className="item-content">
                {CalledPhoneNo ??
                  (PostedAddress && `Posted Address : ${PostedAddress}`) ??
                  (CreatedOn && `Created On : ${CreatedOn}`)}
              </div>
            </div>
          </div>
        )
      )
    })
  )
}

export default React.memo(TimeLineItems)
