import React from 'react'
import PropTypes from 'prop-types'
import SunEditor from 'suneditor-react'
// import plugins from 'suneditor/src/plugins'

import options from './options.json'
import './suneditor.min.css'
import './FFRichTextEditor.css'

const FFRichTextEditor = ({
  className,
  value,
  Field,
  disableToolButtons,
  onChangeHandler,
}) => {
  const editorRef = React.useRef()

  function injectHTMLSnippets(data) {
    return `<html lang="en"><head></head><body>${data}</body></html>`
  }

  function onChange(content) {
    if (onChangeHandler)
      onChangeHandler(null, {
        id: Field?.FieldValue,
        value: injectHTMLSnippets(content),
      })
  }

  function onToolButtonClickHandler(event) {
    if (event.target.getAttribute('data-command') === 'fullScreen')
      document.getElementsByClassName('richtexteditor')[0].style.zIndex =
        'unset'
  }

  function onLoadHandler() {
    const toolButtons = document.querySelectorAll('.se-btn-tray button')

    Array.from(toolButtons).forEach((toolButton) => {
      if (disableToolButtons.includes(toolButton.getAttribute('data-command')))
        toolButton.disabled = true

      // * Add event listener for tool buttons
      toolButton.addEventListener('click', onToolButtonClickHandler)
    })
  }

  return (
    <div className={`richtexteditor ${className}`}>
      <SunEditor
        ref={editorRef}
        mode="classic"
        name={Field.FieldValue}
        placeholder={
          Field.Placeholder ? Field.Placeholder : 'Please type here...'
        }
        setContents={value}
        setOptions={options}
        // plugins={plugins}
        disable={Field.Disabled ? Field.Disabled : false}
        hide={Field.Hide ? Field.Hide : false}
        onChange={onChange}
        onLoad={onLoadHandler}
      />
    </div>
  )
}

FFRichTextEditor.defaultProps = {
  className: '',
  value: '',
  Field: {},
  onChangeHandler: () => null,
  disableToolButtons: [],
}

FFRichTextEditor.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  Field: PropTypes.shape({
    Disabled: PropTypes.bool,
    Hide: PropTypes.bool,
    FieldValue: PropTypes.string,
    Placeholder: PropTypes.string,
  }),
  onChangeHandler: PropTypes.func,
  disableToolButtons: PropTypes.arrayOf(PropTypes.string),
}

export default FFRichTextEditor
