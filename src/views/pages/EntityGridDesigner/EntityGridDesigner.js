import React from 'react'
import { useHistory } from 'react-router-dom'
import {
  useQueries,
  useMutation,
  useIsFetching,
  useQueryClient,
} from 'react-query'
import {
  SaveSharp as SaveSharpIcon,
  Publish as PublishIcon,
} from '@material-ui/icons'
import _ from 'lodash'
import PropTypes from 'prop-types'

import useActionFields from '../../components/hooks/useActionsFields'
import useAppContext from '../../components/hooks/useToast'
import usePageTitle from '../../components/hooks/usePageTitle'
import componentLookup from '../../../utils/componentLookup'
import FFGrid from '../../components/base/FFGrid/FFGrid'
import FFAutocomplete from '../../components/base/FFAutocomplete/FFAutocomplete'
import DesignerProperties from './DesignerProperties/DesignerProperties'
import getAPIData, { getCoreData } from '../../../models/api/api'
import APIEndPoints from '../../../models/api/apiEndpoints'
import entityGridDesignerData from './EntityGridDesigner.json'
import utils from '../../../utils/utils'
import useEditorContext from './useEditorContext'
import useEntityLookups from '../../components/hooks/useEntityLookups'
import './EntityGridDesigner.css'

function gridDesignerReducer(state, action) {
  let updatedColumnProperties = [...state.columnProperties]

  switch (action.type) {
    case 'SHOW_LOADING':
      return { ...state, showLoading: action.showLoading }
    case 'SET_GRIDSOURCE':
      return { ...state, gridDatasource: { ...action.gridDatasource } }
    case 'SET_GRIDROWDATA':
      return { ...state, rowData: action.rowData }
    case 'SET_PROPERTYTYPE':
      return {
        ...state,
        propertyEditorType: action.propertyEditorType,
        propertyEditingColumn: action.propertyEditingColumn,
      }
    case 'SET_GRIDPROPERTIES':
      return {
        ...state,
        gridProperties: {
          ...state.gridProperties,
          ...action.gridProperties,
        },
      }
    case 'Filter_Data':
      return {
        ...state,
        gridProperties: {
          ...state.gridProperties,
          Filter:
            JSON.parse(action.data).filters.length !== 0 ? action.data : '',
        },
      }
    case 'SET_COLUMNPROPERTIES':
      return {
        ...state,
        columnProperties: action.columnProperties,
      }

    case 'UPDATE_COLUMNPROPERTIES':
      updatedColumnProperties = updatedColumnProperties.map((columnProp) => {
        if (columnProp.EntityFieldId === state.propertyEditingColumn)
          return { ...columnProp, ...action.editingColumn }
        return columnProp
      })

      return {
        ...state,
        columnProperties: [...updatedColumnProperties],
      }
    case 'SET_PAGEMODE':
      return {
        ...state,
        mode: action.mode,
      }
    case 'SET_SYSLISTID':
      return {
        ...state,
        sysListId: action.sysListId,
      }
    case 'SET_APIDATA':
      return { ...state, apiData: action.apiData }
    case 'SHOW_ADDCOLUMN':
      return { ...state, showAddColumn: action.showAddColumn }
    case 'SET_RELATEDENTITY':
      return {
        ...state,
        relatedEntity: action.relatedEntity,
      }
    case 'CURRENT_ENTITYFIELD':
      return { ...state, currentEntityField: action.currentEntityField }
    case 'gridProperties_clear':
      return {
        ...state,
        gridProperties: {},
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const EntityGridDesigner = ({ location }) => {
  const initialState = {
    gridDatasource: {},
    rowData: [],
    propertyEditorType: 'grid',
    propertyEditingColumn: null,
    entity: location.state?.entity || '',
    title: location.state?.title || '',
    listName: location.state?.listName || '',
    mode: location.state?.mode || '',
    sysListId: location.state?.data?.id || '',
    gridProperties: {},
    columnProperties: [],
    apiData: {},
    showLoading: true,
    showAddColumn: false,
    relatedEntity: '',
  }

  const [state, dispatch] = React.useReducer(gridDesignerReducer, initialState)
  const gridAPI = React.useRef(null)
  const { EditorProvider } = useEditorContext()
  const { setActionFields } = useActionFields()
  const history = useHistory()
  const { showToastMessage, showLoading } = useAppContext()
  const { setPageTitle } = usePageTitle()
  const entityLookups = useEntityLookups(state.entity, {
    includeBaseEntityId: true,
  })
  const isFetching = useIsFetching()
  const queryClient = useQueryClient()

  setPageTitle('List View Designer')

  function getColumnsToSave(columnProperties, sysListID) {
    const oldColumns = []
    const newColumns = []
    columnProperties.forEach((column) => {
      if (column.id) oldColumns.push(column)
      else
        newColumns.push({
          ...column,
          sysParentEntityType: 'List',
          sysParentEntityID: sysListID,
        })
    })

    return { oldColumns, newColumns }
  }

  function specifySortIndex(columnProperties) {
    let colIndex = -1
    return columnProperties
      .map((column) => {
        colIndex = gridAPI.current.columnApi
          .getAllDisplayedColumns()
          .findIndex(
            (colData) => colData.colDef.EntityFieldId === column.EntityFieldId
          )
        return { ...column, ColumnIndex: colIndex + 1 }
      })
      .filter((item) => item.Hide === false)
  }
  const mutateListColumns = useMutation(
    (mutationData) => {
      const requestURL =
        mutationData.mutationType === 'patch'
          ? `${APIEndPoints.GetSysListColumn.url}(${state.sysListId})`
          : APIEndPoints.GetSysListColumn.url

      return getCoreData(
        mutationData.mutationType,
        requestURL,
        mutationData.requestBody
      )
    },
    {
      // onError: (err) => {
      //   showLoading(false)
      //   queryClient
      //     .invalidateQueries('listEditor')
      //     .then(() =>
      //       showToastMessage(JSON.stringify(err?.response?.data), 'error')
      //     )
      // },
      onSettled: (data, error) => {
        showLoading(false)
        queryClient.invalidateQueries('listEditor').then(() => {
          if (error)
            showToastMessage(JSON.stringify(error?.response?.data), 'error')
          else showToastMessage('Updated successfully')
        })
      },
    }
  )

  async function saveSysListColumns() {
    let columnProperties = null
    const oldColumnsupdate = []
    const ListColumnids = []
    const oldListcolumn = sysListColumns?.data?.ListColumn

    columnProperties = _.cloneDeep(state.columnProperties)
    columnProperties = specifySortIndex(columnProperties)
    const { oldColumns, newColumns } = getColumnsToSave(
      columnProperties,
      state.sysListId
    )

    // if (newColumns.length > 0) {
    //   mutateListColumns.mutate({
    //     mutationType: 'post',
    //     requestBody: newColumns,
    //   })
    // }
    if (
      oldColumns?.length !== 0 &&
      oldListcolumn.length !== 0 &&
      oldListcolumn.length !== oldColumns?.length
    ) {
      oldListcolumn.forEach((item) => item?.id && ListColumnids.push(item.id))
      await getCoreData(
        'delete',
        `${APIEndPoints.GetSysListColumn.url}`,
        ListColumnids
      )

      oldColumns.forEach((column) => {
        if (column.id) {
          delete column.id
          oldColumnsupdate.push(column)
        }
      })

      mutateListColumns.mutate({
        mutationType: 'post',
        requestBody: [...oldColumnsupdate, ...newColumns],
      })
    }
    if (
      oldColumns?.length !== 0 &&
      oldListcolumn.length !== 0 &&
      oldListcolumn.length === oldColumns?.length &&
      newColumns.length === 0
    ) {
      mutateListColumns.mutate({
        mutationType: 'patch',
        requestBody: oldColumns,
      })
    } else if (newColumns.length !== 0) {
      mutateListColumns.mutate({
        mutationType: 'post',
        requestBody: newColumns,
      })
    } else {
      showLoading(false)
      showToastMessage('Updated successfully')
    }
  }

  const mutateList = useMutation(
    (mutationData) => {
      const requestURL =
        mutationData.mutationType === 'patch'
          ? `${APIEndPoints.GetSysList.url}(${state.sysListId})`
          : APIEndPoints.GetSysList.url

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
          dispatch({ type: 'SET_PAGEMODE', mode: 'EDIT' })

          dispatch({
            type: 'SET_SYSLISTID',
            sysListId: response?.data?.responseData?.id,
          })

          history.replace({
            ...history.location,
            state: {
              ...history.location.state,
              mode: 'EDIT',
              data: response.data.responseData,
            },
          })
          showLoading(false)
          queryClient
            .invalidateQueries('listEditor')
            .then(() => showToastMessage('Saved successfully'))

          // queryClient.invalidateQueries('sysListColumns')
        } else {
          saveSysListColumns()

          if (mutationData.mutationMethod === 'publish')
            dispatch({
              type: 'SET_GRIDPROPERTIES',
              gridProperties: {
                IsPublished: true,
              },
            })
        }
      },
      onError: (err) => {
        showLoading(false)
        showToastMessage(JSON.stringify(err?.response?.data), 'error')
      },
      // onSettled: (data, variables, context) => {
      //   if (context.mutationType === 'post')
      //     queryClient.invalidateQueries('listEditor')
      // },
    }
  )

  function sysListDesginer(desginerObj) {
    const entries = Object.entries(desginerObj)
    return entries.reduce((acc, [key, value]) => {
      acc = { ...acc, [key]: value == 'Select' ? null : value }
      return acc
    }, {})
  }

  async function onSaveClickHandler() {
    let sysListPostData = null
    let gridProperties = null
    let columnProperties = null

    gridProperties = _.cloneDeep(state.gridProperties)
    columnProperties = _.cloneDeep(state.columnProperties)
    columnProperties = utils.removeKeyFromObject(columnProperties, ['id'])
    columnProperties = specifySortIndex(columnProperties)

    if (state.mode !== 'EDIT') {
      const gridPropertiesObj = sysListDesginer(gridProperties)
      delete gridProperties.id

      sysListPostData = {
        Title: state.title,
        SysEntity: state.entity,
        ListName: state.listName,
        ...gridPropertiesObj,
        IsPublished: false,
        ListColumn: columnProperties,
      }
      sysListPostData = {
        ...utils.removeKeyFromObject(sysListPostData, [
          '_attachments',
          '_etag',
          '_rid',
          '_self',
          '_ts',
          'CreatedOn',
          'LastUpdatedDate',
        ])[0],
      }
      mutateList.mutate({
        mutationType: 'post',
        mutationMethod: 'save',
        requestBody: sysListPostData,
      })
    } else {
      const gridPropertieseditObj = sysListDesginer(state.gridProperties)

      sysListPostData = {
        Title: state.title,
        SysEntity: state.entity,
        ListName: state.listName,
        IsPublished: false,
        ...gridPropertieseditObj,
      }
      sysListPostData = {
        ...utils.removeKeyFromObject(sysListPostData, [
          '_attachments',
          '_etag',
          '_rid',
          '_self',
          '_ts',
          'CreatedOn',
          'LastUpdatedDate',
        ])[0],
      }
      mutateList.mutate({
        mutationType: 'patch',
        mutationMethod: 'save',
        requestBody: sysListPostData,
      })
    }
  }

  // async function onPublishClickHandler() {
  //   const sysListPostData = {
  //     Title: state.title,
  //     SysEntity: state.entity,
  //     ListName: state.listName,
  //     ...state.gridProperties,
  //     IsPublished: true,
  //   }

  //   mutateList.mutate({
  //     mutationType: 'patch',
  //     mutationMethod: 'publish',
  //     requestBody: sysListPostData,
  //   })
  // }

  const actionFields = [
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Icon: SaveSharpIcon,
        Label: 'Save',
        CSSName: 'entitygrid-designer__save',
        onClick: onSaveClickHandler,
        // disabled: state.mode === 'EDIT' && state.gridProperties?.IsPublished,
      },
    },
    // {
    //   actionComponent: componentLookup.ActionButton,
    //   componentProps: {
    //     Icon: PublishIcon,
    //     Label: 'Publish',
    //     CSSName: 'entitygrid-designer__publish',
    //      onClick: onPublishClickHandler,
    //     disabled: state.mode === 'ADD',
    //   },
    // },
  ]

  const gridOverlay = (params) => {
    gridAPI.current = params
  }

  function onGridSelected() {
    dispatch({
      type: 'SET_PROPERTYTYPE',
      propertyEditorType: 'grid',
      propertyEditingColumn: null,
    })
  }

  const onColumnVisibilityChanged = React.useCallback(
    ({ columns }) => {
      const columnProperties = _.cloneDeep(state.columnProperties)
      if (columns) {
        columns.forEach(({ colDef, visible }) => {
          columnProperties.forEach((column, index) => {
            if (column.EntityFieldId === colDef.EntityFieldId)
              columnProperties[index].Hide = !visible

            if (
              columnProperties[index]['GridColumnProperty-editable'] ===
              undefined
            )
              columnProperties[index]['GridColumnProperty-editable'] = true
          })
        })
      }
      dispatch({
        type: 'SET_COLUMNPROPERTIES',
        columnProperties,
      })
    },
    [state.columnProperties]
  )

  function mergeEntityAndViewColumns(entityColumnsSchema, viewColumnsSchema) {
    let viewColumnIndex = -1
    let isDifferentEntity = false
    let selectedEntity = null
    let relatedEntity = null
    const viewColumnsSchemaCloned = [...viewColumnsSchema]

    const modifiedEntityColumnsSchema = viewColumnsSchema
    selectedEntity = state.apiData?.allEntities?.find(
      (entity) => entity.Name === state.entity
    )

    if (!entityColumnsSchema) return modifiedEntityColumnsSchema
    entityColumnsSchema.forEach((entityColumn) => {
      isDifferentEntity = entityColumn.EntityId !== state.relatedEntity
      relatedEntity = state.apiData?.allEntities?.find(
        (entity) => entity.Id === entityColumn.EntityId
      )
      viewColumnIndex = viewColumnsSchemaCloned.findIndex(
        (column) =>
          column.Field === entityColumn.Name &&
          column.EntityFieldId === entityColumn.Id
      )

      if (viewColumnIndex < 0) {
        modifiedEntityColumnsSchema.push({
          // Caption:
          //   entityColumn.EntityId !== selectedEntity.Id
          //     ? `${entityColumn.DisplayName} (${relatedEntity.Name})`
          //     : entityColumn.DisplayName,
          Caption: entityColumn.DisplayName,
          Field: entityColumn.Name,
          EntityName:
            entityColumn.EntityId !== selectedEntity.Id
              ? relatedEntity.Name
              : null,
          EntityFieldId: entityColumn.Id,
          Hide:
            state.mode !== 'EDIT' && entityColumn.EntityId === selectedEntity.Id
              ? entityColumn.EntityFieldRequired.Name !== 'Required'
              : true,
          suppressColumnsToolPanel: isDifferentEntity,
          'GridColumnProperty-editable': !(
            entityColumn.EntityId !== selectedEntity?.Id
          ),
          Visible: entityColumn?.Visible ?? true,
        })
      } else {
        modifiedEntityColumnsSchema[viewColumnIndex].suppressColumnsToolPanel =
          isDifferentEntity
        // modifiedEntityColumnsSchema[viewColumnIndex].Caption =
        //   entityColumn.EntityId !== selectedEntity.Id
        //     ? `${entityColumn.DisplayName} (${relatedEntity.Name})`
        //     : entityColumn.DisplayName
        modifiedEntityColumnsSchema[viewColumnIndex][
          'GridColumnProperty-editable'
        ] =
          entityColumn.EntityId !== selectedEntity?.Id
            ? false
            : modifiedEntityColumnsSchema[viewColumnIndex][
                'GridColumnProperty-editable'
              ]
        modifiedEntityColumnsSchema[viewColumnIndex].EntityName =
          entityColumn.EntityId !== selectedEntity.Id
            ? relatedEntity.Name
            : null
      }
    })

    return modifiedEntityColumnsSchema
  }

  setActionFields({ actionFields, showBackButton: true, hideSearchBox: true })

  function onRelatedEntityChangeHandler(e, params) {
    dispatch({ type: 'SET_RELATEDENTITY', relatedEntity: params.value })
  }

  const [
    sysListColumns,
    entityFields,
    optionSets,
    allEntities,
    rowDataResponse,
  ] = useQueries([
    {
      queryKey: ['listEditor', 'sysListColumns'],
      queryFn: () =>
        getCoreData(
          APIEndPoints.GetSysList.method,
          // `${APIEndPoints.GetSysList.url}?$expand=ListColumn&$filter=id eq '${state.sysListId}'`
          `${APIEndPoints.GetSysList.url}(${state.sysListId})?$expand=ListColumn`
        ).then((response) => {
          return response.data[0]
        }),
      enabled: state.mode === 'EDIT' && !!state.sysListId,
      placeholderData: [],
    },
    {
      queryKey: ['listEditor', 'entityFields'],
      queryFn: () =>
        getAPIData(
          APIEndPoints.GetEntity.method,
          `${APIEndPoints.GetEntity.url}?$filter=Id in (${entityLookups.lookupIds})&$expand=EntityField($expand=EntityFieldDataType,EntityFieldRequired)`
          // `${APIEndPoints.GetEntity.url}(${entityLookups.lookupIds})?$expand=EntityField($expand=EntityFieldDataType,EntityFieldRequired)`
        ).then((response) => {
          return response.data.value.reduce((prev, curr) => {
            return prev.concat(curr.EntityField)
          }, [])
        }),
      enabled: !!entityLookups?.lookupIds,
    },
    {
      queryKey: ['listEditor', 'optionSets'],
      queryFn: () =>
        getAPIData(
          APIEndPoints.GetEntityFieldOptionset.method,
          `${APIEndPoints.GetEntityFieldOptionset.url}?$expand=OptionSetOptions`
        ).then((response) => response.data.value),
    },
    {
      queryKey: ['listEditor', 'allEntities'],
      queryFn: () =>
        getAPIData(
          APIEndPoints.GetEntity.method,
          `${APIEndPoints.GetEntity.url}?$expand=EntityField`
        ).then((response) => response.data.value),
    },
    {
      queryKey: ['listEditor', 'rowDataResponse'],
      queryFn: () =>
        getCoreData(
          'get',
          `/api/${state.entity}?$expand=${entityLookups.lookupEntityFieldNames}`
        ).then((response) => response.data),
      enabled: !!entityLookups?.lookupEntityFieldNames,
    },
  ])

  React.useEffect(() => {
    if (
      entityFields.isFetched &&
      optionSets.isFetched &&
      allEntities.isFetched &&
      rowDataResponse.isFetched &&
      ((state.mode === 'EDIT' && sysListColumns.isFetched) ||
        state.mode !== 'EDIT') &&
      entityLookups?.lookupIds
    ) {
      if (state.mode === 'EDIT') {
        dispatch({
          type: 'SET_COLUMNPROPERTIES',
          columnProperties: utils.removeKeyFromObject(
            sysListColumns.data?.ListColumn ?? [],
            ['_attachments', '_etag', '_rid', '_self', '_ts', 'CreatedOn']
          ),
        })

        dispatch({
          type: 'gridProperties_clear',
        })

        dispatch({
          type: 'SET_GRIDPROPERTIES',
          gridProperties: utils.removeKeyFromObject(sysListColumns.data || [], [
            'ListColumn',
            '_attachments',
            '_etag',
            '_rid',
            '_self',
            '_ts',
            'CreatedOn',
            'GridProperty-rowData',
          ])[0],
        })
      } else {
        dispatch({
          type: 'SET_GRIDPROPERTIES',
          gridProperties: {
            Title: state.title,
            ListName: state.listName,
          },
        })
      }

      dispatch({
        type: 'SET_RELATEDENTITY',
        relatedEntity: entityLookups.lookupIds[0],
      })
      dispatch({
        type: 'SET_APIDATA',
        apiData: {
          entityFields: entityFields.data,
          optionSets: optionSets.data,
          allEntities: allEntities.data,
        },
      })

      /** Here checking for Point,Polygon,LineString Data type and convert Array data to String -- Start */

      const filterEntityFielddata = allEntities.data.find(
        (itemIN) => itemIN.Name === state.entity
      )

      const rowDataClone = _.cloneDeep(rowDataResponse.data)
      let rowData = []

      const updatedRecords =
        rowDataClone &&
        rowDataClone.map((rowValue) => {
          Object.entries(rowValue).forEach(([key, value]) => {
            const filterdata = filterEntityFielddata?.EntityField.find(
              (itemIN) => itemIN.Name === key
            )

            if (
              filterdata?.DataTypeId ===
                'a9c5c8aa-16c0-48d1-f911-08d8fda71e06' ||
              filterdata?.DataTypeId ===
                '0fe8ab72-b0e5-49fb-f912-08d8fda71e06' ||
              filterdata?.DataTypeId === 'eef33ba4-21ba-43f2-f913-08d8fda71e06'
            ) {
              rowValue[key] = JSON.stringify(
                value?.coordinates ? value?.coordinates : value || ''
              )
            }
          })
          return rowValue
        })
      rowData = updatedRecords
      dispatch({ type: 'SET_GRIDROWDATA', rowData: rowData || [] })

      /** Here checking for Point,Polygon,LineString Data type and convert Array data to String -- End */
    }
  }, [
    entityFields.isFetching,
    optionSets.isFetching,
    allEntities.isFetching,
    rowDataResponse.isFetching,
    sysListColumns.isFetching,
    state.mode,
    state.title,
    state.listName,
    state.entity,
    entityLookups?.lookupIds,
  ])

  // * The below code is refactored to react query
  // React.useEffect(() => {
  //   async function fetchData() {
  //     let sysListColumnsRequest = null

  //     if (state.mode === 'EDIT')
  //       sysListColumnsRequest = getCoreData(
  //         APIEndPoints.GetSysList.method,
  //         `${APIEndPoints.GetSysList.url}?$expand=ListColumn&$filter=id eq '${state.sysListId}'`
  //       )

  //     const [
  //       sysListColumns,
  //       entityFields,
  //       optionSets,
  //       allEntities,
  //     ] = await Promise.all([
  //       sysListColumnsRequest,
  //       getAPIData(
  //         APIEndPoints.GetEntity.method,
  //         `${APIEndPoints.GetEntity.url}?$filter=Id in (${entityLookups.lookupIds})&$expand=EntityField($expand=EntityFieldDataType,EntityFieldRequired)`
  //       ),
  //       getAPIData(
  //         APIEndPoints.GetEntityFieldOptionset.method,
  //         `${APIEndPoints.GetEntityFieldOptionset.url}?$expand=OptionSetOptions`
  //       ),
  //       getAPIData(
  //         APIEndPoints.GetEntity.method,
  //         `${APIEndPoints.GetEntity.url}?$expand=EntityField`
  //       ),
  //     ])

  //     if (state.mode === 'EDIT') {
  //       if (sysListColumns.status === 200) {
  //         dispatch({
  //           type: 'SET_COLUMNPROPERTIES',
  //           columnProperties: utils.removeKeyFromObject(
  //             sysListColumns.data[0].ListColumn,
  //             ['_attachments', '_etag', '_rid', '_self', '_ts', 'CreatedOn']
  //           ),
  //         })

  //         dispatch({
  //           type: 'SET_GRIDPROPERTIES',
  //           gridProperties: utils.removeKeyFromObject(sysListColumns.data[0], [
  //             'ListColumn',
  //             '_attachments',
  //             '_etag',
  //             '_rid',
  //             '_self',
  //             '_ts',
  //             'CreatedOn',
  //             'GridProperty-rowData',
  //           ])[0],
  //         })
  //       }
  //     } else {
  //       dispatch({
  //         type: 'SET_GRIDPROPERTIES',
  //         gridProperties: {
  //           Title: state.title,
  //           ListName: state.listName,
  //         },
  //       })
  //     }
  //     dispatch({
  //       type: 'SET_RELATEDENTITY',
  //       relatedEntity: entityLookups.lookupIds[0],
  //     })
  //     dispatch({
  //       type: 'SET_APIDATA',
  //       apiData: {
  //         entityFields: entityFields.data.value.reduce((prev, curr) => {
  //           return prev.concat(curr.EntityField)
  //         }, []),
  //         optionSets: optionSets.data.value,
  //         allEntities: allEntities.data.value,
  //       },
  //     })

  //     const rowDataResponse = await getCoreData(
  //       'get',
  //       `/api/${state.entity}?$expand=${entityLookups.lookupEntityFieldNames}`
  //     )

  //     /** Here checking for Point,Polygon,LineString Data type and convert Array data to String -- Start */

  //     const filterEntityFielddata = allEntities.data.value.find(
  //       (itemIN) => itemIN.Name === state.entity
  //     )

  //     const rowDataClone = _.cloneDeep(rowDataResponse?.data)
  //     let rowData = []

  //     const updatedRecords =
  //       rowDataClone &&
  //       rowDataClone.map((rowValue) => {
  //         Object.entries(rowValue).forEach(([key, value]) => {
  //           const filterdata = filterEntityFielddata?.EntityField.find(
  //             (itemIN) => itemIN.Name === key
  //           )

  //           if (
  //             filterdata?.DataTypeId ===
  //               'a9c5c8aa-16c0-48d1-f911-08d8fda71e06' ||
  //             filterdata?.DataTypeId ===
  //               '0fe8ab72-b0e5-49fb-f912-08d8fda71e06' ||
  //             filterdata?.DataTypeId === 'eef33ba4-21ba-43f2-f913-08d8fda71e06'
  //           ) {
  //             rowValue[key] = JSON.stringify(
  //               value?.coordinates ? value?.coordinates : value || ''
  //             )
  //           }
  //         })
  //         return rowValue
  //       })
  //     rowData = updatedRecords

  //     /** Here checking for Point,Polygon,LineString Data type and convert Array data to String -- End */

  //     dispatch({ type: 'SET_GRIDROWDATA', rowData: rowData || [] })
  //     dispatch({ type: 'SHOW_LOADING', showLoading: false })
  //   }
  //   if (state.entity && entityLookups) fetchData()
  // }, [
  //   state.entity,
  //   state.mode,
  //   state.sysListId,
  //   state.gridProperties.IsPublished,
  //   entityLookups,
  // ])

  React.useEffect(() => {
    let gridColumns = []

    const { entityFields, optionSets, allEntities } = state.apiData

    gridColumns = mergeEntityAndViewColumns(
      entityFields,
      state.columnProperties
    )
    gridColumns = utils.entitydesignergenerateGridColumns(
      gridColumns,
      {},
      {
        headerComponent: 'ListViewDesignerGridHeader',
        headerComponentParams: {
          onEditClickHandler: (columnDefn) =>
            dispatch({
              type: 'SET_PROPERTYTYPE',
              propertyEditorType: 'column',
              propertyEditingColumn: columnDefn.EntityFieldId,
            }),
        },
      },
      {},
      entityFields,
      state.rowData
    )

    // Add column at the end of the grid
    gridColumns.push({
      headerName: 'Add column',
      headerComponent: 'AddColumnHeader',
      cellClass: 'addcolumnheader-cell',
      suppressColumnsToolPanel: true,
      headerComponentParams: {
        columnLists: entityFields,
        showPopup: state.showAddColumn,
        dispatch,
        onGridDropdownChangeHandler: onRelatedEntityChangeHandler,
        dropdownData: entityLookups?.optionSets || [],
        dropdownSelectedData: relatedEntity,
      },
    })

    if (entityFields && optionSets && allEntities)
      gridColumns = utils.entitydesignerprovideCellEditors(gridColumns, {
        entityFields,
        optionSets,
        allEntities,
      })

    // Position columns based on ColumnIndex
    gridColumns = _.sortBy(gridColumns, ['ColumnIndex'])

    dispatch({
      type: 'SET_GRIDSOURCE',
      gridDatasource: {
        ...entityGridDesignerData,
        onCellClicked: onGridSelected,
        columnDefs: gridColumns,
        rowData: state.rowData,
        onColumnVisible: onColumnVisibilityChanged,
      },
    })
  }, [
    onColumnVisibilityChanged,
    state.columnProperties,
    state.apiData.entityFields,
    state.rowData,
    state.apiData,
    state.showAddColumn,
    state.relatedEntity,
  ])

  React.useEffect(() => {
    async function fetchdata() {
      const currentEntityField = await getAPIData(
        'get',
        `${APIEndPoints.GetEntity.url}?$filter=Name eq '${state.entity}'&$expand=entityfield`
      )
      dispatch({
        type: 'CURRENT_ENTITYFIELD',
        currentEntityField:
          currentEntityField.data.value?.[0].EntityField || [],
      })
    }
    fetchdata()
  }, [])

  const { gridDatasource, relatedEntity } = state

  return (
    <EditorProvider value={{ editorData: state, editorDispatcher: dispatch }}>
      <div className="entitygrid-designer">
        <div className="entitygrid-designer__workspace">
          <span className="entitygrid-designer__title">
            <FFAutocomplete
              id="relatedentities"
              name="relatedentities"
              className="entitygrid-designer__relatedentities"
              Field={{
                FieldValue: 'RelatedEntity',
                FieldLabel: 'Related Entity',
                Datasource: entityLookups?.optionSets || [],
                ValueField: 'id',
                TextField: 'Name',
              }}
              value={relatedEntity && relatedEntity}
              onChangeHandler={onRelatedEntityChangeHandler}
            />
          </span>
          <FFGrid
            dataSource={{ ...gridDatasource, suppressClickEdit: true }}
            onGridReady={gridOverlay}
          />
        </div>
        <DesignerProperties />
      </div>
    </EditorProvider>
  )
}

EntityGridDesigner.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      entity: PropTypes.string,
      title: PropTypes.string,
    }),
  }).isRequired,
}

export default EntityGridDesigner
