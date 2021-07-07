import React from 'react'
import queryString, { stringify } from 'query-string'
import _ from 'lodash'
import {
  useQuery,
  useQueries,
  useMutation,
  useIsFetching,
  useQueryClient,
} from 'react-query'
import {
  Add,
  VisibilityOutlined as VisibilityOutlinedIcon,
} from '@material-ui/icons'
import FFGrid from '../../components/base/FFGrid/FFGrid'
import getAPIData, { getCoreData } from '../../../models/api/api'
import APIEndPoints from '../../../models/api/apiEndpoints'
import useActionFields from '../../components/hooks/useActionsFields'
import useAppContext from '../../components/hooks/useToast'
import usePageTitle from '../../components/hooks/usePageTitle'
import utils from '../../../utils/utils'
import componentLookup from '../../../utils/componentLookup'
// import useEntityLookups from '../../components/hooks/useEntityLookups'
import PopupFormViewer from '../../components/custom/PopupFormViewer/PopupFormViewer'
import FFDropdown from '../../components/base/FFDropdown/FFDropdown'
import './ListViewViewer.css'

function listViewerReducer(state, action) {
  switch (action.type) {
    case 'SET_APIDATA':
      return { ...state, apiData: action.apiData }
    case 'SET_APIOPTIONSETDATA':
      return { ...state, apiOptionSetData: action.apiOptionSetData }
    // TODO: Find alternate way to stop resetting grid data source and remove below state variable.
    case 'SET_REFRESHGRIDROWDATA':
      return { ...state, refreshGridRowData: action.refreshGridRowData }
    case 'SET_GRIDAPI':
      return { ...state, gridAPI: action.gridAPI }
    case 'SET_GRIDDATASOURCE':
      return { ...state, gridDatasource: action.gridDatasource }
    case 'ENABLE_NEWENTRY':
      return { ...state, enableNewEntry: action.enableNewEntry }
    case 'SET_DATAUPDATED':
      return { ...state, dataUpdated: action.dataUpdated }
    case 'SET_CreatePopup':
      return { ...state, isCreatePopupOpen: action.isCreatePopupOpen }
    case 'SET_Popupdata':
      return { ...state, Popupdata: action.Popupdata }
    case 'SET_GridEditable':
      return { ...state, GridEditable: action.GridEditable }
    case 'ENABLE_ROWINDEX':
      return { ...state, Rowindexid: action.rowindexid }
    case 'SET_GRIDCOLUMNS':
      return {
        ...state,
        GridColumnsValues: action.gridColumnsValues,
        RelatedEntity: action.relatedEntity,
        // EntityLookupsClone: action.entityLookupsClone,
      }

    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const ListViewViewer = ({ history, match }) => {
  const initialState = {
    apiData: {},
    apiOptionSetData: {},
    refreshGridRowData: true,
    gridDatasource: {
      columnDefs: [],
      rowData: null,
    },
    gridAPI: null,
    enableNewEntry: true,
    dataUpdated: false,
    isCreatePopupOpen: false,
    Popupdata: {},
    GridEditable: false,
  }

  const [state, dispatch] = React.useReducer(listViewerReducer, initialState)
  const [rowcount, setrowcount] = React.useState(0)
  const editingData = React.useRef()
  const { showToastMessage, showLoading, userId } = useAppContext()
  const { setActionFields } = useActionFields()
  const { setPageTitle } = usePageTitle()
  // const entityLookups = useEntityLookups(match.params.entityName, {
  //   includeBaseEntityId: true,
  // })
  const isFetching = useIsFetching()
  const queryClient = useQueryClient()
  let rowindexid = ''
  setPageTitle(state.apiData?.sysListColumnResponse?.Title)
  const overrideColumnProperty = {}
  const defaultColumnProperties = {
    editable: true,
  }
  const queryParams = queryString.parse(location.search)
  const listId = React.useRef(queryParams.listId)

  const sysEntity = React.useRef(null)
  let invalidDataFlag = 0
  let relatedEntity = ''
  let gridColumnsValues = ''
  const entityLookupsClone = []

  if (listId.current !== queryParams.listId) {
    listId.current = queryParams.listId
    queryClient.resetQueries(['listViewer', `sysListColumns`])
    const { gridAPI } = state
    gridAPI.api.ensureIndexVisible(0)
    gridAPI.api.ensureColumnVisible('edit')
    if (editingData.current !== null && editingData.current !== undefined) {
      const CurrentRowid = editingData.current.id
      const node = gridAPI.api.getRowNode(CurrentRowid)
      if (node !== undefined && node !== null) {
        gridAPI.api.stopEditing({
          rowIndex: node.rowIndex,
          colKey: gridAPI.columnApi.getAllColumns()[0].colId,
        })
      }
    }
    dispatch({
      type: 'SET_APIDATA',
      apiData: {
        rowDataResponse: [],
      },
    })
    dispatch({
      type: 'SET_REFRESHGRIDROWDATA',
      refreshGridRowData: true,
    })
  }

  if (!listId.current) history.push('/404')
  const generateGridProperties = (gridProperties) => {
    if (!gridProperties) return null

    return Object.entries(gridProperties).reduce(
      (prevObj, [propKey, propValue]) => {
        if (propKey.indexOf('GridProperty-') >= 0) {
          const objKey = propKey.replace(/GridProperty-/g, '')

          return { ...prevObj, [objKey]: propValue }
        }

        return prevObj
      },
      {}
    )
  }

  function onRowModalClick(event, data, node) {
    dispatch({
      type: 'SET_Popupdata',
      Popupdata: {
        entityName: sysEntity.current,
        entityId: rowDataQuery?.data[0]?.Value[node?.rowIndex]?.id || data.id,
        listId: listId.current,
        data,
      },
    })
    dispatch({ type: 'SET_CreatePopup', isCreatePopupOpen: true })
  }

  function onGridReady(params) {
    dispatch({ type: 'SET_GRIDAPI', gridAPI: params })
  }

  const addNewRow = React.useCallback(() => {
    const id = utils.generateGUID()
    const { gridAPI } = state
    const emptyRow = { id, mode: 'add', addmode: true }
    gridAPI.api.updateRowData({
      add: [emptyRow],
      addIndex: 0,
    })
    const node = gridAPI.api.getRowNode(id)
    gridAPI.api.ensureIndexVisible(node?.rowIndex || 0)
    gridAPI.api.ensureColumnVisible('edit')
    rowindexid = node?.rowIndex || 0

    dispatch({ type: 'ENABLE_ROWINDEX', rowindexid: node?.rowIndex || 0 })
    setTimeout(() => {
      gridAPI.api.startEditingCell({
        rowIndex: 0,
        colKey: gridAPI.columnApi.getAllColumns()[0].colId,
      })
      gridAPI.api.setFocusedCell(0, gridAPI.columnApi.getAllColumns()[0].colId)
    }, 300)
  }, [state])

  const onGridEditClick = React.useCallback(
    (data) => {
      const { gridAPI } = state
      const node = gridAPI.api.getRowNode(data?.id)
      gridAPI.api.ensureIndexVisible(node?.rowIndex || 0)
      gridAPI.api.ensureColumnVisible('edit')
      setTimeout(() => {
        gridAPI.api.startEditingCell({
          rowIndex: node?.rowIndex || 0,
          colKey: gridAPI.columnApi.getAllColumns()[0].colId,
        })
        gridAPI.api.setFocusedCell(
          node?.rowIndex || 0,
          gridAPI.columnApi.getAllColumns()[0].colId
        )
      }, 300)
    },
    [state]
  )

  const deleteRow = (data) => {
    const { gridAPI } = state

    gridAPI.api.updateRowData({ remove: [data] })
  }

  function PatchRowData(editrowobj) {
    const entries = Object.entries(editrowobj)
    return entries.reduce((acc, [key, value]) => {
      const odatafield = key.indexOf('@') > -1
      if (typeof value !== 'object' && odatafield == false)
        acc = { ...acc, [key]: value == 'Select' ? null : value }
      if (
        typeof value === 'object' &&
        value.length !== 0 &&
        odatafield == false
      ) {
        acc = { ...acc, [key]: value[0]?.id }
      }
      return acc
    }, {})
  }

  const mutateCoreData = useMutation(
    (mutationData) => {
      const requestURL =
        mutationData.mutationType === 'patch'
          ? `/api/${state.apiData.sysListColumnResponse.SysEntity}(${mutationData.recordId})`
          : `/api/${state.apiData.sysListColumnResponse.SysEntity}`

      return getCoreData(
        mutationData.mutationType,
        requestURL,
        mutationData.requestBody
      )
    },
    {
      onMutate: () => showLoading(true),
      onSuccess: (response, mutationData) => {
        // dont change order invalidate Queries
        queryClient.invalidateQueries('navGroup')
        queryClient.invalidateQueries('navSectionandItemData')
        queryClient.invalidateQueries('listViewer')
        showLoading(false)
        showToastMessage(
          `${
            mutationData.mutationType === 'post' ? 'Saved' : 'Updated'
          } successfully`
        )
        dispatch({ type: 'ENABLE_ROWINDEX', rowindexid: '' })
      },
      onError: (err) => {
        showLoading(false)
        showToastMessage(JSON.stringify(err?.response?.data), 'error')
        // queryClient.invalidateQueries('listViewer')
        if (state.Rowindexid !== undefined && state.Rowindexid !== '') {
          const { gridAPI } = state
          gridAPI.api.ensureIndexVisible(0)
          gridAPI.api.ensureColumnVisible('edit')
          setTimeout(() => {
            gridAPI.api.startEditingCell({
              rowIndex: state.Rowindexid,
              colKey: gridAPI.columnApi.getAllColumns()[0].colId,
            })
            gridAPI.api.setFocusedCell(
              state.Rowindexid,
              gridAPI.columnApi.getAllColumns()[0].colId
            )
          }, 300)
        } else {
          // dont change order invalidate Queries
          queryClient.invalidateQueries('navGroup')
          queryClient.invalidateQueries('navSectionandItemData')
          queryClient.invalidateQueries('listViewer')
        }
      },
      onSettled: () => {
        // queryClient.invalidateQueries('listViewer')
        // if (!_.isEmpty(navGroupId)) {
        //   queryClient.invalidateQueries(navGroupId)
        // }
        // queryClient.invalidateQueries('navGroup')
      },
    }
  )

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
      enabled: match.params.entityName?.toLowerCase() === 'menuitem',
    }
  )

  function onEditingStoppedHandler(data) {
    dispatch({
      type: 'SET_REFRESHGRIDROWDATA',
      refreshGridRowData: true,
    })
    let postData = {}
    let crudType = null

    const styles = `.ag-body-viewport.ag-layout-normal {  overflow-y: auto; }`
    const styleSheet = document.createElement('style')
    styleSheet.type = 'text/css'
    styleSheet.innerText = styles

    if (match.params.entityName?.toLowerCase() === 'menuitem') {
      if (
        data?.List?.length &&
        data?.List &&
        data?.DisplayType?.toLowerCase() === 'list'
      ) {
        const sysList =
          ListItems.data &&
          ListItems.data.find(
            (list) =>
              list.id ===
              (typeof data?.List === 'object' ? data?.List[0].id : data?.List)
          )
        data.MenuURL = `/list/${sysList?.SysEntity}?listId=${
          typeof data?.List === 'object' ? data?.List[0].id : data?.List
        }`
      } else if (
        data.MenuType &&
        data?.MenuType?.toLowerCase() === 'navgroup'
      ) {
        data.MenuURL = ''
        editingData.current.MenuURL = ''
      }
    }

    const addrowData = { ...data }
    const oldrowData = { ...editingData.current }
    invalidDataFlag = 0

    /** Add mode to check Empty or Null values and remove add list */
    let newaddrowData = {}
    const obj = Object.entries(addrowData)
    obj.forEach(([key, value]) => {
      if (typeof value === 'undefined' || value === null || value === 0) {
        if (!oldrowData[key]) delete addrowData[key]
        else newaddrowData = { ...newaddrowData, [key]: oldrowData[key] }
      } else {
        newaddrowData = { ...newaddrowData, [key]: value }
      }
    })
    const oldobj = Object.entries(oldrowData)
    oldobj.forEach(([key, value]) => {
      if (value === null || value === 0) delete oldrowData[key]
    })

    if (!_.isEmpty(newaddrowData)) {
      crudType = newaddrowData.mode || 'edit'
      delete newaddrowData.mode

      if (crudType === 'add') {
        delete newaddrowData.id
        delete newaddrowData.addmode
        delete oldrowData.id
        delete oldrowData.addmode
        delete oldrowData.mode
        if (_.isEmpty(newaddrowData)) {
          deleteRow(data)
          dispatch({ type: 'ENABLE_NEWENTRY', enableNewEntry: true })
          queryClient.invalidateQueries('navGroup')
          queryClient.invalidateQueries('navSectionandItemData')
          queryClient.invalidateQueries('listViewer')
          return null
        }

        postData = {
          ...oldrowData,
          ...newaddrowData,
        }

        let postDataFinal = {}
        Object.entries(postData).forEach(([keyPost, valuePost]) => {
          if (valuePost && valuePost !== '') {
            postDataFinal = { ...postDataFinal, [keyPost]: valuePost }
          }
        })

        /** Here checking for Point,Polygon,LineString Data type and convert Array data-- Start */
        Object.entries(postDataFinal).forEach(([key, value]) => {
          const filterdata = state.apiData?.entityFields?.EntityField.find(
            (item1) => item1.entityField.Name === key
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
            if (value !== undefined && value !== null && value.trim() !== '') {
              try {
                obj = JSON.parse(value.replace(/\s+/g, ''))
              } catch (error) {
                invalidDataFlag = 1
                showToastMessage('Invalid data', 'error')
              }
            }
            postDataFinal = { ...postDataFinal, [key]: obj }
          }
        })

        /** Here checking for Point,Polygon,LineString Data type and convert Array data-- End */
        if (invalidDataFlag === 0)
          mutateCoreData.mutate({
            mutationType: 'post',
            requestBody: postDataFinal,
          })
      } else {
        if (_.isEqual(newaddrowData, oldrowData)) {
          editingData.current = null
          const rowNode = state.gridAPI.api.getRowNode(newaddrowData.id)
          rowNode.setData(newaddrowData)
          document.head.appendChild(styleSheet)
          return null
        }
        if (_.difference(newaddrowData, oldrowData)) {
          delete newaddrowData.Attachment
          delete newaddrowData.Activity
          const editRowData = PatchRowData(newaddrowData)

          postData = {
            ...utils.removeKeyFromObject(editRowData, [
              '_attachments',
              '_etag',
              '_rid',
              '_self',
              '_ts',
              'CreatedOn',
              'LastUpdatedDate',
            ])[0],
          }

          /** Here checking for Point,Polygon,LineString Data type and convert Array data-- Start */
          Object.entries(postData).forEach(([key, value]) => {
            const filterdata =
              state.apiData?.sysListColumnResponse?.ListColumn.find(
                (item1) => item1.entityField?.Name === key
              )
            if (
              filterdata?.entityField?.EntityFieldDataType?.Id ===
                'a9c5c8aa-16c0-48d1-f911-08d8fda71e06' ||
              filterdata?.entityField?.EntityFieldDataType?.Id ===
                '0fe8ab72-b0e5-49fb-f912-08d8fda71e06' ||
              filterdata?.entityField?.EntityFieldDataType?.Id ===
                'eef33ba4-21ba-43f2-f913-08d8fda71e06'
            ) {
              let obj = []
              if (
                value !== undefined &&
                value !== null &&
                value.trim() !== ''
              ) {
                try {
                  obj = JSON.parse(value.replace(/\s+/g, ''))
                } catch (error) {
                  invalidDataFlag = 1
                  showToastMessage('Invalid data', 'error')
                }
              }
              postData = { ...postData, [key]: obj }
            }
          })
          /** Here checking for Point,Polygon,LineString Data type and convert Array data-- End */

          if (invalidDataFlag === 0)
            mutateCoreData.mutate({
              mutationType: 'patch',
              requestBody: postData,
              recordId: data.id,
            })
        }
      }

      document.head.appendChild(styleSheet)

      dispatch({ type: 'ENABLE_NEWENTRY', enableNewEntry: true })
      dispatch({ type: 'SET_DATAUPDATED', dataUpdated: true })
      document.body.classList.remove('stop-scrolling')
    } else {
      deleteRow(data)
      dispatch({ type: 'ENABLE_NEWENTRY', enableNewEntry: false })
    }

    return null
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
        queryClient.invalidateQueries('isRecentitem')
        queryClient.invalidateQueries('pinnedData')
      },
    }
  )

  const UserFavourites = (data) => {
    getAPIData(
      'get',
      `${APIEndPoints.GetEntity.url}?$filter=Name eq '${sysEntity?.current}'&$expand=entityfield($expand=entityfielddatatype)`
    ).then((response) => {
      const Result = response.data.value[0]?.EntityField.find(
        (item) => item.IsDisplayName === true
      )
      const postData = {
        User: userId,
        sysParentEntityType: sysEntity?.current,
        sysParentEntityID: data.id,
        UserFavouritesType: 'History',
        Organisation: data && data?.Organisation[0]?.id,
        EntityDisplayText: Result?.DisplayName || '',
      }
      mutationUserFavourites.mutate(postData)
    })
  }

  const onEditClickHandler = (data) => {
    // if (userId) UserFavourites(data)
    history.push({
      pathname: `/formViewer`,
      search: `?entityName=${sysEntity.current}&entityId=${data.id}&listId=${listId.current}`,
      state: {
        dataId: data.id,
        sysListColumnId: listId.current,
        mode: 'edit',
      },
    })
  }

  const onCancelFormHandler = () => {
    dispatch({ type: 'SET_CreatePopup', isCreatePopupOpen: false })
  }

  const onGridEditFormHandler = (flag) => {
    dispatch({ type: 'SET_GridEditable', GridEditable: flag })
  }

  function onRowSelected() {
    // dispatch({ type: 'SET_GridEditable', GridEditable: false })
    // localStorage.setItem('editablerowdata', '{}')
  }

  async function onSaveFormHandler(data) {
    const postdata = {
      ...utils.removeKeyFromObject(data, [
        '_attachments',
        '_etag',
        '_rid',
        '_self',
        '_ts',
        'CreatedOn',
        'LastUpdatedDate',
      ])[0],
    }
    showLoading(true)
    getCoreData(
      'patch',
      `/api/${state.Popupdata.entityName}(${state.Popupdata.entityId})`,
      postdata
    )
      .then(() => {
        if (match.params.entityName?.toLowerCase() === 'menuitem') {
          // dont change invalidateQueries order
          queryClient.invalidateQueries('navGroup')
          queryClient.invalidateQueries('navSectionandItemData')

          queryClient.invalidateQueries('listViewer')
        }
        showToastMessage('Saved successfully')
      })
      .catch((err) => {
        showLoading(false)
        const errormsg = err?.response?.data ? err?.response?.data : err || ''
        showToastMessage(
          errormsg[0]?.Message ? errormsg[0]?.Message : errormsg.Result || '',
          'error'
        )
      })
      .finally(() => {
        showLoading(false)
        // dispatch({ type: 'SET_CreatePopup', isCreatePopupOpen: false })
      })

    // showToastMessage(err?.response?.data, 'error')
  }

  // async function LookupFiltervalue(lookupfilter) {
  //   const lookupfilterdata = []
  //   const entitydata = lookupfilter
  //   for (let i = 0; i <= lookupfilter.EntityField.length - 1; i++) {
  //     if (lookupfilter?.EntityField[i]?.LookupFilter) {
  //       const formSchema = await getCoreData(
  //         APIEndPoints.JsonToODataQuery.method,
  //         APIEndPoints.JsonToODataQuery.url,
  //         lookupfilter.EntityField[i].LookupFilter
  //       )
  //       lookupfilterdata.push({
  //         ...lookupfilter.EntityField[i],
  //         lookupfieldfilter: formSchema.data,
  //       })
  //     } else {
  //       lookupfilterdata.push({
  //         ...lookupfilter.EntityField[i],
  //         lookupfieldfilter: null,
  //       })
  //     }
  //   }
  //   const newdata = { ...entitydata, EntityField: lookupfilterdata }
  //   return newdata
  // }
  React.useEffect(() => {
    queryClient.resetQueries(['listViewer', `sysListColumns`])
  }, [listId.current])

  const sysListColumn = useQuery(
    ['listViewer', `sysListColumns`],
    () =>
      getCoreData(
        APIEndPoints.GetSysList.method,
        // `${APIEndPoints.GetSysList.url}(${listId.current})?$expand=ListColumn,ListIcon`
        `${APIEndPoints.GetSysList.url}(${listId.current}).GetViewDetails()`
      ).then((response) => {
        if (
          response.data &&
          !response.data.length &&
          response.data.length === 0
        )
          history.push('/404')

        sysEntity.current = response.data.length
          ? response.data[0].SysEntity
          : null
        return response.data.length ? response.data[0] : null
      }),
    {
      enabled: !!listId.current,
      // onSettled: () => {
      //   queryClient.resetQueries(['listViewer', `rowDataQuery`])
      // },
    }
  )

  // const filterQuery = useQuery(
  //   ['listViewer', 'filterQuery'],
  //   () => {
  //     if (_.isEmpty(sysListColumn.data.Filter)) return ''

  //     return getCoreData(
  //       APIEndPoints.JsonToODataQuery.method,
  //       `${APIEndPoints.JsonToODataQuery.url}`,
  //       sysListColumn.data.Filter
  //     ).then((response) => `&${response.data}`)
  //   },
  //   {
  //     enabled: sysListColumn.isFetched,
  //     onSettled: () => {
  //       queryClient.invalidateQueries(['listViewer', `rowDataQuery`])
  //     },
  //   }
  // )

  // Getting Data from API
  // `/api/${sysListColumn?.data?.SysEntity}?$expand=${entityLookups?.lookupEntityFieldNames}${filterQuery?.data}`

  const [
    rowDataQuery,
    // entityFieldsQuery,
    // optionSetsQuery,
    allEntitiesQuery,
    sysListsQuery,
  ] = useQueries([
    {
      queryKey: ['listViewer', `rowDataQuery`],
      queryFn: () => {
        /** Story 11955 - $select= Columns -- Start */
        gridColumnsValues = ''
        const relatedEntityExpand = []
        let finalRelatedValues = []
        let strRelatedEntity = ''

        sysListColumn &&
          sysListColumn?.data?.ListColumn?.map((item) => {
            if (item.Field !== undefined && item.EntityName == undefined) {
              gridColumnsValues = `${gridColumnsValues + item.Field},`
            } else if (item.EntityName && item.EntityName !== undefined) {
              relatedEntityExpand.push({
                EntityName: item.EntityName,
                Field: item.Field,
              })
            }
          })

        finalRelatedValues = relatedEntityExpand.reduce(function (r, a) {
          r[a.EntityName] = r[a.EntityName] || []
          r[a.EntityName].push(a.Field)
          return r
        }, Object.create(null))

        // entityLookupsClone = _.cloneDeep(entityLookups)

        Object.entries(finalRelatedValues).map(([key, value]) => {
          let relatedColumn = ''
          for (let i = 0; i < value.length; i++) {
            relatedColumn += `${value[i]},`
          }

          if (relatedColumn != '') {
            relatedEntity += `${key}($select=id,${relatedColumn.slice(0, -1)}),`
          }
          strRelatedEntity = `&$expand=${relatedEntity}`

          // entityLookupsClone &&
          //   Object.entries(entityLookupsClone?.lookupEntityFieldNames).map(
          //     ([entityKey, entityValue]) => {
          //       if (key === entityValue) {
          //         const index =
          //           entityLookupsClone?.lookupEntityFieldNames.indexOf(
          //             entityValue
          //           )
          //         entityLookupsClone?.lookupEntityFieldNames.splice(index, 1)
          //       }
          //     }
          //   )
        })

        /** Story 11955 - $select= Columns -- End */

        if (gridColumnsValues !== '') {
          gridColumnsValues = `,${gridColumnsValues}`
        }

        dispatch({
          type: 'SET_GRIDCOLUMNS',
          gridColumnsValues,
          relatedEntity: strRelatedEntity,
          // entityLookupsClone,
        })

        const responseData =
          getCoreData(
            'post',
            `/api/${history.location.pathname.substring(
              history.location.pathname.lastIndexOf('/') + 1,
              history.location.pathname.length
            )}?$select=id${gridColumnsValues?.replace(
              /,\s*$/,
              ''
            )}&$skip=0&$top=30&$count=true${strRelatedEntity.replace(
              /,\s*$/,
              ''
            )}`,
            {
              queryOptions: null,
              freeFlowFilter: sysListColumn?.data?.Filter
                ? JSON.parse(sysListColumn.data.Filter)
                : null,
            },
            utils.OdataAnnotations
          )
            .then((response) => response.data)
            .catch((err) => {
              showToastMessage(JSON.stringify(err?.response?.data), 'error')
            }) || []
        return responseData
      },
      enabled: sysListColumn.isFetched,
      onSettled: () => {
        // Whenever we get new row data, we need to allow grid rows to refresh.
        dispatch({
          type: 'SET_REFRESHGRIDROWDATA',
          refreshGridRowData: true,
        })
      },
    },
    // {
    //   queryKey: ['listViewer', sysListColumn, 'entityFieldsQuery'],
    //   queryFn: () =>
    //     getAPIData(
    //       APIEndPoints.GetEntity.method,
    //       `${APIEndPoints.GetEntity.url}?$filter=Name eq '${sysListColumn?.data?.SysEntity}'&$expand=entityfield($expand=entityfielddatatype)`
    //     ).then((response) => response.data.value[0]),
    //   enabled: sysListColumn.isFetched,
    // },
    // {
    //   queryKey: ['listViewer', 'optionSetsQuery'],
    //   queryFn: () =>
    //     getAPIData(
    //       APIEndPoints.GetEntityFieldOptionset.method,
    //       `${APIEndPoints.GetEntityFieldOptionset.url}?$expand=OptionSetOptions`
    //     ).then((response) => response.data.value),
    //   enabled: sysListColumn.isFetched,
    // },

    {
      queryKey: ['listViewer', 'allEntitiesQuery'],
      queryFn: () =>
        getAPIData(
          APIEndPoints.GetEntity.method,
          `${APIEndPoints.GetEntity.url}?$expand=EntityField`
        ).then((response) => response.data.value),
      enabled: sysListColumn.isFetched,
    },
    {
      queryKey: ['listViewer', sysListColumn, 'sysListsQuery'],
      queryFn: () =>
        getCoreData(
          APIEndPoints.GetSysList.method,
          `${APIEndPoints.GetSysList.url}?$filter=SysEntity eq '${sysListColumn?.data?.SysEntity}' and contains(UseType,'View')&$select=id,ListName`
        ).then((response) => response.data),
      enabled: sysListColumn.isFetched,
    },
  ])

  React.useEffect(() => {
    async function fetchData() {
      if (
        !isFetching &&
        rowDataQuery.data &&
        // entityFieldsQuery.data &&
        // optionSetsQuery.data &&
        allEntitiesQuery.data &&
        sysListsQuery.data &&
        state.refreshGridRowData
      ) {
        /** Here checking for Point,Polygon,LineString Data type and convert Array data-- Start */
        setrowcount(rowDataQuery?.data[0]?.Count)
        const rowDataClone = _.cloneDeep(rowDataQuery?.data[0]?.Value)
        let rowData = []
        showLoading(true)
        const updatedRecords =
          rowDataClone &&
          rowDataClone.length &&
          rowDataClone.map((rowValue) => {
            Object.entries(rowValue).forEach(([key, value]) => {
              const filterdata = sysListColumn?.data?.ListColumn.find(
                (itemIN) => itemIN?.entityField?.Name === key
              )

              if (
                filterdata?.entityField?.EntityFieldDataType?.Id ===
                  'a9c5c8aa-16c0-48d1-f911-08d8fda71e06' ||
                filterdata?.entityField?.EntityFieldDataType?.Id ===
                  '0fe8ab72-b0e5-49fb-f912-08d8fda71e06' ||
                filterdata?.entityField?.EntityFieldDataType?.Id ===
                  'eef33ba4-21ba-43f2-f913-08d8fda71e06'
              ) {
                rowValue[key] = JSON.stringify(
                  value?.coordinates ? value?.coordinates : value || ''
                )
              }
            })
            return rowValue
          })
        rowData = updatedRecords

        /** Here checking for Point,Polygon,LineString Data type and convert Array data-- End */

        // const injectedDatatypeComponent12 = await LookupFiltervalue(
        //   entityFieldsQuery.data
        // )

        // dispatch({
        //   type: 'SET_APIOPTIONSETDATA',
        //   apiOptionSetData: optionSetsQuery.data,
        // })
        showLoading(false)

        if (
          state.apiData.sysListColumnResponse !== sysListColumn.data ||
          state.apiData.rowDataResponse !== rowData ||
          // state.apiData.entityFields !== entityFieldsQuery.data ||
          state.apiData.allEntities !== allEntitiesQuery.data ||
          state.apiData.sysLists !== sysListsQuery.data
        )
          dispatch({
            type: 'SET_APIDATA',
            apiData: {
              sysListColumnResponse: sysListColumn.data,
              rowDataResponse: rowData || [],
              // entityFields: entityFieldsQuery.data,
              allEntities: allEntitiesQuery.data,
              sysLists: sysListsQuery.data,
            },
          })
        dispatch({
          type: 'SET_REFRESHGRIDROWDATA',
          refreshGridRowData: true,
        })
        dispatch({ type: 'SET_DATAUPDATED', dataUpdated: false })
        dispatch({
          type: 'ENABLE_NEWENTRY',
          enableNewEntry: !sysListColumn?.data?.ReadOnly || false,
        })
      }
    }
    fetchData()
  }, [isFetching, listId.current])

  // * The below code is refactored to react-query
  // React.useEffect(() => {
  //   async function fetchData() {
  //     let filterParams = ''
  //     let isvalidquery = true

  //     showLoading(true)
  //     const sysListColumn = await getCoreData(
  //       APIEndPoints.GetSysList.method,
  //       `${APIEndPoints.GetSysList.url}?$expand=ListColumn&$filter=id eq '${listId.current}'`
  //     )

  //     if (sysListColumn.data && sysListColumn.data.length === 0) {
  //       history.push('/404')
  //       showLoading(false)
  //     }

  //     sysEntity.current = sysListColumn.data[0].SysEntity
  //     if (sysListColumn.status === 200) {
  //       let JsonToODataQueryvalue = ''
  //       if (sysListColumn.data[0]?.Filter)
  //         // filterParams += `${sysListColumn.data[0].Filter}&`

  //         JsonToODataQueryvalue = await getCoreData(
  //           APIEndPoints.JsonToODataQuery.method,
  //           `${APIEndPoints.JsonToODataQuery.url}`,
  //           sysListColumn.data[0].Filter
  //         )
  //           .then((JsonToODataQueryvalue) => {
  //             if (sysListColumn.status === 200) {
  //               filterParams += `&${JsonToODataQueryvalue.data}`
  //             } else {
  //               isvalidquery = false
  //               showToastMessage(
  //                 JSON.stringify(JsonToODataQueryvalue.data[0].Message),
  //                 'error'
  //               )
  //             }
  //           })
  //           .catch((err) => {
  //             isvalidquery = false
  //             showToastMessage(JSON.stringify(err?.response?.data), 'error')
  //           })
  //           .finally(() => {})
  //       await Promise.allSettled([
  //         getCoreData(
  //           'get',
  //           `/api/${sysListColumn.data[0].SysEntity}?$expand=${entityLookups.lookupEntityFieldNames}${filterParams}`
  //         ),
  //         getAPIData(
  //           APIEndPoints.GetEntity.method,
  //           `${APIEndPoints.GetEntity.url}?$filter=Name eq '${sysListColumn.data[0].SysEntity}'&$expand=entityfield($expand=entityfielddatatype)`
  //         ),
  //         getAPIData(
  //           APIEndPoints.GetEntityFieldOptionset.method,
  //           `${APIEndPoints.GetEntityFieldOptionset.url}?$expand=OptionSetOptions`
  //         ),
  //         getCoreData(
  //           APIEndPoints.GetSysList.method,
  //           `${APIEndPoints.GetSysList.url}?$expand=ListColumn&$filter=SysEntity eq ${sysListColumn.data[0].SysEntity} and contains(UseType,'View')`
  //         ),
  //         getAPIData(
  //           APIEndPoints.GetEntity.method,
  //           `${APIEndPoints.GetEntity.url}?$expand=EntityField`
  //         ),
  //       ])
  //         .then(
  //           async ([
  //             originalRowData,
  //             entityFields,
  //             optionSets,
  //             sysLists,
  //             allEntities,
  //           ]) => {
  //             /** Here checking for Point,Polygon,LineString Data type and convert Array data-- Start */
  //             const rowDataClone = _.cloneDeep(originalRowData?.value?.data)
  //             let rowData = []

  //             const updatedRecords =
  //               rowDataClone &&
  //               rowDataClone.map((rowValue) => {
  //                 Object.entries(rowValue).forEach(([key, value]) => {
  //                   const filterdata = entityFields?.value?.data?.value[0]?.EntityField.find(
  //                     (itemIN) => itemIN.Name === key
  //                   )

  //                   if (
  //                     filterdata?.EntityFieldDataType?.Id ===
  //                       'a9c5c8aa-16c0-48d1-f911-08d8fda71e06' ||
  //                     filterdata?.EntityFieldDataType?.Id ===
  //                       '0fe8ab72-b0e5-49fb-f912-08d8fda71e06' ||
  //                     filterdata?.EntityFieldDataType?.Id ===
  //                       'eef33ba4-21ba-43f2-f913-08d8fda71e06'
  //                   ) {
  //                     rowValue[key] = JSON.stringify(
  //                       value?.coordinates ? value?.coordinates : value || ''
  //                     )
  //                   }
  //                 })
  //                 return rowValue
  //               })
  //             rowData = updatedRecords
  //             /** Here checking for Point,Polygon,LineString Data type and convert Array data-- End */
  //             const injectedDatatypeComponent12 = await LookupFiltervalue(
  //               entityFields.value.data.value[0]
  //             )
  //             dispatch({
  //               type: 'SET_APIDATA',
  //               apiData: {
  //                 sysListColumnResponse: sysListColumn.data[0],
  //                 rowDataResponse: (isvalidquery && rowData) || [],
  //                 entityFields: injectedDatatypeComponent12,
  //                 optionSets: optionSets.value.data.value,
  //                 sysLists: sysLists.value.data,
  //                 allEntities: allEntities.value.data.value,
  //               },
  //             })
  //             dispatch({ type: 'SET_DATAUPDATED', dataUpdated: false })
  //             dispatch({
  //               type: 'ENABLE_NEWENTRY',
  //               enableNewEntry: !sysListColumn.data[0]?.ReadOnly,
  //             })
  //           }
  //         )
  //         .catch((err) => {
  //           showLoading(false)
  //           showToastMessage(err.message, 'error')
  //         })
  //         .finally(() => {
  //           showLoading(false)
  //         })
  //     }
  //     showLoading(false)
  //   }
  //   if (entityLookups) fetchData()
  // }, [showToastMessage, state.dataUpdated, listId.current, entityLookups])

  React.useEffect(() => {
    const {
      sysListColumnResponse,
      rowDataResponse,
      // entityFields,
      allEntities,
    } = state.apiData

    const optionSets = state.apiOptionSetData
    let groupingEnabled = false
    if (sysListColumnResponse && rowDataResponse && state.gridAPI) {
      if (
        sysListColumnResponse.ReadOnly ||
        sysListColumnResponse.ReadOnly === 'true'
      )
        // Override Column properties
        overrideColumnProperty.editable = false

      let gridColumns = utils.generateGridColumns(
        _.filter(sysListColumnResponse.ListColumn, { Hide: false }),
        // sysListColumnResponse.ListColumn,
        defaultColumnProperties,
        overrideColumnProperty,
        {
          useValueSetter: true,
          parentEntity: sysEntity.current,
          screenName: 'LIST_VIEWER',
        },
        // entityFields.EntityField,
        rowDataResponse,
        allEntities
      )

      // Provide cell editors based on datatype
      gridColumns = utils.provideCellEditors(
        gridColumns,
        {
          // entityFields: entityFields.EntityField,
          optionSets,
          allEntities,
          syslistitem: ListItems.data && ListItems.data,
        },
        sysEntity.current,
        listId.current,
        history,
        sysListColumn.data,
        onRowModalClick,
        onGridEditClick
      )

      // Column for Edit
      // gridColumns.unshift({
      //   headerName: '',
      //   field: 'edit',
      //   cellRenderer: 'FFMoreVertIcon',
      //   width: 40,
      //   suppressMovable: true,
      //   sortable: false,
      //   filter: false,
      //   resizable: false,
      //   lockVisible: true,
      //   ColumnIndex: -3,
      // })

      // Column for quick view
      // gridColumns.unshift({
      //   headerName: '',
      //   field: 'quickviewicon',
      //   width: 50,
      //   cellRenderer: 'IconCell',
      //   cellRendererParams: {
      //     IconComponent: VisibilityOutlinedIcon,
      //     onClickHandler: onRowModalClick,
      //   },
      //   suppressMenu: true,
      //   suppressMovable: true,
      //   sortable: false,
      //   filter: false,
      //   resizable: false,
      //   lockVisible: true,
      //   ColumnIndex: -2,
      // })

      gridColumns.unshift({
        headerName: '',
        field: 'edit',
        checkboxSelection: true,
        width: 50,
        // suppressMenu: true,
        // suppressMovable: true,
        sortable: false,
        filter: false,
        resizable: false,
        lockVisible: true,
        ColumnIndex: -2,
      })

      // Column for Icon cell
      if (
        sysListColumnResponse.IsShowIconsInList ||
        sysListColumnResponse.IsShowIconsInList === 'true'
      )
        gridColumns.unshift({
          headerName: '',
          field: 'listicon',
          cellRenderer: 'ListIconRenderer',
          width: 50,
          suppressMenu: true,
          suppressMovable: true,
          sortable: false,
          filter: false,
          resizable: false,
          ColumnIndex: -1,
          cellRendererParams: {
            // entityDetails: entityFields,
            entityDetails: sysListColumnResponse,
            iconFieldID: sysListColumnResponse?.IconField,
            listIconID: sysListColumnResponse?.ListIcon,
          },
        })

      // Position columns based on ColumnIndex
      gridColumns = _.sortBy(gridColumns, ['ColumnIndex'])
      groupingEnabled = _.some(gridColumns, { enableRowGroup: true })
      const gridProperties = generateGridProperties(sysListColumnResponse)

      dispatch({
        type: 'SET_GRIDDATASOURCE',
        gridDatasource: {
          ...gridProperties,
          columnDefs: gridColumns,
          // rowData: rowDataResponse,
          editType: 'fullRow',
          rowGroupPanelShow: groupingEnabled ? 'always' : 'never',
          onRowEditingStarted: ({ data }) => {
            editingData.current = { ...data }

            const styles = `.ag-body-viewport.ag-layout-normal {  overflow-y: hidden; }`
            const styleSheet = document.createElement('style')
            styleSheet.type = 'text/css'
            styleSheet.innerText = styles
            document.head.appendChild(styleSheet)

            // document.body.classList.add('stop-scrolling')
          },
          onRowEditingStopped: ({ data }) => onEditingStoppedHandler(data),
          onRowSelected,
          suppressClickEdit: true, // sysListColumn.data?.EditMode !== 'Inline',
          rowSelection: 'multiple',
        },
      })

      if (state.refreshGridRowData) {
        /*eslint-disable */

        var dataSource = {
          // rowCount: null,
          async getRows(rowParams) {
            //Setting row data for initial load.
            let rowData = rowDataResponse
            if (rowParams.startRow != 0) {
              let coreBusinessData = await getCoreData(
                'post',
                `/api/${
                  sysListColumn?.data?.SysEntity
                }?$select=id${state.GridColumnsValues.replace(
                  /,\s*$/,
                  ''
                )}&$skip=${rowParams.startRow}&$top=${
                  rowParams.endRow - rowParams.startRow
                }&$count=true${state.RelatedEntity.replace(/,\s*$/, '')}`,
                {
                  queryOptions: null,
                  freeFlowFilter: sysListColumn?.data?.Filter
                    ? JSON.parse(sysListColumn.data.Filter)
                    : null,
                },
                utils.OdataAnnotations
              )
                .then((response) => {
                  const rowDataClone = _.cloneDeep(response?.data[0]?.Value)
                  const updatedRecords =
                    rowDataClone &&
                    rowDataClone.length &&
                    rowDataClone.map((rowValue) => {
                      Object.entries(rowValue).forEach(([key, value]) => {
                        const filterdata = sysListColumn?.data?.ListColumn.find(
                          (itemIN) => itemIN?.entityField?.Name === key
                        )

                        if (
                          filterdata?.entityField?.EntityFieldDataType?.Id ===
                            'a9c5c8aa-16c0-48d1-f911-08d8fda71e06' ||
                          filterdata?.entityField?.EntityFieldDataType?.Id ===
                            '0fe8ab72-b0e5-49fb-f912-08d8fda71e06' ||
                          filterdata?.entityField?.EntityFieldDataType?.Id ===
                            'eef33ba4-21ba-43f2-f913-08d8fda71e06'
                        ) {
                          rowValue[key] = JSON.stringify(
                            value?.coordinates
                              ? value?.coordinates
                              : value || ''
                          )
                        }
                      })
                      return rowValue
                    })
                  return updatedRecords
                })
                .catch((err) => {
                  showToastMessage(JSON.stringify(err?.response?.data), 'error')
                })
              rowData = coreBusinessData
            }
            rowData &&
              rowData.length !== 0 &&
              rowParams.successCallback(rowData, rowcount)
          },
        }
        state.gridAPI?.api?.setDatasource(dataSource)
        dispatch({
          type: 'SET_REFRESHGRIDROWDATA',
          refreshGridRowData: false,
        })
      }
    }
  }, [state.apiData, state.gridAPI, listId.current])

  React.useEffect(() => {
    const { apiData, enableNewEntry } = state

    // Action field
    const actionFields = [
      {
        actionComponent: componentLookup.ActionButton,
        componentProps: {
          Label: 'New Entry',
          Icon: Add,
          CSSName: '',
          onClick: addNewRow,
          disabled: !enableNewEntry,
        },
      },
    ]
    setActionFields({ actionFields })
  }, [state, addNewRow, setActionFields, history, listId.current])

  const ListviewgridRowEditingStop = () => {
    const { gridAPI } = state
    if (editingData.current !== null && editingData.current !== undefined) {
      const CurrentRowid = editingData.current.id
      const node = gridAPI.api.getRowNode(CurrentRowid)
      if (node !== undefined && node !== null) {
        gridAPI.api.stopEditing({
          rowIndex: node.rowIndex,
          colKey: gridAPI.columnApi.getAllColumns()[0].colId,
        })
      }
    }
  }

  return (
    <>
      <div className="listview-viewer">
        <div className="listviewer-lists">
          <FFDropdown
            Field={{
              FieldValue: 'listviewer-lists',
              FieldLabel: 'List views',
              DefaultValue: listId.current,
              Datasource: state.apiData.sysLists || [],
              TextField: 'ListName',
              ValueField: 'id',
            }}
            value={listId.current}
            onChangeHandler={(event, params) => {
              // queryClient.invalidateQueries([
              //   'listViewer',
              //   `sysListColumns-${listId.current}`,
              // ])
              dispatch({
                type: 'SET_REFRESHGRIDROWDATA',
                refreshGridRowData: true,
              })
              history.push({
                pathname: `/list/${state.apiData.sysListColumnResponse.SysEntity}`,
                search: `?listId=${params.value}`,
              })

              // location.reload()
            }}
          />
        </div>
        {/* <div className="listviewer-grid"> */}
        <FFGrid
          dataSource={state.gridDatasource}
          onGridReady={onGridReady}
          onEdit={(data) => onEditClickHandler(data)}
          entityName={sysEntity.current}
          rowModelType="infinite"
          paginationPageSize={30}
          cacheOverflowSize={1}
          infiniteInitialRowCount={30}
          maxBlocksInCache={10}
          maxConcurrentDatasourceRequests={1}
          cacheBlockSize={30}
          onGridRowEditHandler={onGridEditFormHandler}
          className="listviewer-grid"
        />
        {/* </div> */}
      </div>
      {/* <div id="EntityPopup" className="EntityPopup"> */}
      <div className="entities_popup">
        {state.isCreatePopupOpen && (
          <PopupFormViewer
            showModal={state.isCreatePopupOpen}
            CancelFormHandler={onCancelFormHandler}
            SaveFormHandler={onSaveFormHandler}
            editData={state.Popupdata}
            history={history}
            listId={state.Popupdata.entityId}
          />
        )}
        {/* </div> */}
      </div>
    </>
  )
}

export default ListViewViewer
