import React from 'react'
import { IconButton } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'
import _ from 'lodash'
import PropTypes from 'prop-types'

import FFTextBox from '../../../base/FFTextBox/FFTextBox'
import utils from '../../../../../utils/utils'
import useCalculatedFieldsContext from '../useCalculatedFieldsContext'
import './SetValueTemplate.css'

const SetValueTemplate = ({ schema }) => {
  const { designerData, designerDispatcher } = useCalculatedFieldsContext()

  function onSetValueChangeHandler(event, params) {
    let updateValue = {}
    let updateValue1 = {}
    const designerOutputClone = _.cloneDeep(designerData.designerOutput)
    if (params.id) {
      utils.mutateObjectById(designerOutputClone, params.id, {
        setValue: params.value,
      })
      designerDispatcher({
        type: 'UPDATE_DESIGNEROUTPUT',
        payload: designerOutputClone,
      })
    } else {
      updateValue = {
        setValue: `${params.value}`,
      }
      updateValue1 = {
        condition: { updateValue },
      }
      designerDispatcher({
        type: 'UPDATE_DESIGNEROUTPUT',
        payload: updateValue,
      })
    }
  }

  function onRemoveClickHandler(containerId) {
    const designerOutputClone = _.cloneDeep(designerData.designerOutput)

    utils.mutateObjectById(designerOutputClone, containerId, {})

    designerDispatcher({
      type: 'UPDATE_DESIGNEROUTPUT',
      payload: designerOutputClone,
    })
  }

  return (
    <div className="setvalue-template">
      <div className="setvalue-template_header">
        <div className="setvalue-template_title">Set Value</div>
        <IconButton
          aria-label="Close"
          className="setvalue-template_remove"
          onClick={() => onRemoveClickHandler(schema.id)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <div className="setvalue-input">
        <FFTextBox
          id={schema.id}
          className="correspondence-editor-tools__search"
          Field={{
            FieldValue: schema.id,
            FieldLabel: 'Set Value',
            IsEnableHelpText: false,
            Placeholder: 'Set Value',
            DisableDroppable: false,
            Multiline: true,
            Rows: 3,
          }}
          value={schema.setValue || ''}
          onChangeHandler={onSetValueChangeHandler}
        />
      </div>
    </div>
  )
}

SetValueTemplate.propTypes = {
  schema: PropTypes.object.isRequired,
}

export default SetValueTemplate
