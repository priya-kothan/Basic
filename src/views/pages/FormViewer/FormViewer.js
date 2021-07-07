import React from 'react'
import {
  SaveSharp as SaveSharpIcon,
  ArrowBack as ArrowBackIcon,
} from '@material-ui/icons'
import _ from 'lodash'
import queryString from 'query-string'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import useActionFields from '../../components/hooks/useActionsFields'
import useAppContext from '../../components/hooks/useToast'
import usePageTitle from '../../components/hooks/usePageTitle'
import getAPIData, { getCoreData } from '../../../models/api/api'
import APIEndPoints from '../../../models/api/apiEndpoints'
import componentLookup from '../../../utils/componentLookup'
// import FormColumns from './FormColumns/FormColumns'
import FormTabs from '../../components/custom/FormTabs/FormTabs'
import utils from '../../../utils/utils'
import FFTextBox from '../../components/base/FFTextBox/FFTextBox'
import SysListGrid from '../../components/custom/SysListGrid/SysListGrid'
import TimeLinetab from '../../components/custom/TimeLine/TimeLinetab/TimeLinetab'
import Activity from '../../components/custom/Attachments/Activity'
import Payment from '../../components/custom/Payments/Payments'
import './FormViewer.css'

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
    case 'SET_Entitiesdataitems':
      return {
        ...state,
        Entitiesdataitems: action.Entitiesdataitems,
      }
    case 'SET_UserSelectabledisable':
      return {
        ...state,
        userSelectabledisable: action.userSelectabledisable,
      }
    case 'SET_Headerdata':
      return {
        ...state,
        Headerdata: [...state.Headerdata, ...action.Headerdata],
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const FormViewer = ({ history, location, match }) => {
  const initialState = {
    formViewerDatasource: null,
    fieldDataTypes: [],
    formValues: {},
    apiData: {},
    userSelectable_datasource: [],
    userSelectable: '',
    entitiesdataitems: {},
    userSelectabledisable: true,
    Headerdata: [],
  }
  let statusValue = ''
  let invalidDataFlag = 0
  const queryParams = queryString.parse(location.search)
  const queryentityName = React.useRef(queryParams.entityName)
  const queryentityId = React.useRef(queryParams.entityId)
  const querylistId = React.useRef(queryParams.listId)
  const queryClient = useQueryClient()
  if (queryentityId.current !== queryParams.entityId) {
    queryentityId.current = queryParams.entityId
    queryentityName.current = queryParams.entityName
    querylistId.current = queryParams.listId
  }

  const [state, dispatch] = React.useReducer(formViewerReducer, initialState)
  const { showToastMessage, showLoading, userId } = useAppContext()
  const { setActionFields } = useActionFields()
  const { setPageTitle } = usePageTitle()

  setPageTitle('Form Viewer')

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
      enabled: queryentityName.current?.toLowerCase() === 'menuitem',
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
    invalidDataFlag = 0
    const formData = await getEntitydatas(entityName, dataId)

    if (formData.data.length !== 0) {
      let oldformData = { ...formData.data[0] }
      let newformData = { ...state.formValues }

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

      let formDatas = {}
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

      // const EntityFieldList = state.apiData?.entityData?.EntityField.find(
      //   (item1) => item1.Name.toLowerCase() === 'list'
      // )

      // const EntityFieldMenuItem = state.apiData?.entityData?.EntityField.find(
      //   (item1) => item1.Name.toLowerCase() === 'menuitem'
      // )

      const removeKey = [
        '_attachments',
        '_etag',
        '_rid',
        '_self',
        '_ts',
        'CreatedOn',
        'LastUpdatedDate',
        entityName.toLowerCase() === 'menuitem' ? '' : 'List',
        entityName.toLowerCase() === 'menuitem' ? '' : 'MenuItem',
      ]

      let postData = {
        ...utils.removeKeyFromObject(formValues, removeKey)[0],
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
          if (value.trim() !== '') {
            try {
              obj = JSON.parse(value.replace(/\s+/g, ''))
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
    showLoading(true)
    const postData = await submitDataSwap(
      queryentityName.current,
      queryentityId.current
    )

    if (invalidDataFlag === 0) {
      getCoreData(
        'patch',
        `/api/${queryentityName.current}(${queryentityId.current})`,
        postData
      )
        .then(() => {
          if (queryentityName.current?.toLowerCase() === 'menuitem') {
            queryClient.invalidateQueries('navGroup')
            queryClient.invalidateQueries('navSectionandItemData')
          }

          showToastMessage('Saved successfully')
        })
        .catch((err) => {
          showLoading(false)
          // showToastMessage(err?.response?.data, 'error')
          const errormsg = err?.response?.data ? err?.response?.data : err || ''
          showToastMessage(
            errormsg[0]?.Message ? errormsg[0]?.Message : errormsg.Result || '',
            'error'
          )
        })
        .finally(() => {
          showLoading(false)
        })
    }
    showLoading(false)
  }

  const actionFields = [
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Label: 'Back to List',
        Icon: ArrowBackIcon,
        CSSName: '',
        onClick: () => history.goBack(),
      },
    },
    {
      actionComponent: componentLookup.Lookup,
      componentProps: {
        value: state.userSelectable,
        className: state.userSelectabledisable
          ? 'formviewer__UserSelectable_Displaynone'
          : 'formviewer__UserSelectable',
        Field: {
          FieldName: 'UserSelectable',
          FieldValue: 'UserSelectable',
          FieldLabel: 'FormList',
          FieldType: 'Dropdown',
          Placeholder: 'FormList',
          Datasource: state.userSelectable_datasource,
          TextField: 'FormName',
          ValueField: 'id',
        },
        onChangeHandler: onDropClickHandler,
      },
    },
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Icon: SaveSharpIcon,
        Label: 'Save',
        CSSName: 'formviewer__save',
        onClick: onSaveClickHandler,
      },
    },
  ]

  setActionFields({ actionFields, hideSearchBox: true, showBackButton: false })

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

  function getClearedCascadeDependentFields(sourceProperties, targetProperty) {
    if (!sourceProperties) return targetProperty

    const targetPropertyClone = _.cloneDeep(targetProperty)

    sourceProperties.forEach((field) => {
      targetPropertyClone[field.Name] = ''
    })

    return targetPropertyClone
  }

  function onFormValueChangeHandler(event, propertyName) {
    const cascadeDependentFields = utils.getCascadeDependentFields(
      propertyName.id,
      state.apiData.entityData.EntityField
    )

    const clearCascadeDependentFields = getClearedCascadeDependentFields(
      cascadeDependentFields,
      _.cloneDeep(state.formValues)
    )

    dispatch({
      type: 'UPDATE_FORMVAlUES',
      formValues: {
        ...clearCascadeDependentFields,
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
            sysParentEntityId={queryentityId.current} // location.state.dataId}
            sysParentEntityType={queryentityName.current}
          />
        )
      case 'Activity':
        return (
          <Activity
            sysParentEntityId={queryentityId.current} // {location.state.dataId}
            sysParentEntityType={queryentityName.current}
          />
        )
      case 'Payment':
        return (
          <Payment
            sysParentEntityId={queryentityId.current} // {location.state.dataId}
            sysParentEntityType={queryentityName.current}
            sysListColumnId={querylistId.current} // {location.state.sysListColumnId}
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
                // upcommingItems: {
                //   PhoneCall: true,
                //   All: true,
                //   Email: true,
                // },
                pastItems: sectionData.Properties.PastItems,
                // pastItems: {
                //   PhoneCall: true,
                //   Letter: true,
                //   All: true,
                //   Email: true,
                //   Task: true,
                // },
              },
            ]}
            sysParentEntityId={queryentityId.current} // {location.state.dataId}
            sysParentEntityType={queryentityName.current}
          />
        )
      default:
        return null
    }
  }

  function getCascadingProperties(params) {
    const cascadingEntityFields = state.apiData.allEntities.find(
      (entity) => entity.Id === params.cascadingEntity
    )
    const cascadingBasedOn = cascadingEntityFields.EntityField.find(
      (entityField) => entityField.Id === params.CascadingEntityColumn
    )
    const filterProperty = params.lookupEntity.EntityField.find(
      (entityField) => entityField.Id === params.CascadingParentEntityField
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
      queryentityName.current?.toLowerCase() === 'menuitem' &&
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

  function getFieldProperties(control, entityProps) {
    let Headerdata = ''

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
          className: 'Formviwer',
        }
      case 'Lookup':
        Headerdata =
          state.Headerdata &&
          state.Headerdata.filter(
            (item) =>
              item.FieldName.toLowerCase() ===
              control.Properties.Name.toLowerCase()
          )
        return {
          FieldValue: control.Properties.Name,
          DatasourceURL: getDataSourceUrl(entityProps), // `/api/${entityProps.lookupEntityName || ''}`,  entityProps.LookupFilter
          TextField: entityProps.lookupEntityTextField || 'id',
          ValueField: 'id',
          FieldLabel: entityProps.DisplayName,
          Type: 'number',
          className: 'Formviwer',
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
          className: 'Formviwer',
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
          className: 'Formviwer',
          Disabled: !!(
            control.Properties.Name === 'CreatedOn' ||
            control.Properties.Name === 'LastUpdatedDate'
          ),
        }
    }
  }

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
        // history.push((location.state.mode = ''))
        // history.push({
        //     pathname: `/formViewer`,
        //   search: `?entityName=${sysEntity.current}&entityId=${data.id}&listId=${listId.current}`,
        //   state: {
        //       dataId: data.id,
        //      sysListColumnId: listId.current,
        //     mode: '',
        //   },
        // })
        queryClient.invalidateQueries('isRecentitem')
        queryClient.invalidateQueries('pinnedData')
      },
    }
  )

  const UserFavourites = (data) => {
    getAPIData(
      'get',
      `${APIEndPoints.GetEntity.url}?$filter=Name eq '${queryentityName.current}'&$expand=entityfield($expand=entityfielddatatype)`
    ).then((response) => {
      const Result = response.data.value[0]?.EntityField.find(
        (item) => item.IsDisplayName === true
      )
      const postData = {
        User: userId,
        sysParentEntityType: queryentityName.current,
        sysParentEntityID: data.id,
        UserFavouritesType: 'History',
        Organisation: data && data?.Organisation,
        EntityDisplayText: Result?.DisplayName || '',
      }
      mutationUserFavourites.mutate(postData)
    })
  }

  React.useEffect(() => {
    async function fetchData() {
      showLoading(true)

      const postdata = {
        SysEntity: queryentityName.current,
        SysEntityId: queryentityId.current,
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
          history.goBack()
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
            const arr_expanddata = expanddata.split(',')

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
              `/api/${queryentityName.current}(${queryentityId.current})${expanddata}`
            )
          } else {
            formData = await getEntitydatas(
              queryentityName.current,
              queryentityId.current
            )
          }
          // TODO : Optionset changes
          let formValues = formData.data[0]
          if (userId) {
            if (
              history?.location?.state?.mode &&
              history?.location?.state?.mode === 'edit'
            )
              UserFavourites(formValues)
          }

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
            strentityNames !== ''
              ? strentityNames
              : `'${queryentityName.current}'`

          const casecadingAPICall = await getAPIData(
            APIEndPoints.GetEntity.method,
            `${APIEndPoints.GetEntity.url}?$filter=Name eq '${queryentityName.current}'&$expand=EntityField`
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

            let entityField = casecadingAPICall.EntityField
            entityField = entityField
              .filter(function (item) {
                return item.Name.toLowerCase() == 'iconfield'
              })
              .map(function ({ Id, Name, LookupFilter }) {
                return { Id, Name, LookupFilter }
              })

            let header = []

            if (
              entityField &&
              entityField[0]?.LookupFilter != '' &&
              entityData?.data?.value[0].Name.toLowerCase() === 'menuitem'
            ) {
              header = [
                {
                  EntityFieldId: entityField[0].Id,
                  IsLookupFilter: true,
                  ParentEntityName:
                    entityData && entityData?.data?.value[0].Name,
                  FieldName: entityField[0].Name,
                },
              ]

              dispatch({
                type: 'SET_Headerdata',
                Headerdata: header,
              })
            }
            // ********************* Here Set API Header form sysMenuItem IconFileld Load -- End ***********************************************************
          })
        }
      }
      // else {
      //   showToastMessage(`Form doesn't match with the criteria.`, 'error')
      //   history.goBack()
      // }
      showLoading(false)
    }
    fetchData()
  }, [state.Entitiesdataitems, queryentityId.current])

  React.useEffect(() => {
    async function fetchData() {
      const { entityData } = state.apiData
      showLoading(true)
      if (entityData) {
        // const injectedDatatypeComponent12 = await LookupFiltervalue(
        //   entityData.EntityField
        // )

        const injectedDatatypeComponent = injectDatatypeComponent(
          // injectedDatatypeComponent12
          entityData.EntityField
        )
        dispatch({
          type: 'SET_FIELDDATATYPES',
          fieldDataTypes: injectedDatatypeComponent,
        })
        showLoading(false)
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

  if (!formViewerDatasource) return null
  return (
    <div className="formviewer">
      <div className="formtitle">
        <div className="formtitle__title">
          {formViewerDatasource.header.Properties.HeaderName}
        </div>
        <div className="formtitle__subtitle">
          {formViewerDatasource.header.Properties.Subtitle}
        </div>
      </div>
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
                    className="formcolumns"
                    style={{
                      gridTemplateColumns: `repeat(${tab.columns.length}, 1fr)`,
                    }}
                  >
                    {tab &&
                      tab.columns.map((column) => {
                        return (
                          <div
                            className="formsections"
                            style={{
                              width: `${column.Properties.Width || 100}%`,
                            }}
                          >
                            {column &&
                              column.sections.map((section) => {
                                const propertyName =
                                  section && section?.Properties?.Name
                                return (
                                  <div
                                    className="section-columns"
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
                                              className="section-column"
                                              style={{
                                                width: `${
                                                  sectionColumn.Properties
                                                    .Width || 100
                                                }%`,
                                              }}
                                            >
                                              {sectionColumn &&
                                                sectionColumn.elements.map(
                                                  (element, eleidx) => {
                                                    if (
                                                      formViewerDatasource.BaseEntity ===
                                                      element.Properties.Entity
                                                    ) {
                                                      const elementObj =
                                                        fieldDataTypes[
                                                          element.Properties
                                                            .Name
                                                        ]
                                                      if (!elementObj)
                                                        return null
                                                      const fieldValue =
                                                        typeof formValues[
                                                          element.Properties
                                                            .Name
                                                        ] === 'object'
                                                          ? formValues[
                                                              element.Properties
                                                                .Name
                                                            ]?.Id
                                                          : formValues[
                                                              element.Properties
                                                                .Name
                                                            ]

                                                      statusValue =
                                                        fieldDataTypes?.Status
                                                          ?.Filters &&
                                                        JSON.parse(
                                                          fieldDataTypes.Status
                                                            ?.Filters
                                                        ).filters[0].value.toLowerCase()

                                                      return (
                                                        <div
                                                          style={{
                                                            height: '40px',
                                                          }}
                                                        >
                                                          <div
                                                            className="form-element"
                                                            style={{
                                                              width: `${element.Properties.Width}%`,
                                                              height: '40px',
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
                                                                    fieldValue &&
                                                                    fieldValue ===
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
                                                          {eleidx !==
                                                            sectionColumn
                                                              .elements.length -
                                                              1 && (
                                                            <hr className="emptyline" />
                                                          )}
                                                        </div>
                                                      )
                                                    }
                                                    if (
                                                      formViewerDatasource.BaseEntity !==
                                                      element.Properties.Entity
                                                    ) {
                                                      return (
                                                        <div
                                                          style={{
                                                            height: '40px',
                                                          }}
                                                        >
                                                          <div
                                                            className="form-element"
                                                            style={{
                                                              width: `${element.Properties.Width}%`,
                                                              height: '40px',
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
                                                                Validation: {
                                                                  IsRequired:
                                                                    'False',
                                                                },
                                                                Disabled: true,
                                                                className:
                                                                  'Formviwer',
                                                              }}
                                                            />
                                                            {/* {eleidx !==
                                                              sectionColumn
                                                                .elements
                                                                .length -
                                                                1 && (
                                                              <hr className="emptyline" />
                                                            )} */}
                                                          </div>
                                                          {eleidx !==
                                                            sectionColumn
                                                              .elements.length -
                                                              1 && (
                                                            <hr className="emptyline" />
                                                          )}
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
    </div>
  )
}

export default FormViewer
