/* eslint-disable */
import React, { useState } from 'react'
import {
  SaveSharp as SaveSharpIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
} from '@material-ui/icons'
import _ from 'lodash'
import useAppContext from '../../hooks/useToast'
import getAPIData, { getCoreData } from '../../../../models/api/api'
import APIEndPoints from '../../../../models/api/apiEndpoints'
import componentLookup from '../../../../utils/componentLookup'
// import FormColumns from './FormColumns/FormColumns'

import utils from '../../../../utils/utils'
import FFTextBox from '../../base/FFTextBox/FFTextBox'
import SysListGrid from '../SysListGrid/SysListGrid'
import TimeLinetab from '../TimeLine/TimeLinetab/TimeLinetab'
import Activity from '../Attachments/Activity'
import Payment from '../Payments/Payments'
import FFButton from '../../base/FFButton/FFButton'
import CRUDModal from '../CRUDModal/CRUDModal'
import FormTabs from '../../custom/FormTabs/FormTabs'
import './FullPopupFormViewer.css'
import FFAutocomplete from '../../base/FFAutocomplete/FFAutocomplete'
import { useMutation, useQuery, useQueryClient } from 'react-query'
function formViewerReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEWERDATASOURCE':
      return { ...state, formViewerDatasource: action.formViewerDatasource }
    case 'SET_FIELDDATATYPES':
      return { ...state, fieldDataTypes: action.fieldDataTypes }
    case 'UPDATE_FORMVAlUES':
      return {
        ...state,
        formValues: { ...state.formValues, ...action.formValues },
      }
    case 'SET_APIDATA':
      return { ...state, apiData: action.apiData }
    case 'SET_Entitiesdataitems':
      return {
        ...state,
        Entitiesdataitems: action.Entitiesdataitems,
      }
    case 'SET_CASCADING':
      return {
        ...state,
        Cascadingdatas: { ...state.Cascadingdatas, ...action.Cascadingdatas },
        formValues: { ...state.formValues, ...action.formValues },
      }
    case 'SET_CascadingFields':
      return {
        ...state,
        CascadingFields: [...state.CascadingFields, ...action.CascadingFields],
      }
    case 'SET_UserSelectabledata':
      return {
        ...state,
        userSelectable_datasource: action.userSelectable_datasource,
      }
    case 'SET_UserSelectable':
      return {
        ...state,
        userSelectable: action.userSelectable,
      }
    case 'SET_UserSelectabledisable':
      return {
        ...state,
        userSelectabledisable: action.userSelectabledisable,
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const FullPopupFormViewer = ({
  CancelFormHandler,
  SaveFormHandler,
  showModal,
  editData,
  history,
}) => {
  const initialState = {
    formViewerDatasource: null,
    fieldDataTypes: [],
    formValues: {},
    apiData: {},
    entitiesdataitems: {},
    CascadingFields: [],
    Cascadingdatas: {},
    userSelectable_datasource: [],
    userSelectable: '',
    userSelectabledisable: true,
  }
  let statusValue = ''
  let invalidDataFlag = 0
  const queryClient = useQueryClient()
  // const queryParams = queryString.parse(location.search)
  const queryentityName = editData && editData.entityName // React.useRef(queryParams.entityName)
  const queryentityId = editData && editData.entityId // React.useRef(queryParams.entityId)
  const querylistId = editData && editData.listId // React.useRef(queryParams.listId)

  const [state, dispatch] = React.useReducer(formViewerReducer, initialState)
  const { showToastMessage, showLoading, userId } = useAppContext()

  async function getEntitydatas(entityName, dataId) {
    const formdata = await getCoreData('get', `/api/${entityName}(${dataId})`)
    return formdata
  }

  function onDropClickHandler(event, params) {
    dispatch({
      type: 'SET_UserSelectable',
      userSelectable: params.value,
    })
    const selectedentity = state.userSelectable_datasource.find(
      (item) => item.id === params.value
    )
    dispatch({
      type: 'SET_Entitiesdataitems',
      Entitiesdataitems: JSON.parse(selectedentity.FormJSON),
    })
  }

  const ListItems = useQuery(
    ['ListItems', `sysList`],
    () =>
      getCoreData(
        APIEndPoints.GetSysList.method,
        APIEndPoints.GetSysList.url
      ).then((response) => {
        return response.data
      }),
    {
      enabled: queryentityName?.toLowerCase() === 'menuitem',
    }
  )

  function AppendMenuUrl(obj) {
    const listId = _.find(Object.entries(obj), ([key]) => {
      return key.toLowerCase() === 'list'
    })[1]

    let newValue = null
    let sysList = null
    const entries = Object.entries(obj)
    return entries.reduce((acc, [key, value]) => {
      if (
        typeof value === 'string' &&
        key.toLowerCase() === 'menuurl' &&
        listId
      ) {
        if (value.indexOf('?') > -1) {
          sysList =
            ListItems.data && ListItems.data.find((list) => list.id === listId)
          newValue = sysList
            ? `/list/${sysList?.SysEntity}?listId=${listId}`
            : value
        } else newValue = value
      } else {
        newValue = value
      }
      acc = {
        ...acc,
        [key]: newValue,
      }

      return acc
    }, {})
  }

  async function submitDataSwap(entityName, dataId) {
    const formData = await getEntitydatas(entityName, dataId)

    if (formData.data.length !== 0) {
      let oldformData = { ...formData.data[0] }
      let newformData = { ...state.formValues }
      let formDatas = {}
      invalidDataFlag = 0

      /** Here checking for Point,Polygon,LineString Data type and convert Array data to String-- Start */
      const oldformDataClone = _.cloneDeep(oldformData)

      Object.entries(oldformDataClone).forEach(([key, value]) => {
        const filterdata = state.apiData?.entityData?.EntityField.find(
          (itemIN) => itemIN.Name === key
        )

        if (
          filterdata?.EntityFieldDataType?.Id ===
            'a9c5c8aa-16c0-48d1-f911-08d8fda71e06' ||
          filterdata?.EntityFieldDataType?.Id ===
            '0fe8ab72-b0e5-49fb-f912-08d8fda71e06' ||
          filterdata?.EntityFieldDataType?.Id ===
            'eef33ba4-21ba-43f2-f913-08d8fda71e06'
        ) {
          oldformDataClone[key] = JSON.stringify(
            value?.coordinates ? value?.coordinates : value || ''
          )
        }
      })

      oldformData = oldformDataClone
      /** Here checking for Point,Polygon,LineString Data type and convert Array data to String -- End */

      /** Here checking for Point,Polygon,LineString Data type and convert Array data to String-- Start */
      const newformDataClone = _.cloneDeep(newformData)

      Object.entries(newformDataClone).forEach(([key, value]) => {
        const filterdata = state.apiData?.entityData?.EntityField.find(
          (itemIN) => itemIN.Name === key
        )

        if (
          filterdata?.EntityFieldDataType?.Id ===
            'a9c5c8aa-16c0-48d1-f911-08d8fda71e06' ||
          filterdata?.EntityFieldDataType?.Id ===
            '0fe8ab72-b0e5-49fb-f912-08d8fda71e06' ||
          filterdata?.EntityFieldDataType?.Id ===
            'eef33ba4-21ba-43f2-f913-08d8fda71e06'
        ) {
          newformDataClone[key] = JSON.stringify(
            value?.coordinates ? value?.coordinates : value || ''
          )
        }
      })

      newformData = newformDataClone
      /** Here checking for Point,Polygon,LineString Data type and convert Array data to String -- End */

      const obj = Object.entries(oldformData)
      obj.forEach(([key]) => {
        if (typeof oldformData[key] === typeof newformData[key]) {
          formDatas = Object.assign(formDatas, { [key]: newformData[key] })
        } else {
          formDatas = Object.assign(formDatas, { [key]: oldformData[key] })
        }
      })
      const obj2 = Object.entries(newformData)
      obj2.forEach(([key]) => {
        if (typeof oldformData[key] === 'undefined') {
          formDatas = Object.assign(formDatas, { [key]: newformData[key] })
        }
      })

      let postData = {
        ...utils.removeKeyFromObject(formDatas, [
          '_attachments',
          '_etag',
          '_rid',
          '_self',
          '_ts',
          'CreatedOn',
          'LastUpdatedDate',
          entityName.toLowerCase() === 'menuitem' ? '' : 'List',
          queryentityName,
        ])[0],
      }

      /** Here checking for Point,Polygon,LineString Data type and convert Array data-- Start */
      Object.entries(postData).forEach(([key, value]) => {
        const filterdata = state.apiData?.entityData?.EntityField.find(
          (item1) => item1.Name === key
        )
        if (
          filterdata?.EntityFieldDataType?.Id ===
            'a9c5c8aa-16c0-48d1-f911-08d8fda71e06' ||
          filterdata?.EntityFieldDataType?.Id ===
            '0fe8ab72-b0e5-49fb-f912-08d8fda71e06' ||
          filterdata?.EntityFieldDataType?.Id ===
            'eef33ba4-21ba-43f2-f913-08d8fda71e06'
        ) {
          let obj = []

          let curValue = value
            .replace(/\//g, '')
            .replace(/\s+/g, '')
            .replace(/""/g, '')

          if (curValue.trim() !== '') {
            try {
              obj = JSON.parse(JSON.parse(curValue))
            } catch (error) {
              invalidDataFlag = 1
              showToastMessage('Invalid data', 'error')
            }
          }
          postData = { ...postData, [key]: obj }
        }
        if (postData[key] === 'Select') {
          // delete postData[key]
          postData = { ...postData, [key]: null }
        }
        if (entityName.toLowerCase() === 'menuitem') {
          postData = AppendMenuUrl(postData)
        }
      })
      /** Here checking for Point,Polygon,LineString Data type and convert Array data-- End */

      return postData
    }
    return null
  }

  async function onSaveClickHandler() {
    // showLoading(true)
    const postData = await submitDataSwap(queryentityName, queryentityId)
    if (invalidDataFlag === 0) {
      SaveFormHandler(postData)
    }
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

  function getCascadingProperties(params) {
    const cascadingEntityFields = state.apiData.allEntities.find(
      (entity) => entity.Id === params.cascadingEntity
    )
    const cascadingBasedOn = cascadingEntityFields.EntityField.find(
      (entityField) => entityField.Id === params.CascadingEntityColumn
    )
    const filterProperty = params.lookupEntity.EntityField.find(
      (entityField) =>
        entityField.Id.toLowerCase() ===
        params.CascadingParentEntityField.toLowerCase()
    )

    return {
      cascadingBasedOn: cascadingBasedOn?.Name,
      filterProperty: filterProperty?.Name,
    }
  }
  function getDataSourceUrl(entityFieldProps) {
    if (entityFieldProps?.CascadingEntityColumn) {
      const lookupEntity = state.apiData.allEntities.find(
        (entity) => entity.Id === entityFieldProps.Lookup
      )

      const cascadingProperties = getCascadingProperties({
        CascadingEntityColumn: entityFieldProps?.CascadingEntityColumn,
        CascadingParentEntityField:
          entityFieldProps?.CascadingParentEntityField,
        cascadingEntity: entityFieldProps.EntityId,
        lookupEntity,
      })

      if (state.formValues[cascadingProperties.cascadingBasedOn])
        return `/api/${entityFieldProps.lookupEntityName}?$filter=${
          cascadingProperties.filterProperty
        } eq ${state.formValues[cascadingProperties.cascadingBasedOn]}`

      return `/api/${entityFieldProps.lookupEntityName}?$filter=${cascadingProperties.filterProperty} eq ''`
    }

    let lookupfieldfilterURL = ''
    if (entityFieldProps?.lookupfieldfilter) {
      lookupfieldfilterURL = `${entityFieldProps.lookupEntityName}?${entityFieldProps.lookupfieldfilter}`
    } else {
      lookupfieldfilterURL = `${entityFieldProps.lookupEntityName}`
    }

    if (
      entityFieldProps?.Name.toLowerCase() === 'parentmenuitem' &&
      queryentityName?.toLowerCase() === 'menuitem' &&
      state.formValues?.MenuType != ''
    ) {
      lookupfieldfilterURL =
        state.formValues?.MenuType?.toLowerCase() === 'item'
          ? `${entityFieldProps.lookupEntityName}?$filter=MenuType eq 'NavSection'`
          : state.formValues?.MenuType?.toLowerCase() === 'navsection'
          ? `${entityFieldProps.lookupEntityName}?$filter=MenuType eq 'NavGroup'`
          : ''
    }

    return `/api/${lookupfieldfilterURL || ''}`
  }

  function injectDatatypeComponent(entitySchema) {
    let lookupEntity = null
    let lookupEntityTextField = null

    return entitySchema.reduce((prev, curr) => {
      if (
        state.apiData?.allEntities &&
        curr.EntityFieldDataType.Name === 'Lookup'
      ) {
        lookupEntity = state.apiData.allEntities.find(
          (entity) => entity.Id === curr.Lookup
        )
        lookupEntityTextField = lookupEntity?.EntityField?.find(
          (entityField) =>
            entityField.Id.toLowerCase() === curr.LookupTextField.toLowerCase()
        )?.Name
      }

      // return {
      //   ...prev,
      //   [curr.Name]: {
      //     ...curr,
      //     Component:
      //       componentLookup[curr.EntityFieldDataType.Name]?.component ||
      //       FFTextBox,
      //     lookupEntityName: lookupEntity?.Name || '',
      //     lookupEntityTextField,
      //   },
      // }
      return {
        ...prev,
        [curr.Name]: {
          ...curr,
          Component:
            componentLookup[curr.EntityFieldDataType.Name]?.component ||
            FFTextBox,
          lookupEntityName: lookupEntity?.Name || '',
          lookupEntityTextField,
        },
      }
    }, {})
  }

  function onFormValueChangeHandler(event, propertyName) {
    dispatch({
      type: 'UPDATE_FORMVAlUES',
      formValues: {
        [propertyName.id]:
          event && event.target.type === 'number'
            ? parseFloat(propertyName.value)
            : propertyName.value,
      },
    })
  }

  function renderCustomComponent(sectionData) {
    switch (sectionData.Properties.Name) {
      case 'Grid':
        return (
          <SysListGrid
            sysListId={sectionData.Properties.ListId}
            sysParentEntityId={queryentityId} // location.state.dataId}
            sysParentEntityType={queryentityName}
          />
        )
      case 'Activity':
        return (
          <Activity
            sysParentEntityId={queryentityId} // {location.state.dataId}
            sysParentEntityType={queryentityName}
          />
        )
      case 'Payment':
        return (
          <Payment
            sysParentEntityId={queryentityId} // {location.state.dataId}
            sysParentEntityType={queryentityName}
            sysListColumnId={querylistId} // {location.state.sysListColumnId}
          />
        )
      case 'Timeline':
        return (
          <TimeLinetab
            state={[
              {
                showUpcomming: sectionData.Properties.ShowUpComing,
                showPast: sectionData.Properties.ShowPast,
                upcommingItems: sectionData.Properties.UpComingItems,
                pastItems: sectionData.Properties.PastItems,
              },
            ]}
            sysParentEntityId={queryentityId} // {location.state.dataId}
            sysParentEntityType={queryentityName}
          />
        )
      default:
        return null
    }
  }

  function getFieldProperties(control, entityProps) {
    const OptionSet = entityProps.OptionSet?.OptionSetOptions
    OptionSet?.unshift({
      Name: 'Select',
      Value: 'Select',
    })
    /// removing dupication
    const OptionSetOptions = [
      ...new Map(
        OptionSet?.map((item) => [JSON.stringify(item), item])
      ).values(),
    ]

    switch (entityProps.EntityFieldDataType.Name) {
      case 'DecimalNumber':
      case 'WholeNumber':
        return {
          FieldValue: control.Properties.Name,
          DefaultValue: '',
          Datasource: OptionSetOptions,
          TextField: 'Name',
          ValueField: 'Value',
          FieldLabel: entityProps.DisplayName,
          Type: 'number',
        }
      // case 'Lookup':
      //   return {
      //     FieldValue: control.Properties.Name,
      //     DefaultValue: state.formValues[control.Properties.Name],
      //     DatasourceURL:
      //       typeof state.Cascadingdatas[
      //         `${control.Properties.Name}_dataSourceURL`
      //       ] === 'undefined'
      //         ? dataSourceURL
      //         : state.Cascadingdatas[
      //             `${control.Properties.Name}_dataSourceURL`
      //           ],
      //     // `/api/${entityProps.lookupEntityName || ''}`
      //     TextField: entityProps.lookupEntityTextField,
      //     ValueField: 'id',
      //     FieldLabel: entityProps.DisplayName,
      //     Type: 'number',
      //   }
      case 'Lookup':
        // Headerdata =
        //   state.Headerdata &&
        //   state.Headerdata.filter(
        //     (item) =>
        //       item.FieldName.toLowerCase() ===
        //       control.Properties.Name.toLowerCase()
        //   )

        return {
          FieldValue: control.Properties.Name,
          DatasourceURL: getDataSourceUrl(entityProps), // `/api/${entityProps.lookupEntityName || ''}`,  entityProps.LookupFilter
          TextField: entityProps.lookupEntityTextField || 'id',
          ValueField: 'id',
          FieldLabel: entityProps.DisplayName,
          Type: 'number',
          postBody: {
            queryOptions: null,
            freeFlowFilter: entityProps?.LookupFilter
              ? JSON.parse(entityProps?.LookupFilter)
              : null,
          },
          // header:
          //   entityProps?.LookupFilter && entityProps.LookupFilter !== null
          //     ? {
          //         EntityFieldId: entityProps.Id,
          //         IsLookupFilter: 'true',
          //         ParentEntityName: control.Properties.Entity,
          //       }
          //     : '',
          // Header: !_.isEmpty(Headerdata) ? Headerdata[0] : null,
        }
      case 'Point':
      case 'LineString':
      case 'Polygon':
        return {
          FieldValue: control.Properties.Name,
          DefaultValue: '',
          Datasource: OptionSetOptions,
          TextField: 'Name',
          ValueField: 'Value',
          FieldLabel: entityProps.DisplayName,
          Type: 'text',
        }

      default:
        return {
          FieldValue: control.Properties.Name,
          DefaultValue: '',
          Datasource: OptionSetOptions,
          TextField: 'Name',
          ValueField: 'Value',
          FieldLabel: entityProps.DisplayName,
          Type: 'text',
          Disabled: !!(
            control.Properties.Name === 'CreatedOn' ||
            control.Properties.Name === 'LastUpdatedDate'
          ),
        }
    }
  }

  React.useEffect(() => {
    async function fetchData() {
      showLoading(true)
      let casecadinglist = []
      const postdata = {
        SysEntity: queryentityName,
        SysEntityId: queryentityId,
      }
      const formSchema = await getCoreData(
        APIEndPoints.GetSysFormById.method,
        `${APIEndPoints.GetSysFormById.url}?$orderby=Order asc &$filter=UserSelectable eq 'True'`,
        postdata
      )
        .then((res) => res)
        .catch((err) => {
          const errorMessage = JSON.stringify(err?.response?.data?.Message)
          showToastMessage(errorMessage, 'error')
          CancelFormHandler((FullPopupFormViwerModal.style.display = 'none'))
        })

      if (formSchema && formSchema?.data.length !== 0) {
        if (formSchema.data.length > 1)
          dispatch({
            type: 'SET_UserSelectabledisable',
            userSelectabledisable: false,
          })
        const Entitiesdataitems = _.isEmpty(state.Entitiesdataitems)
          ? JSON.parse(formSchema.data[0].FormJSON)
          : state.Entitiesdataitems

        dispatch({
          type: 'SET_UserSelectabledata',
          userSelectable_datasource: formSchema.data,
        })
        dispatch({
          type: 'SET_UserSelectable',
          userSelectable: _.isEmpty(state.userSelectable)
            ? formSchema.data[0].id
            : state.userSelectable,
        })

        let strentityNames = ''
        let formData = []
        if (!_.isEmpty(Entitiesdataitems)) {
          if (Entitiesdataitems.Entities.length > 1) {
            Entitiesdataitems.Entities.forEach((entityDataItem) => {
              strentityNames += `'${entityDataItem}',`
            })
            // ----removing last comma
            strentityNames = strentityNames.replace(/,\s*$/, '')
            // ----removing quotes
            let expanddata = `$expand=${strentityNames.replace(/['"]+/g, '')}`
            // ----removing baseentity
            // expanddata = expanddata.replace(
            //   `${Entitiesdataitems.BaseEntity},`,
            //   ''
            // )
            let arr_expanddata = expanddata.split(',')
            if (arr_expanddata.length > 1) {
              expanddata = expanddata.replace(
                `${Entitiesdataitems.BaseEntity},`,
                ''
              )
            } else {
              expanddata = expanddata.replace(
                `${Entitiesdataitems.BaseEntity}`,
                ''
              )
            }

            formData = await getCoreData(
              'get',
              `/api/${queryentityName}(${queryentityId})?${expanddata}`
            )
          } else {
            formData = await getEntitydatas(queryentityName, queryentityId)
          }
          // TODO : Optionset changes
          let formValues = formData.data[0]
          formValues =
            formValues &&
            Object.entries(formValues).reduce((prev, [key, value]) => {
              if (typeof value === 'object' && value?.OptionSetId)
                return { ...prev, [key]: value.Id }
              return { ...prev, [key]: value }
            }, {})

          const EntitiesItems = []
          Entitiesdataitems.Entities.forEach((item) => {
            if (typeof formValues[item] === 'object') {
              if (formValues[item].length === 0) {
                EntitiesItems.push(item)
              }
            }
          })
          dispatch({
            type: 'UPDATE_FORMVAlUES',
            formValues: utils.removeKeyFromObject(
              formValues,
              EntitiesItems
              // Entitiesdataitems.Entities
            )[0],
          })

          dispatch({
            type: 'SET_VIEWERDATASOURCE',
            formViewerDatasource: Entitiesdataitems, // JSON.parse(formSchema.data[0].FormJSON),
          })

          strentityNames =
            strentityNames !== '' ? strentityNames : `'${queryentityName}'`

          const casecadingAPICall = await getAPIData(
            APIEndPoints.GetEntity.method,
            `${APIEndPoints.GetEntity.url}?$filter=Name eq '${queryentityName}'&$expand=EntityField`
          ).then((response) => response.data.value[0])

          Promise.all([
            getAPIData(
              APIEndPoints.GetEntity.method,
              `${APIEndPoints.GetEntity.url}?$filter=Name in (${strentityNames})&$expand=EntityField($expand=entityfielddatatype,optionset($expand=optionsetoptions))`
            ),
            getAPIData(
              APIEndPoints.GetEntity.method,
              `${APIEndPoints.GetEntity.url}?$expand=EntityField`
            ),
          ]).then(([entityData, allEntities]) => {
            let EntityFieldDataItems = []
            entityData.data.value.forEach((entityDataItem) => {
              EntityFieldDataItems = [
                ...EntityFieldDataItems,
                ...entityDataItem.EntityField,
              ]
            })
            entityData.data.value[0].EntityField = EntityFieldDataItems

            dispatch({
              type: 'SET_APIDATA',
              apiData: {
                entityData: entityData.data.value[0],
                allEntities: allEntities.data.value,
              },
            })
            // dispatch({
            //   type: 'SET_CASCADING',
            //   OrganisationId: null,
            //   ContractId: null,
            // })

            const formValuesClone = _.cloneDeep(formValues)

            Object.entries(formValuesClone).forEach(([key, value]) => {
              const filterdata = entityData?.data?.value[0]?.EntityField.find(
                (itemIN) => itemIN.Name === key
              )

              if (
                filterdata?.EntityFieldDataType?.Id ===
                  'a9c5c8aa-16c0-48d1-f911-08d8fda71e06' ||
                filterdata?.EntityFieldDataType?.Id ===
                  '0fe8ab72-b0e5-49fb-f912-08d8fda71e06' ||
                filterdata?.EntityFieldDataType?.Id ===
                  'eef33ba4-21ba-43f2-f913-08d8fda71e06'
              ) {
                formValuesClone[key] = JSON.stringify(
                  value?.coordinates ? value?.coordinates : value || ''
                )
              }
            })

            dispatch({
              type: 'UPDATE_FORMVAlUES',
              formValues: formValuesClone,
            })

            // ********************* Here Set API Header form sysMenuItem IconFileld Load -- Start ***********************************************************

            // let entityField = casecadingAPICall.EntityField
            // entityField = entityField
            //   .filter(function (item) {
            //     return item.Name.toLowerCase() == 'iconfield'
            //   })
            //   .map(function ({ Id, Name, LookupFilter }) {
            //     return { Id, Name, LookupFilter }
            //   })

            // let header = []

            // if (
            //   entityField &&
            //   entityField[0]?.LookupFilter != '' &&
            //   entityData?.data?.value[0].Name.toLowerCase() === 'menuitem'
            // ) {
            //   header = [
            //     {
            //       EntityFieldId: entityField[0].Id,
            //       IsLookupFilter: true,
            //       ParentEntityName:
            //         entityData && entityData?.data?.value[0].Name,
            //       FieldName: entityField[0].Name,
            //     },
            //   ]

            //   dispatch({
            //     type: 'SET_Headerdata',
            //     Headerdata: header,
            //   })
            // }
            // ********************* Here Set API Header form sysMenuItem IconFileld Load -- End ***********************************************************
          })
        }
      }
      // else {
      //   showToastMessage(`Form doesn't match with the criteria.`, 'error')
      //   CancelFormHandler((FullPopupFormViwerModal.style.display = 'none'))
      // }

      showLoading(false)

      // contract, user, type, case
    }
    fetchData()
  }, [state.Entitiesdataitems])

  // React.useEffect(() => {
  //   const { entityData } = state.apiData
  //   if (entityData) {
  //     const injectedDatatypeComponent = injectDatatypeComponent(
  //       entityData.EntityField
  //     )

  //     dispatch({
  //       type: 'SET_FIELDDATATYPES',
  //       fieldDataTypes: injectedDatatypeComponent,
  //     })
  //   }
  // }, [state.apiData])
  const mutationUserFavourites = useMutation(
    (mutationData) => {
      return getCoreData(
        APIEndPoints.UserFavourites.method,
        APIEndPoints.UserFavourites.url,
        mutationData
      )
    },
    {
      onMutate: () => {
        showLoading(true)
      },
      onSuccess: (response) => {
        showLoading(false)
      },
      onError: (err) => {
        showToastMessage(JSON.stringify(err?.response?.data), 'error')
        showLoading(false)
      },
      onSettled: () => {
        showLoading(false)
        queryClient.invalidateQueries('isRecentitem')
        queryClient.invalidateQueries('pinnedData')
      },
    }
  )
  const UserFavourites = (editData) => {
    getAPIData(
      'get',
      `${APIEndPoints.GetEntity.url}?$filter=Name eq '${editData?.entityName}'&$expand=entityfield($expand=entityfielddatatype)`
    ).then((response) => {
      const Result = response.data.value[0]?.EntityField.find(
        (item) => item.IsDisplayName === true
      )
      const postData = {
        User: userId,
        sysParentEntityType: editData?.entityName,
        sysParentEntityID: editData?.entityId,
        UserFavouritesType: 'History',
        Organisation: editData.data && editData?.data?.Organisation[0]?.id,
        EntityDisplayText: Result?.DisplayName || '',
      }
      mutationUserFavourites.mutate(postData)
    })
  }

  React.useEffect(() => {
    async function fetchData() {
      const { entityData } = state.apiData

      if (entityData) {
        if (userId) UserFavourites(editData)
        // const injectedDatatypeComponent12 = await LookupFiltervalue(
        //   entityData.EntityField
        // )

        const injectedDatatypeComponent = injectDatatypeComponent(
          //injectedDatatypeComponent12
          entityData.EntityField
        )
        dispatch({
          type: 'SET_FIELDDATATYPES',
          fieldDataTypes: injectedDatatypeComponent,
        })
      }
    }
    fetchData()
  }, [state.apiData])

  const { formViewerDatasource, fieldDataTypes, formValues } = state

  function nonEntityFieldValue(Entity, Field) {
    if (Field === 'Id') Field = 'id'
    if (formValues[Entity] && formValues[Entity].length) {
      return formValues[Entity][0][Field]
    }
    return ''
  }

  // const fieldURL = window.open(`/formViewer?entityName=${queryentityName}&entityId=${queryentityId}&listId=${querylistId}`, '', 'fullscreen=yes,scrollbars=yes')
  const fieldURL = `/formViewer?entityName=${queryentityName}&entityId=${queryentityId}&listId=${querylistId}`

  if (!formViewerDatasource) return null

  return (
    <>
      <div className="FullPopupFormViwer" id="FullPopupFormViwerModal">
        <div className="FullPopupFormViewer_Modal">
          <CRUDModal
            open={showModal}
            width="96%"
            top="30px"
            right="2%"
            bottom="3%"
          >
            <CRUDModal.Header>
              <CRUDModal.Title>
                {formViewerDatasource.header.Properties.HeaderName}
                <div className="fullpopup_subtitle1">
                  <div className="fullpopup_subtitle">
                    {formViewerDatasource.header.Properties.Subtitle}
                  </div>
                  <div className="Fullpopup_autocomplete">
                    <FFAutocomplete
                      Field={{
                        FieldValue: 'UserSelectable',
                        DefaultValue: '',
                        // FieldLabel: 'Form List',
                        Datasource: state.userSelectable_datasource,
                        TextField: 'FormName',
                        ValueField: 'id',
                      }}
                      value={state.userSelectable}
                      onChangeHandler={onDropClickHandler}
                    />
                  </div>
                </div>
              </CRUDModal.Title>
              <div className="fullpopupform_expand">
                <CRUDModal.Close onClick={CancelFormHandler}>
                  <a href={fieldURL} target="_blank">
                    <OpenInNewIcon />
                  </a>
                </CRUDModal.Close>
              </div>
              <CRUDModal.Close onClick={CancelFormHandler}>
                <CloseIcon />
              </CRUDModal.Close>
            </CRUDModal.Header>
            <CRUDModal.Content>
              <FormTabs>
                <FormTabs.FormTabList>
                  {formViewerDatasource &&
                    formViewerDatasource.tabs.map((tab) => {
                      if (tab.Properties.Hide) return <></>
                      return (
                        <FormTabs.FormTab>
                          {tab.Properties.DisplayName}
                        </FormTabs.FormTab>
                      )
                    })}
                </FormTabs.FormTabList>
                <FormTabs.FormTabPanels>
                  {formViewerDatasource &&
                    formViewerDatasource.tabs.map((tab) => {
                      return (
                        <FormTabs.FormTabPanel>
                          <div
                            className="fullpopup_formcolumns"
                            style={{
                              gridTemplateColumns: `repeat(${tab.columns.length}, 1fr)`,
                            }}
                          >
                            {tab &&
                              tab.columns.map((column) => {
                                return (
                                  <div
                                    className="fullpopup_formsections"
                                    style={{
                                      width: `${
                                        column.Properties.Width || 100
                                      }%`,
                                    }}
                                  >
                                    {column &&
                                      column.sections.map((section) => {
                                        const propertyName =
                                          section && section?.Properties?.Name
                                        return (
                                          propertyName &&
                                          (propertyName !== 'Grid' ||
                                            section.Properties.ListId) && (
                                            <div
                                              className="fullpopup_section-columns"
                                              style={{
                                                gridTemplateColumns: `repeat(${section.sectionColumns.length}, 1fr)`,
                                              }}
                                            >
                                              {propertyName &&
                                                (propertyName === 'Grid' ||
                                                  propertyName === 'Activity' ||
                                                  propertyName === 'Timeline' ||
                                                  propertyName === 'Payment') &&
                                                renderCustomComponent(section)}
                                              {propertyName &&
                                                (propertyName !== 'Grid' ||
                                                  propertyName !== 'Activity' ||
                                                  propertyName !== 'Timeline' ||
                                                  propertyName === 'Payment') &&
                                                section.sectionColumns.map(
                                                  (sectionColumn) => {
                                                    return (
                                                      <div
                                                        className="fullpopup_section-column"
                                                        style={{
                                                          width: `${
                                                            sectionColumn
                                                              .Properties
                                                              .Width || 100
                                                          }%`,
                                                        }}
                                                      >
                                                        {sectionColumn &&
                                                          sectionColumn.elements.map(
                                                            (element) => {
                                                              if (
                                                                formViewerDatasource.BaseEntity ===
                                                                element
                                                                  .Properties
                                                                  .Entity
                                                              ) {
                                                                const elementObj =
                                                                  fieldDataTypes[
                                                                    element
                                                                      .Properties
                                                                      .Name
                                                                  ]
                                                                if (!elementObj)
                                                                  return null
                                                                const fieldValue =
                                                                  typeof formValues[
                                                                    element
                                                                      .Properties
                                                                      .Name
                                                                  ] === 'object'
                                                                    ? formValues[
                                                                        element
                                                                          .Properties
                                                                          .Name
                                                                      ].Id
                                                                    : formValues[
                                                                        element
                                                                          .Properties
                                                                          .Name
                                                                      ]
                                                                statusValue =
                                                                  fieldDataTypes
                                                                    ?.Status
                                                                    ?.Filters &&
                                                                  JSON.parse(
                                                                    fieldDataTypes
                                                                      .Status
                                                                      ?.Filters
                                                                  ).filters[0].value.toLowerCase()
                                                                return (
                                                                  <div
                                                                    className="form-element"
                                                                    style={{
                                                                      width: `${element.Properties.Width}%`,
                                                                    }}
                                                                  >
                                                                    {element.Properties.DisplayName.toLowerCase() ===
                                                                    'status' ? (
                                                                      <elementObj.Component
                                                                        label={
                                                                          element
                                                                            .Properties
                                                                            .DisplayName
                                                                        }
                                                                        Field={getFieldProperties(
                                                                          element,
                                                                          elementObj
                                                                        )}
                                                                        value={
                                                                          fieldValue ||
                                                                          ''
                                                                        }
                                                                        onChangeHandler={
                                                                          onFormValueChangeHandler
                                                                        }
                                                                        className={(() => {
                                                                          if (
                                                                            fieldValue?.toLowerCase() ===
                                                                            statusValue?.toLowerCase()
                                                                          ) {
                                                                            return 'FFDropdownstatus-onhold-outer'
                                                                          }

                                                                          // if (
                                                                          //   fieldValue ===
                                                                          //   'Open'
                                                                          // ) {
                                                                          //   return 'FFDropdownstatus-open-outer'
                                                                          // }
                                                                          // if (
                                                                          //   fieldValue ===
                                                                          //   'Closed'
                                                                          // ) {
                                                                          //   return 'FFDropdownstatus-closed-outer'
                                                                          // }
                                                                          // if (
                                                                          //   fieldValue ===
                                                                          //   'Pending'
                                                                          // ) {
                                                                          //   return 'FFDropdownstatus-pending-outer'
                                                                          // }
                                                                          // if (
                                                                          //   fieldValue ===
                                                                          //   'On Hold'
                                                                          // ) {
                                                                          //   return 'FFDropdownstatus-onhold-outer'
                                                                          // }
                                                                        })()}
                                                                      />
                                                                    ) : (
                                                                      <elementObj.Component
                                                                        label={
                                                                          element
                                                                            .Properties
                                                                            .DisplayName
                                                                        }
                                                                        Field={getFieldProperties(
                                                                          element,
                                                                          elementObj
                                                                        )}
                                                                        value={
                                                                          fieldValue ||
                                                                          ''
                                                                        }
                                                                        onChangeHandler={
                                                                          onFormValueChangeHandler
                                                                        }
                                                                      />
                                                                    )}
                                                                  </div>
                                                                )
                                                              }
                                                              if (
                                                                formViewerDatasource.BaseEntity !==
                                                                element
                                                                  .Properties
                                                                  .Entity
                                                              ) {
                                                                return (
                                                                  <div
                                                                    className="form-element"
                                                                    style={{
                                                                      width: `${element.Properties.Width}%`,
                                                                    }}
                                                                  >
                                                                    <componentLookup.Text.component
                                                                      label={`${element.Properties.DisplayName} (${element.Properties.Entity})`}
                                                                      value={
                                                                        formValues[
                                                                          element
                                                                            .Properties
                                                                            .Entity
                                                                        ]
                                                                          ? nonEntityFieldValue(
                                                                              element
                                                                                .Properties
                                                                                .Entity,
                                                                              element
                                                                                .Properties
                                                                                .Name
                                                                            )
                                                                          : ''
                                                                      }
                                                                      className="FormViewer_Field"
                                                                      Field={{
                                                                        FieldValue:
                                                                          'Name',
                                                                        FieldLabel: `${element.Properties.DisplayName} (${element.Properties.Entity})`,
                                                                        Validation:
                                                                          {
                                                                            IsRequired:
                                                                              'False',
                                                                          },
                                                                        Disabled: true,
                                                                      }}
                                                                    />
                                                                  </div>
                                                                )
                                                              }
                                                            }
                                                          )}
                                                      </div>
                                                    )
                                                  }
                                                )}
                                            </div>
                                          )
                                        )
                                      })}
                                  </div>
                                )
                              })}
                          </div>
                        </FormTabs.FormTabPanel>
                      )
                    })}
                </FormTabs.FormTabPanels>
              </FormTabs>
            </CRUDModal.Content>
            <div className="footer_fullPopupViewer">
              <CRUDModal.Footer>
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
                  className="PopupFormViewer_Btn_Save"
                  onClickHandler={onSaveClickHandler}
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
                  id="PopupFormViewer_Btn_Close"
                  className="PopupFormViewer_Btn_Close"
                  onClickHandler={CancelFormHandler}
                />
              </CRUDModal.Footer>
            </div>
          </CRUDModal>
        </div>
      </div>
    </>
  )
}

export default FullPopupFormViewer
