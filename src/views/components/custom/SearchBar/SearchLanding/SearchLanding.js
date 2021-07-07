import React, { useReducer } from 'react'
import { useQueries } from 'react-query'
import { useHistory } from 'react-router-dom'
import apiEndPoints from '../../../../../models/api/apiEndpoints'
import getAPIData, { getCoreData } from '../../../../../models/api/api'
import FFDropdown from '../../../base/FFDropdown/FFDropdown'
import FFGrid from '../../../base/FFGrid/FFGrid'
import useAppContext from '../../../hooks/useToast'
import './SearchLanding.css'

const SearchLanding = ({ searchValue }) => {
  const { showToastMessage, showLoading } = useAppContext()
  const [searchResult, setSearchResult] = React.useState([])
  const [value, setValue] = React.useState('')
  const history = useHistory()

  const [state, dispatch] = useReducer(reducer, {
    gridDatasource: {
      columnDefs: [],
      rowData: [],
      sysList: [],
      sysListView: '',
      syslistId: '',
    },
    data: [],
    SysListColumnData: [],
    entitydata: [],
    entityFielddata: [],
  })
  React.useEffect(() => {
    dispatch({
      type: 'clear',
    })
  }, [searchValue])

  function reducer(state, action) {
    switch (action.type) {
      case 'onchange':
        return {
          ...state,
          changeSysListView: changeSysListView(action.data),
        }
      case 'gridDatasource':
        return {
          ...state,
          // gridDatasource: { ...action.datasource },
          data: [...state.data, { ...action.datasource }],
        }

      case 'reRender':
        return {
          ...state,

          SysListColumnData: [
            ...state.SysListColumnData,
            ...action.reRender.sysRenderList,
          ],
        }
      case 'clear':
        return {
          ...state,
          gridDatasource: {
            columnDefs: [],
            rowData: [],
            sysList: [],
            sysListView: '',
            syslistId: '',
          },
          data: [],
          SysListColumnData: [],
        }
      case 'entitydata':
        return {
          ...state,
          entitydata: [...action.entitydata],
        }
      case 'entityFielddata':
        return {
          ...state,
          entityFielddata: [...action.entityFielddata],
        }

      default: {
        return state
      }
    }
  }

  const onEdit = (e, sysListView, syslistId) => {
    history.push({
      pathname: `/formViewer`,
      search: `?entityName=${sysListView}&entityId=${e.id}&listId==${syslistId}`,
    })
  }
  const rowActions = [
    {
      ActionName: 'Edit',
      ActionHandler: onEdit,
    },
  ]
  const { SysListColumnData } = state

  function changeSysListView(syslistId) {
    const reSysListColumnData =
      SysListColumnData &&
      SysListColumnData.find((syslist) => {
        return syslist.id === syslistId
      })

    return (
      state &&
      state.data.length !== 0 &&
      state.data.map((item) => {
        if (reSysListColumnData.SysEntity === item.sysListView) {
          item.columnDefs = [
            {
              headerName: '',
              field: 'edit',
              cellRenderer: 'FFMoreVertIcon',
              width: 40,
              suppressMenu: false,
              lockVisible: true,
            },
            ...reSysListColumnData.ListColumn.reduce((acc, cur) => {
              return acc.concat({
                headerName: cur?.Caption || cur?.Field,
                field: cur.Field,
                hide: cur.Hide || false,
              })
            }, []),
          ]
          item.rowData = rowResult(item.rowData, item.sysListView)
          item.sysList = item.sysList
          item.syslistId = syslistId
        }
        return item
      })
    )
  }

  React.useEffect(() => {
    async function fetchdata() {
      setValue('')
      showLoading(true)
      await getCoreData(
        apiEndPoints.SearchBarQuery.method,
        `${apiEndPoints.SearchBarQuery.url}?$term=${searchValue}`
      )
        .then((response) => {
          setSearchResult(response.data)
          showLoading(false)
          if (response?.data && response?.data?.length === 0)
            setValue('No Result Found')
        })
        .catch((err) => {
          showLoading(false)
          showToastMessage(err.message, 'error')
        })
    }
    fetchdata()
  }, [searchValue])

  useQueries([
    {
      queryKey: ['Entity', { type: 'entitydata' }],
      queryFn: () =>
        getAPIData(
          apiEndPoints.GetEntity.method,
          `${apiEndPoints.GetEntity.url}?&$expand=EntityField($filter=EntityFieldDataType/Name eq 'Lookup')`
        ).then((response) => response.data.value),

      onSuccess: (data) => {
        dispatch({
          type: 'entitydata',
          entitydata: data,
        })
      },
    },
    {
      queryKey: ['entityField', 'entityFielddata'],
      queryFn: () =>
        getAPIData(
          apiEndPoints.GetAllEntityField.method,
          `${apiEndPoints.GetAllEntityField.url}`
        ).then((response) => response.data.value),
      onSuccess: (data) => {
        dispatch({
          type: 'entityFielddata',
          entityFielddata: data,
        })
      },
    },
  ])

  function rowResult(orginalArr, entityName) {
    let lookupEntity = null
    let lookupEntityField = null
    let LookupTextField = null
    if (!orginalArr || orginalArr.length <= 0) return []
    lookupEntity =
      state.entitydata &&
      state.entitydata.find((entity) => entity.Name === entityName)

    return orginalArr.map((obj) => {
      const entries = Object.entries(obj)
      const lookupEntityTextField = entries.reduce((acc, [key, value]) => {
        if (typeof value === 'object') {
          if (lookupEntity) {
            lookupEntityField = lookupEntity.EntityField.find(
              (entityField) =>
                entityField.Name?.toLowerCase() === key?.toLowerCase()
            )
          }

          if (lookupEntityField) {
            LookupTextField =
              state.entityFielddata &&
              state.entityFielddata.find(
                (entityfield) =>
                  entityfield.Id?.toLowerCase() ===
                  lookupEntityField.LookupTextField?.toLowerCase()
              )
          }

          acc = { ...acc, [key]: (value && value[LookupTextField?.Name]) || '' }
        }

        return acc
      }, {})

      return {
        ...obj,
        ...lookupEntityTextField,
      }
    })
  }

  React.useEffect(() => {
    async function fetchdata() {
      setValue('')
      return (
        searchResult &&
        searchResult.map((List) => {
          showLoading(true)
          Object.values(List).map((entity) => {
            showLoading(true)
            getCoreData(
              apiEndPoints.GetSysList.method,
              `${apiEndPoints.GetSysList.url}?$expand=ListColumn&$filter=SysEntity eq '${entity.name}'`
            ).then((response) => {
              const IsUsedinSearchPage =
                response.data &&
                response.data.filter((syslist) => {
                  return syslist.IsUsedinSearchPage === true
                })
              if (IsUsedinSearchPage && IsUsedinSearchPage.length === 0) {
                // setValue('Global search configuration has not been applied')
              }
              dispatch({
                type: 'gridDatasource',
                datasource: {
                  columnDefs: [
                    {
                      headerName: '',
                      field: 'edit',
                      cellRenderer: 'FFMoreVertIcon',
                      width: 40,
                      suppressMenu: false,
                      lockVisible: true,
                    },
                    ...(IsUsedinSearchPage &&
                      IsUsedinSearchPage[0]?.ListColumn.reduce((acc, cur) => {
                        return acc.concat({
                          headerName: cur?.Caption || cur?.Field,
                          field: cur.Field,
                          hide: cur.Hide || false,
                        })
                      }, [])),
                  ],
                  rowData: rowResult(entity.results, entity.name),
                  sysList: IsUsedinSearchPage, // response.data,
                  sysListView: entity.name,
                  syslistId: IsUsedinSearchPage[0]?.id,
                  rowActions,
                },
              }),
                dispatch({
                  type: 'reRender',
                  reRender: {
                    sysRenderList: IsUsedinSearchPage, // response.data,
                  },
                })
              // if (IsUsedinSearchPage && IsUsedinSearchPage.length === 0) {
              //   setValue('Global search configuration has not been applied')
              // }
              showLoading(false)
            })
            showLoading(false)
          })
        })
      )
    }
    fetchdata()
  }, [searchResult])

  const { data } = state
  if (data.length == 0) return <span className="searchData">{value}</span>
  return (
    <div className="Search__Page__container">
      {data.map((item) => (
        <div className="Search__Page__Items">
          {/* {item.sysList && item.sysList.length > 1 && ( */}
          <div className="sysList">
            <div style={{ 'padding-bottom': '1rem' }}>
              {item.sysListView && item.sysListView}
            </div>
            <FFDropdown
              variant="outlined"
              name={item.sysListView && item.sysListView}
              Field={{
                FieldValue: 'sys List',
                FieldLabel: 'List View',
                DefaultValue: '',
                Datasource: (item.sysList && item.sysList) || [],
                TextField: 'Title',
                ValueField: 'id',
              }}
              value={(item.syslistId && item.syslistId) || item.sysList[0]?.id}
              onChangeHandler={(e) =>
                dispatch({ type: 'onchange', data: e.target.value })
              }
            />
          </div>
          {/* )} */}
          <FFGrid
            onEdit={(e) => onEdit(e, item.sysListView, item.syslistId)}
            dataSource={{
              columnDefs: item.columnDefs && item.columnDefs,
              rowData: item.rowData && item.rowData,
            }}
          />
        </div>
      ))}
    </div>
  )
}
export default SearchLanding
