import React from 'react'
import { useQueries } from 'react-query'
import {
  Close as CloseIcon,
  Save as SaveIcon,
  ClearAll as ClearIcon,
} from '@material-ui/icons'
import ReactJson from 'react-json-view'
import _ from 'lodash'
import PropTypes from 'prop-types'

import CRUDModal from '../CRUDModal/CRUDModal'
import DesignerTools from './DesignerTools/DesignerTools'
import getAPIData from '../../../../models/api/api'
import apiEndPoints from '../../../../models/api/apiEndpoints'
import utils from '../../../../utils/utils'
import FilterDesigner from '../FilterDesigner/FilterDesigner'
import ConditionTemplate from './ConditionTemplate/ConditionTemplate'
import SetValueTemplate from './SetValueTemplate/SetValueTemplate'
import useCalculatedFieldsContext from './useCalculatedFieldsContext'
import ActionButton from '../../base/ActionButton/ActionButton'
import FFSwitch from '../../base/FFSwitch/FFSwitch'
import useAppContext from '../../hooks/useToast'
import './CalculatedFieldsDesigner.css'

function calculatedFieldsReducer(state, action) {
  switch (action.type) {
    case 'SET_DESIGNERENTITY':
      return {
        ...state,
        designerEntity: action.payload,
        designerEntityFields: _.filter(
          _.find(state.apiData.entityMetaData, { Id: action.payload.id })
            .EntityField,
          {
            EntityId: action.payload.id,
          }
        ),
      }
    case 'SET_DESIGNERENTITYFIELDS':
      return { ...state, designerEntityFields: action.payload }
    case 'SET_APIDATA':
      return { ...state, apiData: { ...state.apiData, ...action.payload } }
    case 'SHOW_FILTERPOPUP':
      return {
        ...state,
        showFilterPopup: action.payload.popupVisibility,
        filterData: action.payload.filterData || state.filterData,
      }
    case 'UPDATE_DESIGNEROUTPUT':
      return {
        ...state,
        designerOutput: action.payload,
      }
    case 'UPDATE_DESIGNEROUTPUT1':
      return {
        ...state,
        updaval: action.updaval,
      }
    case 'SHOW_PREVIEW':
      return { ...state, showPreview: action.payload }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const CalculatedFieldsDesigner = ({ entity, onChange, src }) => {
  const initialState = {
    baseEntity: entity,
    designerEntity: entity,
    designerEntityFields: [],
    apiData: {},
    showFilterPopup: false,
    filterData: {},
    designerOutput: src || {},
    showPreview: false,
  }
  let setvalueonly = false
  const [state, dispatch] = React.useReducer(
    calculatedFieldsReducer,
    initialState
  )
  const { ContextProvider } = useCalculatedFieldsContext()
  const { showToastMessage } = useAppContext()

  useQueries([
    {
      queryKey: ['calculatedFieldsDesigner', 'entityMetaData'],
      queryFn: () =>
        getAPIData(
          apiEndPoints.GetEntity.method,
          `${apiEndPoints.GetEntity.url}?$expand=EntityField($expand=EntityFieldDataType)`
        ).then((response) => response.data.value),

      onSuccess: (responseData) => {
        const entityObject = _.find(responseData, { Id: state.baseEntity.id })
        const entityFields = _.filter(entityObject.EntityField, {
          EntityId: state.baseEntity.id,
        })

        dispatch({
          type: 'SET_APIDATA',
          payload: { entityMetaData: responseData },
        })
        dispatch({ type: 'SET_DESIGNERENTITYFIELDS', payload: entityFields })
      },
    },
  ])

  function renderWorkspaceComponents(schemaKey, schemaValue) {
    switch (schemaKey) {
      case 'condition':
        return <ConditionTemplate schema={schemaValue} />
      case 'setValue':
        return <SetValueTemplate schema={schemaValue} />
      default:
        return null
    }
  }

  function allowDrop(ev) {
    ev.preventDefault()
  }

  function onDropHandler(event) {
    event.preventDefault()

    let containerId = null
    const draggedComponent = event.dataTransfer.getData('draggedComponent')
    const designerOutput = _.cloneDeep(state.designerOutput)
    let updateValue = {}
    let updateValue1 = {}

    if (draggedComponent === 'condition') {
      if (state.updaval === true) {
        updateValue = {
          setValue: designerOutput?.condition?.updateValue?.setValue || '',
        }
      } else {
        containerId = event.target.getAttribute('container-id')
        setvalueonly = false
        updateValue = {
          condition: {
            id: utils.generateGUID(),
            criteria: { entity: '', filters: [], id: utils.generateGUID() },
            onSuccess: { id: utils.generateGUID() },
            onFailure: { id: utils.generateGUID() },
          },
        }
      }
    } else if (draggedComponent === 'setvalue') {
      containerId = event.target.getAttribute('container-id')
      if (containerId) {
        setvalueonly = updateValue = {
          setValue: '',
        }
      } else {
        setvalueonly = true
        updateValue = {
          setValue: designerOutput?.condition?.updateValue?.setValue || '',
        }
      }
    } else {
      if (event.target.id) containerId = event.target.id
      else {
        containerId = event.target.getAttribute('container-id')
      }

      if (event.target.value) {
        updateValue = {
          setValue: `${event.target.value}${draggedComponent}`,
        }
      } else {
        updateValue = {
          setValue: `${draggedComponent}`,
        }
      }
    }

    if (_.isEqual(state.designerOutput, {})) {
      dispatch({
        type: 'UPDATE_DESIGNEROUTPUT',
        payload: updateValue,
      })
      if (setvalueonly === true) {
        dispatch({
          type: 'UPDATE_DESIGNEROUTPUT1',
          // payload: updateValue,
          updaval: setvalueonly,
        })
      }
    } else if (containerId) {
      utils.mutateObjectById(designerOutput, containerId, updateValue)
      dispatch({
        type: 'UPDATE_DESIGNEROUTPUT',
        payload: designerOutput,
      })
    } else {
      // updateValue.condition.id
      if (
        updateValue?.condition &&
        updateValue?.condition?.id &&
        updateValue?.condition?.id
      ) {
        utils.mutateObjectById(designerOutput, containerId, updateValue)
        dispatch({
          type: 'UPDATE_DESIGNEROUTPUT',
          payload: designerOutput,
        })
      } else {
        // updateValue.condition.id
        if (state.updaval === true) {
          if (!updateValue1?.updateValue?.condition?.setValue)
            updateValue1 = {
              condition: { updateValue },
            }
          else {
            updateValue1 = {
              condition: { updateValue },
            }
          }
        } else {
          updateValue1 = {
            condition: { updateValue },
          }
        }
        dispatch({
          type: 'UPDATE_DESIGNEROUTPUT',
          payload: updateValue,
        })
      }
    }
  }

  function onFilterSaveHandler(filterOutput) {
    const designerOutputClone = _.cloneDeep(state.designerOutput)
    const parsedFilterOutput = JSON.parse(filterOutput)

    utils.mutateObjectById(
      designerOutputClone,
      parsedFilterOutput.id,
      parsedFilterOutput
    )
    dispatch({ type: 'UPDATE_DESIGNEROUTPUT', payload: designerOutputClone })
    showToastMessage('Filters saved successfully')
  }

  function onSaveClickHandler() {
    if (onChange) onChange(state.designerOutput)
    showToastMessage('Saved successfully')
  }

  function onResetClickHandler() {
    dispatch({ type: 'UPDATE_DESIGNEROUTPUT', payload: {} })
    dispatch({
      type: 'UPDATE_DESIGNEROUTPUT1',
      updaval: false,
    })
  }

  return (
    <ContextProvider
      value={{ designerData: state, designerDispatcher: dispatch }}
    >
      <div className="calculatedfields-designer">
        <DesignerTools />
        <div className="calculatedfields-designer__actions">
          <div />
          <FFSwitch
            Field={{
              FieldLabel: 'Show Preview',
              FieldValue: 'showPreview',
              DefaultValue: false,
            }}
            onChangeHandler={(event, params) =>
              dispatch({ type: 'SHOW_PREVIEW', payload: params.value })
            }
            value={state.showPreview}
          />
          <ActionButton
            CSSName="calculatedfields-designer__actions_reset"
            Icon={ClearIcon}
            Label="Reset"
            onClick={onResetClickHandler}
          />
          <ActionButton
            CSSName="calculatedfields-designer__actions_save"
            Icon={SaveIcon}
            Label="Save"
            onClick={onSaveClickHandler}
          />
        </div>
        {!state.showPreview ? (
          <div
            className="calculatedfields-designer__workspace"
            onDrop={onDropHandler}
            onDragOver={allowDrop}
          >
            {_.isEmpty(state.designerOutput) ? (
              <div className="calculatedfields-designer__workspace_empty">
                <span>Drag here</span>
              </div>
            ) : (
              Object.entries(state.designerOutput).map(([key, value]) =>
                renderWorkspaceComponents(
                  key,
                  value.id !== undefined ? value : state.designerOutput
                )
              )
            )}
          </div>
        ) : (
          <div className="calculatedfields-designer__preview">
            <ReactJson
              name={false}
              iconStyle="square"
              collapsed={false}
              enableClipboard={false}
              displayObjectSize={false}
              displayDataTypes={false}
              src={state.designerOutput}
            />
          </div>
        )}
      </div>
      <CRUDModal open={state.showFilterPopup} width="80%">
        <CRUDModal.Header>
          <CRUDModal.Title>Add Filter</CRUDModal.Title>
          <CRUDModal.Close
            onClick={() =>
              dispatch({
                type: 'SHOW_FILTERPOPUP',
                payload: {
                  popupVisibility: false,
                },
              })
            }
          >
            <CloseIcon />
          </CRUDModal.Close>
        </CRUDModal.Header>
        <CRUDModal.Content>
          <FilterDesigner
            EntityData={state.baseEntity.Name}
            QueryData={state.filterData}
            handleClick={onFilterSaveHandler}
          />
        </CRUDModal.Content>
      </CRUDModal>
    </ContextProvider>
  )
}

CalculatedFieldsDesigner.defaultProps = {
  onChange: () => null,
}

CalculatedFieldsDesigner.propTypes = {
  entity: PropTypes.shape({
    id: PropTypes.string,
    Name: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func,
  src: PropTypes.object.isRequired,
}

export default CalculatedFieldsDesigner
