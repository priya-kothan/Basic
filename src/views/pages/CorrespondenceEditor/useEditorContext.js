import React from 'react'

const EditorContext = React.createContext({
  editorData: null,
  editordispatcher: () => null,
})

const useEditorContext = () => {
  const { editorData, editorDispatcher } = React.useContext(EditorContext)

  return {
    EditorProvider: EditorContext.Provider,
    editorData,
    editorDispatcher,
  }
}

export default useEditorContext
