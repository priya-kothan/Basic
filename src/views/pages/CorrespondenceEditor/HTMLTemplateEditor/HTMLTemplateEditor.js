import React from 'react'

import FFRichTextEditor from '../../../components/base/FFRichTextEditor/FFRichTextEditor'
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
      {editorData.editorProperties.TemplateType === 'EMail' && (
        <>
          <FFTextBox
            id="template-cc"
            Field={{
              FieldValue: 'Cc',
              FieldLabel: 'CC:',
              IsEnableHelpText: false,
              Placeholder: 'Recipients',
            }}
            value={editorData.editorProperties?.Cc}
            onChangeHandler={onValueChageHandler}
          />
          <FFTextBox
            id="template-bcc"
            Field={{
              FieldValue: 'Bcc',
              FieldLabel: 'BCC:',
              IsEnableHelpText: false,
              Placeholder: 'Recipients',
            }}
            value={editorData.editorProperties?.Bcc}
            onChangeHandler={onValueChageHandler}
          />
        </>
      )}
      <FFTextBox
        id="template-subject"
        Field={{
          FieldValue: 'Subject',
          FieldLabel: 'Subject:',
          IsEnableHelpText: false,
          Placeholder: 'Type the subject here',
        }}
        value={editorData.editorProperties?.Subject}
        onChangeHandler={onValueChageHandler}
      />
      <FFRichTextEditor
        id="sample-richtexteditor"
        Field={{
          FieldValue: 'TemplateContent',
          Placeholder: 'Enter template text here',
        }}
        // disableToolButtons={['math', 'print']}
        onChangeHandler={onValueChageHandler}
        value={editorData.editorProperties?.TemplateContent}
      />
    </>
  )
}

export default HTMLTemplateEditor
