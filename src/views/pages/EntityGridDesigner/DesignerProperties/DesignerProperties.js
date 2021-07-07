import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { Close as CloseIcon } from '@material-ui/icons'

import getAPIData, { getCoreData } from '../../../../models/api/api'
import FFSpinner from '../../../components/base/FFSpinner/FFSpinner'
import FFTextBox from '../../../components/base/FFTextBox/FFTextBox'
import APIEndPoints from '../../../../models/api/apiEndpoints'
import componentLookup from '../../../../utils/componentLookup'
import useAppContext from '../../../components/hooks/useToast'
import useEditorContext from '../useEditorContext'
import FFButton from '../../../components/base/FFButton/FFButton'
import CRUDModal from '../../../components/custom/CRUDModal/CRUDModal'
import FilterDesigner from '../../../components/custom/FilterDesigner/FilterDesigner'
import FFAutocomplete from '../../../components/base/FFAutocomplete/FFAutocomplete'
import utils from '../../../../utils/utils'
import './DesignerProperties.css'

function designerPropReducer(state, action) {
  switch (action.type) {
    case 'SHOW_LOADING':
      return { ...state, showLoading: action.showLoading }
    case 'SET_ENTITYMETADATA':
      return { ...state, entityMetaData: action.entityMetaData }
    case 'SHOW_PROPERTIES':
      return { ...state, showProperties: !state.showProperties }
    case 'UPDATE_PROPERTIES':
      return {
        ...state,
        propertyValues: { ...state.propertyValues, ...action.propertyValues },
      }
    case 'SET_PROPERTYDATA':
      return {
        ...state,
        propertiesData: action.propertiesData,
        showLoading: false,
      }

    case 'SHOW_POPUP':
      // const dsf = state
      return {
        ...state,
        showModal: true,
        mode: 'ADD',
      }
    case 'HIDE_POPUP':
      return {
        ...state,
        showModal: false,
      }
    case 'Save_Data':
      return {
        ...state,
        showModal: false,
      }
    case 'Filter_Data':
      return {
        ...state,

        showModal: false,
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const DesignerProperties = () => {
  const initialState = {
    showProperties: true,
    propertiesData: null,
    propertyValues: {},
    showLoading: true,
    entityMetaData: null,
    showModal: false,
  }
  const onhandleClick = (query) => {
    editorDispatcher({
      type: 'Filter_Data',
      data: query,
    })
    dispatch({
      type: 'Filter_Data',
      data: query,
    })
  }

  const [state, dispatch] = React.useReducer(designerPropReducer, initialState)
  const { showModal } = state
  const { showLoading } = useAppContext()
  const { editorData, editorDispatcher } = useEditorContext()
  const componentList = componentLookup

  function onPropertyValueChageHandler(event, propertyName) {
    if (!propertyName) return null
    if (editorData.propertyEditorType === 'grid')
      editorDispatcher({
        type: 'SET_GRIDPROPERTIES',
        gridProperties: { [propertyName.id]: propertyName.value },
      })
    else
      editorDispatcher({
        type: 'UPDATE_COLUMNPROPERTIES',
        editingColumn: { [propertyName.id]: propertyName.value },
      })
  }

  // async function LookupFiltervalue(lookupfilter) {
  //   const lookupfilterdata = []
  //   for (let i = 0; i <= lookupfilter.length - 1; i++) {
  //     if (lookupfilter[i]?.LookupFilter) {
  //       const formSchema = await getCoreData(
  //         APIEndPoints.JsonToODataQuery.method,
  //         APIEndPoints.JsonToODataQuery.url,
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

  function injectPropertyComponent(propertySchema, entityMetaData) {
    if (!propertySchema || propertySchema.length <= 0) return []

    return propertySchema.map((propertyObj) => {
      let lookupEntity = null
      let lookupEntityTextField = null

      if (entityMetaData && propertyObj.EntityFieldDataType.Name === 'Lookup') {
        lookupEntity = entityMetaData.find(
          (entity) => entity.Id === propertyObj.Lookup
        )
        lookupEntityTextField = lookupEntity?.EntityField?.find(
          (entityField) => entityField.Id === propertyObj.LookupTextField
        )?.Name
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

  function getFieldProperties(control) {
    switch (control.EntityFieldDataType.Name) {
      case 'OptionSet':
        return {
          FieldValue: control.Name,
          DefaultValue: '',
          Datasource: control.OptionSet.OptionSetOptions,
          TextField: 'Name',
          ValueField: 'Value',
          FieldLabel: control.DisplayName,
        }
      case 'Lookup':
        let lookupfieldfilterURL = ''
        if (control?.lookupfieldfilter) {
          lookupfieldfilterURL = `${control.lookupEntityName}?${control.lookupfieldfilter}`
        } else {
          lookupfieldfilterURL = `${control.lookupEntityName}`
        }
        if (control.Name === 'ListIcon')
          return {
            FieldValue: control.Name,
            DatasourceURL: `/api/${lookupfieldfilterURL || ''}`,
            TextField: control.lookupEntityTextField || 'id',
            ValueField: 'id',
            FieldLabel: control.DisplayName,
            postBody: {
              queryOptions: null,
              freeFlowFilter: control?.LookupFilter
                ? JSON.parse(control?.LookupFilter)
                : null,
            },
            // Header: {
            //   EntityFieldId: entityField[0].Id,
            //   IsLookupFilter: true,
            //   ParentEntityName: editorData && editorData.entity,
            //   FieldName: control.Name,
            // },
            // header:
            //   control?.LookupFilter && control.LookupFilter !== null
            //     ? {
            //         EntityFieldId: control.Id,
            //         IsLookupFilter: 'true',
            //         ParentEntityName: control.Entity.Name,
            //       }
            //     : '',
          }

        return {
          FieldValue: control.Name,
          DatasourceURL: `/api/${lookupfieldfilterURL || ''}`,
          TextField: control.lookupEntityTextField || 'id',
          ValueField: 'id',
          FieldLabel: control.DisplayName,
          postBody: {
            queryOptions: null,
            freeFlowFilter: control?.LookupFilter
              ? JSON.parse(control?.LookupFilter)
              : null,
          },
          // header:
          //   control?.LookupFilter && control.LookupFilter !== null
          //     ? {
          //         EntityFieldId: control.Id,
          //         IsLookupFilter: 'true',
          //         ParentEntityName: control.Entity.Name,
          //       }
          //     : '',
        }
      default:
        if (control.Name === 'LargeIconName') {
          return {
            FieldValue: control.Name,
            DefaultValue: '',
            Datasource: editorData.currentEntityField,
            TextField: 'DisplayName',
            ValueField: 'Id',
            FieldLabel: control.DisplayName,
          }
        }

        if (control.Name === 'IconField')
          return {
            FieldValue: control.Name,
            FieldLabel: control.DisplayName,
            // DatasourceURL: `/api/${editorData.entity || ''}`,
            // eq '${listname}'
            DatasourceURL: `/api/Entity?$filter=Name eq '${editorData.entity}'&$expand=EntityField($filter=DataTypeId eq e2d641a3-979d-4e7a-8e24-7bc47e417925 or DataTypeId  eq 67ef0824-8610-4be5-89d1-72da9a8bb953)`,
            dataSourceAPI: true,
            TextField: 'Name',
            ValueField: 'Id',
          }

        return {
          FieldValue: control.Name,
          FieldLabel: control.DisplayName,
          Type:
            control.EntityFieldDataType.Name === 'WholeNumber'
              ? 'number'
              : 'text',
        }
    }
  }

  // useQueries([
  //   {
  //     queryKey: ['DesignerProperties', 'entityMetaData'],
  //     queryFn: () =>
  //       getAPIData(
  //         APIEndPoints.GetEntity.method,
  //         `${APIEndPoints.GetEntity.url}?$expand=EntityField`
  //       ).then((response) => response.data.value),

  //     onSuccess: (data) => {
  //       dispatch({
  //         type: 'SET_ENTITYMETADATA',
  //         entityMetaData: data,
  //       })
  //     },
  //   },
  // ])

  React.useEffect(() => {
    async function fetchData() {
      showLoading(true)
      const entityMetaData = await getAPIData(
        APIEndPoints.GetEntity.method,
        `${APIEndPoints.GetEntity.url}?$expand=EntityField`
      )

      if (entityMetaData.status === 200) {
        // dispatch({
        //   type: 'SET_ENTITYMETADATA',
        //   entityMetaData: entityMetaData.data.value,
        // })
        let Getresponce = ''
        const propertyType =
          editorData.propertyEditorType === 'grid' ? 'List' : 'ListColumn'
        if (editorData.propertyEditorType)
          Getresponce = await getAPIData(
            APIEndPoints.GetEntityFields.method,
            `${APIEndPoints.GetEntityFields.url}?$expand=Entity,EntityFieldDataType,OptionSet($expand=OptionSetOptions)&$filter=Entity/Name eq '${propertyType}'`
          )

        if (Getresponce.data.value) {
          // const Lookupvalue = await LookupFiltervalue(Getresponce.data.value)

          const Lookupvalue = Getresponce.data.value

          let propertiesData = injectPropertyComponent(
            Lookupvalue,
            entityMetaData.data.value
          )

          if (editorData.propertyEditorType !== 'grid')
            propertiesData = utils.swapItemsBasedOnCriteria(
              propertiesData,
              { Name: 'Caption' },
              0
            )

          dispatch({
            type: 'SET_PROPERTYDATA',
            propertiesData,
          })
        }

        showLoading(false)
      }
    }
    fetchData()
  }, [editorData.propertyEditorType])

  const { showProperties, propertiesData } = state

  return (
    // Todo: Refactor Suspense to a seperate component
    <Suspense fallback={<FFSpinner />}>
      <div className="entitygrid-designer__properties">
        <div className="entitygrid-designer__properties_header">
          <span className="entitygrid-designer__properties_title">
            {editorData.propertyEditorType === 'grid'
              ? 'Grid settings'
              : 'Column settings'}
          </span>
        </div>
        {editorData.propertyEditorType === 'grid' ? (
          <FFButton
            id="btn_addfilter"
            CSSClass="btn_addfilter"
            className="btn_addfilter"
            type="button"
            Field={{
              FieldValue: 'Add Filter',
              FieldLabel: 'Add Filter',
              CSSClass: '',
            }}
            onClickHandler={() => dispatch({ type: 'SHOW_POPUP' })}
          />
        ) : (
          ''
        )}
        {showProperties &&
          propertiesData &&
          propertiesData.map((property) => {
            if (!property?.IsVisibleInUI) return null

            let fieldValue = ''
            let editingColumnIndex = -1

            if (editorData.propertyEditorType === 'grid')
              fieldValue = editorData.gridProperties[property.Name]
            else {
              editingColumnIndex = editorData.columnProperties.findIndex(
                (columnProp) =>
                  columnProp.EntityFieldId === editorData.propertyEditingColumn
              )

              if (editingColumnIndex >= 0)
                fieldValue =
                  editorData.columnProperties[editingColumnIndex][property.Name]
            }

            return (
              <>
                {property.Name !== 'LargeIconName' &&
                property.Name !== 'IconField' ? (
                  <property.EntityFieldDataType.DynamicComponent
                    key={`${property.Id}`}
                    Field={getFieldProperties(
                      property,
                      editorData.currentEntityField
                    )}
                    value={fieldValue}
                    onChangeHandler={onPropertyValueChageHandler}
                    variant="filled"
                  />
                ) : (
                  <FFAutocomplete
                    key={`${property.Id}`}
                    Field={getFieldProperties(
                      property,
                      editorData.currentEntityField
                    )}
                    value={fieldValue}
                    onChangeHandler={onPropertyValueChageHandler}
                    variant="filled"
                  />
                )}
              </>
            )
          })}

        <CRUDModal open={showModal} width="80%">
          <CRUDModal.Header>
            <CRUDModal.Title>Add Filter</CRUDModal.Title>
            <CRUDModal.Close
              onClick={() =>
                dispatch({
                  type: 'HIDE_POPUP',
                  //  Data: editorData.gridProperties,
                })
              }
            >
              <CloseIcon />
            </CRUDModal.Close>
          </CRUDModal.Header>
          <CRUDModal.Content>
            <FilterDesigner
              EntityData={editorData.entity}
              QueryData={
                editorData.gridProperties &&
                editorData.gridProperties.Filter &&
                JSON.parse(editorData.gridProperties.Filter)
              }
              handleClick={onhandleClick}
            />
          </CRUDModal.Content>
          {/* <CRUDModal.Footer>
            <FFButton
              variant="contained"
              Field={{
                FieldValue: 'Save',
                FieldLabel: `Save`,
                CSSClass: 'savebutton',
                Type: 'primary',
              }}
              disableRipple
              disableElevation
              onClickHandler={() =>
                dispatch({
                  type: 'Save_Data',
                })
              }
              // onClickHandler={onSaveClickHandler}
            />

            <FFButton
              Field={{
                FieldValue: 'Cancel',
                FieldLabel: `Cancel`,
                CSSClass: 'Cancelbutton',
                Type: 'secondary',
              }}
              CSSClass="Cancel"
              variant="contained"
              id="AddField_Btn_Close"
              className="AddField_Btn_Close"
              onClickHandler={() =>
                dispatch({
                  type: 'HIDE_POPUP',
                })
              }
            />
          </CRUDModal.Footer> */}
        </CRUDModal>
      </div>
    </Suspense>
  )
}

DesignerProperties.propTypes = {
  designerData: PropTypes.shape({
    gridDatasource: {},
    propertyEditorType: PropTypes.oneOf(['grid', 'column']),
    entity: PropTypes.string.isRequired,
    title: PropTypes.string,
  }).isRequired,
  designerDataModifier: PropTypes.func.isRequired,
}

export default DesignerProperties
