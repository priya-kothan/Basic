import React from 'react'
import { IconButton } from '@material-ui/core'
import { FilterListRounded, Close as CloseIcon } from '@material-ui/icons'
import ReactJson from 'react-json-view'
import _ from 'lodash'
import PropTypes from 'prop-types'

import utils from '../../../../../utils/utils'
import SetValueTemplate from '../SetValueTemplate/SetValueTemplate'
import useCalculatedFieldsContext from '../useCalculatedFieldsContext'
import './ConditionTemplate.css'

const ConditionTemplate = ({ schema }) => {
  const { designerData, designerDispatcher } = useCalculatedFieldsContext()

  function renderWorkspace(schemaKey, schemaValue, componentSchema) {
    switch (schemaKey) {
      case 'condition':
        return (
          <ConditionTemplate key={componentSchema.id} schema={schemaValue} />
        )
      case 'setValue':
        return (
          <SetValueTemplate key={componentSchema.id} schema={componentSchema} />
        )
      default:
        return null
    }
  }

  function getSchemaSource() {
    return JSON.parse(
      JSON.stringify(schema.criteria, (key, value) =>
        key === 'id' ? undefined : value
      )
    )
  }

  function onRemoveClickHandler(containerId) {
    const designerOutputClone = _.cloneDeep(designerData.designerOutput)

    utils.mutateObjectById(designerOutputClone, containerId, null)

    designerDispatcher({
      type: 'UPDATE_DESIGNEROUTPUT',
      payload: designerOutputClone,
    })
  }

  return (
    <div className="conditiontemplate">
      {schema.criteria && (
        <div className="conditiontemplate__criteria">
          <div className="conditiontemplate__criteria_header">
            <div className="conditiontemplate__criteria_title">Criteria</div>
            <IconButton
              aria-label="Close"
              className="conditiontemplate__criteria_remove"
              onClick={() => onRemoveClickHandler(schema.id)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
          <div className="conditiontemplate__criteria_content">
            <div
              container-id={schema.criteria.id}
              className="conditiontemplate__criteriadata"
            >
              <ReactJson
                name={false}
                iconStyle="square"
                collapsed={1}
                enableClipboard={false}
                displayObjectSize={false}
                displayDataTypes={false}
                src={schema.criteria}
              />
            </div>
            <IconButton
              aria-label="FilterListRounded"
              className="conditiontemplate__filteropener"
              onClick={() =>
                designerDispatcher({
                  type: 'SHOW_FILTERPOPUP',
                  payload: {
                    popupVisibility: true,
                    filterData: schema.criteria,
                  },
                })
              }
            >
              <FilterListRounded fontSize="large" />
            </IconButton>
          </div>
        </div>
      )}
      {schema.onSuccess && (
        <div
          className="conditiontemplate__success"
          // onDrop={(event) => onDropHandler(event, schema.onSuccess)}
          // onDragOver={allowDrop}
        >
          <div className="conditiontemplate__success_header">On Success</div>
          <div
            container-id={schema.onSuccess.id}
            className="conditiontemplate__success_content"
          >
            {Object.entries(schema.onSuccess).map(([key, value]) =>
              renderWorkspace(key, value, schema.onSuccess)
            )}
          </div>
        </div>
      )}
      {schema.onFailure && (
        <div
          className="conditiontemplate__failure"
          // onDrop={(event) => onDropHandler(event, schema.onFailure)}
          // onDragOver={allowDrop}
        >
          <div className="conditiontemplate__failure_header">On Failure</div>
          <div
            container-id={schema.onFailure.id}
            className="conditiontemplate__failure_content"
          >
            {Object.entries(schema.onFailure).map(([key, value]) =>
              renderWorkspace(key, value, schema.onFailure)
            )}
          </div>
        </div>
      )}

      {schema.updateValue && (
        <div
          className="conditiontemplate__success"
          // onDrop={(event) => onDropHandler(event, schema.onSuccess)}
          // onDragOver={allowDrop}
        >
          {/* <div className="conditiontemplate__success_header">On Success</div> */}
          <div
            container-id={schema.updateValue}
            className="conditiontemplate__success_content"
          >
            {Object.entries(schema.updateValue).map(([key, value]) =>
              renderWorkspace(key, value, schema.updateValue)
            )}
          </div>
        </div>
      )}
    </div>
  )
}

ConditionTemplate.propTypes = {
  schema: PropTypes.object.isRequired,
}

export default ConditionTemplate
