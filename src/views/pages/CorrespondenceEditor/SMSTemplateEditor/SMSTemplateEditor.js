import React from 'react'

import FFTextBox from '../../../components/base/FFTextBox/FFTextBox'
import useEditorContext from '../useEditorContext'

const HTMLTemplateEditor = () => {
  const { editorData, editorDispatcher } = useEditorContext()

  function onValueChageHandler(event, propertyName) {
    if (!propertyName) return null

    return editorDispatcher({
      type: 'UPDATE_EDITORPROPERTIES',
      editorProperties: { [propertyName.id]: propertyName.value },
    })
  }

  const { TemplateType } = editorData.editorProperties

  return (
    <>
      <FFTextBox
        id="template-to"
        Field={{
          FieldValue: 'To',
          FieldLabel: 'To:',
          IsEnableHelpText: false,
          Placeholder: 'Recipients',
        }}
        value={editorData.editorProperties?.To}
        onChangeHandler={onValueChageHandler}
      />
      <FFTextBox
        id="template-message"
        Field={{
          FieldValue: 'TemplateContent',
          FieldLabel: `${TemplateType || ''} Message`,
          IsEnableHelpText: false,
          Placeholder: `Type the ${TemplateType || ''} Message here`,
          Multiline: true,
          Rows: 3,
        }}
        value={editorData.editorProperties?.TemplateContent}
        onChangeHandler={onValueChageHandler}
      />
    </>
  )
}

export default HTMLTemplateEditor
