import React from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'

import FFTextBox from '../../../components/base/FFTextBox/FFTextBox'
import FFAutocomplete from '../../../components/base/FFAutocomplete/FFAutocomplete'
import useEntityLookups from '../../../components/hooks/useEntityLookups'
import useEditorContext from '../useEditorContext'
import './EditorTools.css'

function editorToolsReducer(state, action) {
  switch (action.type) {
    case 'SET_ENTITYFIELDSSEARCHTEXT':
      return { ...state, entityFieldsSearchText: action.entityFieldsSearchText }
    case 'SET_TEMPLATESEARCHTEXT':
      return { ...state, templateSearchText: action.templateSearchText }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const EditorTools = () => {
  const initialState = {
    entityFields: null,
    entityFieldsSearchText: '',
    templateSearchText: '',
  }
  const [state, dispatch] = React.useReducer(editorToolsReducer, initialState)
  const { editorData, editorDispatcher } = useEditorContext()
  const entityLookups = useEntityLookups(editorData.entity)

  function onEntityChangeHandler(e, params) {
    editorDispatcher({
      type: 'SET_TEMPLATEENTITY',
      templateEntity: params.value,
    })
  }

  function onEntityFieldsSearchHandler(e, params) {
    const entityFields = editorData.entityMetaData.find(
      (entity) => entity.Name === editorData.entity
    )?.EntityField

    if (!params.value)
      editorDispatcher({ type: 'SET_SELECTEDENTITYFIELDS', entityFields })

    dispatch({
      type: 'SET_ENTITYFIELDSSEARCHTEXT',
      entityFieldsSearchText: params.value,
    })
    editorDispatcher({
      type: 'SET_SELECTEDENTITYFIELDS',
      entityFields: entityFields.filter((entityField) =>
        entityField.DisplayName.toLowerCase().includes(
          params.value.toLowerCase()
        )
      ),
    })
  }

  function onEmailTemplatesSearchHandler(e, params) {
    dispatch({
      type: 'SET_TEMPLATESEARCHTEXT',
      templateSearchText: params.value,
    })
  }

  function onToolDragHandler(event, entityProperties) {
    event.dataTransfer.setData(
      'text',
      `{${editorData.templateEntity}.${entityProperties.DisplayName}}`
    )
  }

  const { entityFieldsSearchText, templateSearchText } = state

  return (
    <div className="correspondence-editor-tools">
      <div className="correspondence-editor-tools__header">Entity Fields</div>
      <div className="correspondence-editor-tools__items">
        {!editorData.entity ? (
          'No Entity Selected. Please select an entity from the properties window.'
        ) : (
          <>
            <FFAutocomplete
              id="SelectedEntity"
              name="RequiredId"
              className="correspondence-editor-tools__entity"
              Field={{
                FieldValue: 'SelectedEntity',
                FieldLabel: 'Selected Entity',
                Datasource: entityLookups?.optionSets || [],
                ValueField: 'Name',
                TextField: 'Name',
                DefaultValue: editorData?.templateEntity,
              }}
              value={editorData.templateEntity}
              onChangeHandler={onEntityChangeHandler}
            />
            <FFTextBox
              id="search-tools"
              className="correspondence-editor-tools__search"
              Field={{
                FieldValue: 'SearchTools',
                FieldLabel: 'Search Entity Fields',
                IsEnableHelpText: false,
                Placeholder: 'Search Entity Fields',
                DisableDroppable: true,
              }}
              value={entityFieldsSearchText}
              onChangeHandler={onEntityFieldsSearchHandler}
            />
            <div className="correspondence-editor-tools__entityfields">
              {editorData?.entityFields &&
                editorData.entityFields.map((entityProperties) => {
                  return (
                    <div
                      key={entityProperties.Id}
                      className="correspondence-editor-tools__entityfields_item"
                    >
                      <DragIndicatorIcon />
                      <span
                        draggable
                        onDragStart={(event) =>
                          onToolDragHandler(event, entityProperties)
                        }
                      >
                        {entityProperties.DisplayName}
                      </span>
                    </div>
                  )
                })}
            </div>
          </>
        )}
      </div>
      <div className="correspondence-editor-tools__header">Email Templates</div>
      <div className="correspondence-editor-tools__emailtemplates">
        <FFTextBox
          id="search-tools-entity"
          className="correspondence-editor-tools__search"
          Field={{
            FieldValue: 'SearchTools',
            FieldLabel: 'Search Template',
            IsEnableHelpText: false,
            Placeholder: 'Search Template',
            DisableDroppable: true,
          }}
          value={templateSearchText}
          onChangeHandler={onEmailTemplatesSearchHandler}
        />
        <div className="correspondence-editor-tools__templates">
          {/* {entityFields &&
            entityFields.map((entityProperties) => {
              return (
                <div
                  className="correspondence-editor-tools__emailtemplates_item"
                  draggable
                  onDragStart={(event) =>
                    onToolDragHandler(event, entityProperties)
                  }
                >
                  <DragIndicatorIcon />
                  <span>{entityProperties.DisplayName}</span>
                </div>
              )
            })} */}
        </div>
      </div>
    </div>
  )
}

export default EditorTools
