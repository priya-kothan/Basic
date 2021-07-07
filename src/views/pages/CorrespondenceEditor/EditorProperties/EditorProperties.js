import React from 'react'
import { useQuery, useQueries, queryCache } from 'react-query'

import getAPIData, { getCoreData } from '../../../../models/api/api'
import apiEndpoints from '../../../../models/api/apiEndpoints'
import componentLookup from '../../../../utils/componentLookup'
import FFTextBox from '../../../components/base/FFTextBox/FFTextBox'
import useEditorContext from '../useEditorContext'
import FormTabs from '../../../components/custom/FormTabs/FormTabs'
import './EditorProperties.css'

function correspondencePropertiesReducer(state, action) {
  switch (action.type) {
    case 'SET_PROPERTYDATA':
      return {
        ...state,
        propertiesData: action.propertiesData,
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const EditorProperties = () => {
  const initialState = {
    editorFields: null,
    propertiesData: null,
  }
  const [state, dispatch] = React.useReducer(
    correspondencePropertiesReducer,
    initialState
  )
  const componentList = componentLookup
  const { editorData, editorDispatcher } = useEditorContext()
  const [entityQuery] = useQueries([
    {
      queryKey: ['correspondenceEditor', 'correspondenceEntities'],
      queryFn: () =>
        getAPIData(
          apiEndpoints.GetEntity.method,
          `${apiEndpoints.GetEntity.url}?$filter=IsSupportCorrespondences eq true&$expand=EntityField`
        ).then((response) => response.data.value),
    },
  ])
  // async function LookupFiltervalue(lookupfilter) {
  //   const lookupfilterdata = []
  //   for (let i = 0; i <= lookupfilter.length - 1; i++) {
  //     if (lookupfilter[i]?.LookupFilter) {
  //       const formSchema = await getCoreData(
  //         apiEndpoints.JsonToODataQuery.method,
  //         apiEndpoints.JsonToODataQuery.url,
  //         lookupfilter[i].LookupFilter
  //       )
  //       lookupfilterdata.push({
  //         ...lookupfilter[i],
  //         lookupfieldfilter: formSchema.data,
  //       })
  //     } else {
  //       lookupfilterdata.push({
  //         ...lookupfilter[i],
  //         lookupfieldfilter: null,
  //       })
  //     }
  //   }
  //   return lookupfilterdata
  // }

  function injectPropertyComponent(propertySchema) {
    let lookupEntity = null
    let lookupEntityTextField = null

    if (!propertySchema || propertySchema.length <= 0) return []

    return propertySchema.map((propertyObj) => {
      if (
        editorData.entityMetaData &&
        propertyObj.EntityFieldDataType.Name === 'Lookup'
      ) {
        lookupEntity = editorData.entityMetaData.find(
          (entity) => entity.Id === propertyObj.Lookup
        )
        lookupEntityTextField = lookupEntity?.EntityField?.find(
          (entityField) => entityField.Id === propertyObj.LookupTextField
        )?.Name
      }

      if (propertyObj.Name === 'EntityType')
        return {
          ...propertyObj,
          EntityFieldDataType: {
            ...propertyObj.EntityFieldDataType,
            Name: 'Lookup',
            DynamicComponent: componentList.Lookup.component,
          },
          OptionSet: {
            OptionSetOptions: entityQuery.data,
          },
        }

      return {
        ...propertyObj,
        EntityFieldDataType: {
          ...propertyObj.EntityFieldDataType,
          DynamicComponent: componentList[propertyObj.EntityFieldDataType.Name]
            ?.component
            ? componentList[propertyObj.EntityFieldDataType.Name].component
            : FFTextBox,
        },
        lookupEntityName: lookupEntity?.Name || '',
        lookupEntityTextField,
      }
    })
  }

  const entityFieldsQuery = useQuery({
    queryKey: ['correspondenceEditor', 'correspondenceEntityFields'],
    queryFn: () =>
      getAPIData(
        apiEndpoints.GetEntityFields.method,
        `${apiEndpoints.GetEntityFields.url}?$expand=Entity,EntityFieldDataType,OptionSet($expand=OptionSetOptions)&$filter=Entity/Name eq 'CorrespondenceTemplate'`
      ).then((response) => response.data.value),

    refetchOnReconnect: false,
    onSuccess: async (data) => {
      /// const injectedDatatypeComponent12 = await LookupFiltervalue(data)
      const propertiesData = injectPropertyComponent(
        // injectedDatatypeComponent12
        data
      )

      dispatch({
        type: 'SET_PROPERTYDATA',
        propertiesData,
      })
    },

    enabled: entityQuery.isFetched,
  })

  const onPropertyValueChageHandler = React.useCallback(
    async (event, propertyName) => {
      let editorProperties = null
      if (!propertyName) return null

      if (propertyName.id === 'EntityType') {
        editorDispatcher({
          type: 'SET_ENTITY',
          entity: propertyName.value,
        })
        editorDispatcher({
          type: 'SET_TEMPLATEENTITY',
          templateEntity: propertyName.value,
        })
      }

      if (
        propertyName.id === 'TemplateType' ||
        propertyName.id === 'EntityType'
      )
        editorProperties = {
          [propertyName.id]: propertyName.value,
          TemplateContent: '',
          To: '',
          Cc: '',
          Bcc: '',
          Subject: '',
        }
      else
        editorProperties = {
          [propertyName.id]: propertyName.value,
        }

      if (propertyName.id === 'Organisation') {
        editorProperties = {
          ...state.editorProperties,
          OrganisationTextField: event.target.innerText,
          Organisation: propertyName.value,
        }
      }
      return editorDispatcher({
        type: 'UPDATE_EDITORPROPERTIES',
        editorProperties,
      })
    },
    [editorData.lookupFields]
  )

  function getFieldProperties(field) {
    switch (field.EntityFieldDataType.Name) {
      case 'DecimalNumber':
      case 'WholeNumber':
        return {
          FieldValue: field.Name,
          FieldLabel: field.DisplayName,
          IsEnableHelpText: false,
          Type: 'number',
        }
      case 'OptionSet':
        return {
          FieldValue: field.Name,
          Datasource: field.OptionSet.OptionSetOptions,
          TextField: 'Name',
          ValueField: 'Name',
          FieldLabel: field.DisplayName,
          Disabled:
            field.Name === 'TemplateType' && editorData.screenMode === 'Edit',
        }
      case 'Lookup':
        let lookupfieldfilterURL = ''

        if (field?.lookupfieldfilter) {
          lookupfieldfilterURL = `${field.lookupEntityName}?${field.lookupfieldfilter}`
        } else {
          lookupfieldfilterURL = `${field.lookupEntityName}`
        }
        if (field.Name === 'EntityType')
          return {
            FieldValue: field.Name,
            Datasource: field.OptionSet.OptionSetOptions,
            TextField: 'Name',
            ValueField: 'Name',
            FieldLabel: field.DisplayName,
            Disabled: editorData.screenMode === 'Edit',
          }
        return {
          FieldValue: field.Name,
          DatasourceURL: `/api/${lookupfieldfilterURL || ''}`,
          TextField: field.lookupEntityTextField || 'id',
          ValueField: 'id',
          FieldLabel: field.DisplayName,
          postBody: {
            queryOptions: null,
            freeFlowFilter: field?.LookupFilter
              ? JSON.parse(field?.LookupFilter)
              : null,
          },
          // header:
          //   field?.LookupFilter && field.LookupFilter !== null
          //     ? {
          //         EntityFieldId: field.Id,
          //         IsLookupFilter: 'true',
          //         ParentEntityName: field.Entity.Name,
          //       }
          //     : '',
        }
      default:
        return {
          FieldValue: field.Name,
          FieldLabel: field.DisplayName,
          IsEnableHelpText: false,
        }
    }
  }

  const { propertiesData } = state

  return (
    <div className="correspondence-editor-properties">
      <div className="correspondence-editor-properties__header">Settings</div>
      <FormTabs className="correspondence-editor-properties__fields">
        <FormTabs.FormTabList>
          <FormTabs.FormTab>Properties</FormTabs.FormTab>
        </FormTabs.FormTabList>
        <FormTabs.FormTabPanels>
          <FormTabs.FormTabPanel>
            <div className="correspondence-editor-properties__fields_item">
              {entityFieldsQuery.isFetching
                ? 'Loading...'
                : propertiesData &&
                  propertiesData.map((property) => {
                    if (!property?.IsVisibleInUI) return null

                    if (
                      property.Name === 'Format' &&
                      (editorData.editorProperties.TemplateType === 'SMS' ||
                        editorData.editorProperties.TemplateType === 'Social')
                    )
                      return null

                    return (
                      <property.EntityFieldDataType.DynamicComponent
                        key={`${property.Id}`}
                        Field={getFieldProperties(property)}
                        value={editorData.editorProperties[property.Name] || ''}
                        onChangeHandler={onPropertyValueChageHandler}
                      />
                    )
                  })}
            </div>
          </FormTabs.FormTabPanel>
        </FormTabs.FormTabPanels>
      </FormTabs>
    </div>
  )
}

export default EditorProperties
