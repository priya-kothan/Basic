import React from 'react'
import usePageTitle from '../../components/hooks/usePageTitle'

import FileManager from '../../components/custom/FileManager/FileManager'
import './FileManagerView.css'

const FileManagerView = () => {
  const { setPageTitle } = usePageTitle()
  setPageTitle('File Manager')

  return (
    <div className="filemanager-view">
      <FileManager
        entityName="AppResource"
        idField="id"
        parentIDField="ParentID"
        folderField="AppResourceType"
        folderFieldValue="Folder"
      />
    </div>
  )
}

export default FileManagerView
