import React from 'react'
import { useQueries, useQueryClient, useMutation } from 'react-query'
import { Chip } from '@material-ui/core'
import PropTypes from 'prop-types'
import {
  SaveSharp as SaveSharpIcon,
  Publish as PublishIcon,
  ArrowBack as ArrowBackIcon,
} from '@material-ui/icons'

import getAPIData, { getCoreData } from '../../../models/api/api'
import apiEndPoints from '../../../models/api/apiEndpoints'
import useActionFields from '../../components/hooks/useActionsFields'
import useAppContext from '../../components/hooks/useToast'
import usePageTitle from '../../components/hooks/usePageTitle'
import componentLookup from '../../../utils/componentLookup'

import SMSTemplateEditor from './SMSTemplateEditor/SMSTemplateEditor'
import HTMLTemplateEditor from './HTMLTemplateEditor/HTMLTemplateEditor'
import EditorProperties from './EditorProperties/EditorProperties'
import EditorTools from './EditorTools/EditorTools'
import useEditorContext from './useEditorContext'
import utils from '../../../utils/utils'
import './CorrespondenceEditor.css'

function correspondenceReducer(state, action) {
  let entityFields = null

  switch (action.type) {
    case 'SET_ENTITY':
      return { ...state, entity: action.entity, templateEntity: action.entity }
    case 'SET_TEMPLATEENTITY':
      entityFields = state.entityMetaData?.find(
        (entity) => entity.Name === action.templateEntity
      )?.EntityField

      return { ...state, templateEntity: action.templateEntity, entityFields }
    case 'SET_SELECTEDENTITYFIELDS':
      return { ...state, entityFields: action.entityFields }
    case 'UPDATE_EDITORPROPERTIES':
      return {
        ...state,
        editorProperties: {
          OrganisationTextField: action.OrganisationTextField,
          ...state.editorProperties,
          ...action.editorProperties,
        },
      }
    case 'SET_LOOKUPFIELDS':
      return { ...state, lookupFields: action.lookupFields }
    case 'SET_ENTITYMETADATA':
      return { ...state, entityMetaData: action.entityMetaData }
    case 'SET_SCREENMODE':
      return {
        ...state,
        screenMode: action.screenMode,
        correspondenceId: action?.correspondenceId || state.correspondenceId,
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const CorrespondenceEditor = ({ history, location }) => {
  const initialState = {
    entity: location.state?.editData?.EntityType || null,
    templateEntity: location.state?.editData?.EntityType || null,
    editorProperties: {},
    lookupFields: null,
    entityMetaData: null,
    screenMode: location.state.mode,
    correspondenceId: location.state?.editData?.id,
  }
  const [state, dispatch] = React.useReducer(
    correspondenceReducer,
    initialState
  )
  const { EditorProvider } = useEditorContext()
  const queryClient = useQueryClient()
  const { setActionFields } = useActionFields()
  const { setPageTitle } = usePageTitle()
  const { showToastMessage, showLoading, organisationId } = useAppContext()
  const [textName, setTextName] = React.useState('')
  setPageTitle('Correspondence Template Editor')

  const actionFields = [
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Label: 'Back to Templates',
        Icon: ArrowBackIcon,
        CSSName: '',
        onClick: () => history.push('/correspondenceLists'),
      },
    },
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Icon: SaveSharpIcon,
        Label: 'Save',
        CSSName: 'correspondence-editor__save',
        onClick: onSaveClickHandler,
        // disabled:
        //   state.screenMode === 'Edit' && state.editorProperties?.IsPublished,
      },
    },
    // {
    //   actionComponent: componentLookup.ActionButton,
    //   componentProps: {
    //     Icon: PublishIcon,
    //     Label: 'Publish',
    //     CSSName: 'correspondence-editor__publish',
    //     onClick: onPublishClickHandler,
    //     disabled: state.screenMode === 'Add',
    //   },
    // },
  ]

  setActionFields({ actionFields, hideSearchBox: true, showBackButton: false })

  useQueries([
    {
      queryKey: ['correspondenceEditor', 'entityMetaData'],
      queryFn: () =>
        getAPIData(
          apiEndPoints.GetEntity.method,
          `${apiEndPoints.GetEntity.url}?$expand=EntityField`
        ).then((response) => response.data.value),

      onSuccess: (data) => {
        dispatch({
          type: 'SET_ENTITYMETADATA',
          entityMetaData: data,
        })
      },
    },
    {
      queryKey: ['correspondenceEditor', 'lookupFields'],
      queryFn: () =>
        getAPIData(
          apiEndPoints.GetEntityFields.method,
          `${apiEndPoints.GetEntityFields.url}?$filter=EntityFieldDataType/Name eq 'Lookup'&$expand=Entity`
        ).then((response) => response.data.value),
      onSuccess: (data) => {
        dispatch({
          type: 'SET_LOOKUPFIELDS',
          lookupFields: data,
        })
      },
    },
    {
      queryKey: ['correspondenceEditor', 'correspondenceCore'],
      queryFn: () =>
        getCoreData(
          apiEndPoints.GetsysCorrespondence.method,
          `${apiEndPoints.GetsysCorrespondence.url}(${state.correspondenceId})`
        ).then(
          (response) =>
            utils.removeKeyFromObject(response.data[0], [
              '_attachments',
              '_etag',
              '_rid',
              '_self',
              '_ts',
              'CreatedOn',
            ])[0]
        ),
      onSuccess: (data) => {
        dispatch({
          type: 'UPDATE_EDITORPROPERTIES',
          editorProperties: data,
          OrganisationTextField:
            location.state?.editData?.OrganisationTextField ?? textName,
        })
      },
      enabled: state.screenMode === 'Edit',
    },
  ])

  const mutation = useMutation(
    (mutationData) => {
      const requestURL =
        mutationData.mutationType === 'patch'
          ? `${apiEndPoints.GetsysCorrespondence.url}(${state.correspondenceId})`
          : apiEndPoints.GetsysCorrespondence.url

      return getCoreData(
        mutationData.mutationType,
        requestURL,
        mutationData.requestBody
      )
    },
    {
      onMutate: () => showLoading(true),
      onSuccess: (response, mutationData) => {
        if (mutationData.mutationType === 'post') {
          showToastMessage('Saved successfully')
          dispatch({
            type: 'SET_SCREENMODE',
            screenMode: 'Edit',
            correspondenceId: response.data.responseData[0].id,
          })
        } else {
          showToastMessage('Updated successfully')
        }
        showLoading(false)
      },
      onError: (err) => {
        showToastMessage(JSON.stringify(err?.response?.data), 'error')
        showLoading(false)
      },
      onSettled: () => {
        showLoading(false)
        queryClient.invalidateQueries('correspondenceEditor')
      },
    }
  )

  async function onSaveClickHandler() {
    setTextName(state.editorProperties?.OrganisationTextField)
    delete state.editorProperties?.OrganisationTextField

    if (state.screenMode === 'Edit') {
      delete state.editorProperties.id

      const patchData = {
        ...state.editorProperties,
        ...(organisationId.organisation != '*' && organisationId),
      }

      mutation.mutate({
        mutationType: 'patch',
        requestBody: patchData,
      })
    } else {
      const postData = {
        ...state.editorProperties,
        ...(organisationId.organisation != '*' && organisationId),
      }

      mutation.mutate({
        mutationType: 'post',
        requestBody: postData,
      })
    }
  }

  // async function onPublishClickHandler() {
  //   const patchData = {
  //     ...state.editorProperties,
  //     IsPublished: true,
  //   }

  //   mutation.mutate({
  //     mutationType: 'patch',
  //     requestBody: patchData,
  //   })
  // }

  React.useEffect(() => {
    if (state.screenMode === 'Edit')
      dispatch({
        type: 'SET_TEMPLATEENTITY',
        templateEntity: state.entity,
      })
  }, [state.entityMetaData])

  const { entity, editorProperties } = state

  return (
    <div className="correspondence-editor">
      <EditorProvider value={{ editorData: state, editorDispatcher: dispatch }}>
        <EditorTools />
        <div className="correspondence-editor__template-editor">
          <div className="correspondence-editor__template-editor_header">
            {editorProperties.TemplateName || ''}
          </div>
          <div className="correspondence-editor__template-editor_chips">
            {entity && <Chip label={entity} />}
            {editorProperties.OrganisationTextField && (
              <Chip label={editorProperties.OrganisationTextField} />
            )}
            {editorProperties.TemplateType && (
              <Chip label={editorProperties.TemplateType} />
            )}
            {editorProperties.Format && (
              <Chip label={editorProperties.Format} />
            )}
            {editorProperties.Direction && (
              <Chip label={editorProperties.Direction} />
            )}
          </div>
          {editorProperties.TemplateType === 'EMail' ||
          editorProperties.TemplateType === 'Letter' ? (
            <HTMLTemplateEditor />
          ) : (
            <SMSTemplateEditor />
          )}
        </div>
        {state.entityMetaData && <EditorProperties />}
      </EditorProvider>
    </div>
  )
}

CorrespondenceEditor.propTypes = {}

export default CorrespondenceEditor
