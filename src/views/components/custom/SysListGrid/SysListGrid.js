import React from 'react'
import { useQuery, useQueries, useIsFetching } from 'react-query'
import _ from 'lodash'
import PropTypes from 'prop-types'
import useAppContext from '../../hooks/useToast'
import FFGrid from '../../base/FFGrid/FFGrid'
import getAPIData, { getCoreData } from '../../../../models/api/api'
import APIEndPoints from '../../../../models/api/apiEndpoints'
import utils from '../../../../utils/utils'
import useEntityLookups from '../../hooks/useEntityLookups'
import './SysListGrid.css'

function sysListGridReducer(state, action) {
  switch (action.type) {
    case 'SET_GRIDDATASOURCE':
      return { ...state, gridDatasource: action.payload }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const SysListGrid = ({
  className,
  sysListId,
  sysParentEntityId,
  useCustomData,
  filterQuery,
  useExternalFilters,
  onDelete,
  isFileManagerDelete,
  gridSelectmode,
  onSelectionChanged,
}) => {
  const initialState = {
    gridDatasource: { columnDefs: [], rowData: null },
  }

  const [state, dispatch] = React.useReducer(sysListGridReducer, initialState)
  const isFetching = useIsFetching()
  const { showToastMessage } = useAppContext()
  let relatedEntity = ''
  let gridColumnsValues = ''
  let entityLookupsClone = []

  const sysListData = useQuery(
    ['sysListGrid', sysListId, 'sysListData'],
    () =>
      getCoreData(
        APIEndPoints.GetSysList.method,
        // `${APIEndPoints.GetSysList.url}(${sysListId})?$expand=ListColumn,ListIcon`
        `${APIEndPoints.GetSysList.url}(${sysListId}).GetViewDetails()`
      ).then((response) => response.data[0]),
    {
      enabled: !!sysListId,
    }
  )

  const entityLookups = useEntityLookups(sysListData.data?.SysEntity, {
    includeBaseEntityId: true,
  })

  const [rowData, optionSets, allEntities] = useQueries([
    {
      queryKey: ['sysListGrid', sysListId, 'rowData'],
      queryFn: () => {
        let QueryAPIUrl = ''

        if (useCustomData) return useCustomData

        // if (sysListData.data?.Filter && sysParentEntityId)
        //   filterParams = `&${sysListData.data.Filter} and sysParentEntityID eq ${sysParentEntityId}`
        // else if (sysParentEntityId)
        //   filterParams = `&$filter=sysParentEntityID eq ${sysParentEntityId}`

        // if (!_.isEmpty(filterQuery))
        //   filterParams = `${
        //     filterParams
        //       ? `${filterParams} and ${filterQuery}`
        //       : `&$filter=${filterQuery}`
        //   }`

        // return getCoreData(
        //   'get',
        //   `/api/${sysListData.data.SysEntity}?$expand=${entityLookups.lookupEntityFieldNames}${filterParams}`
        // ).then((response) => response.data)

        /** Story 11955 - $select= Columns -- Start */
        gridColumnsValues = ''
        const relatedEntityExpand = []
        let finalRelatedValues = []

        sysListData &&
          sysListData?.data?.ListColumn?.map((item) => {
            if (
              item.Hide == false &&
              item.Field !== undefined &&
              item.EntityName == undefined
            ) {
              gridColumnsValues = `${gridColumnsValues + item.Field},`
            } else if (
              item.Hide == false &&
              item.EntityName &&
              item.EntityName !== undefined
            ) {
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

        entityLookupsClone = _.cloneDeep(entityLookups)

        Object.entries(finalRelatedValues).map(([key, value]) => {
          let relatedColumn = ''
          for (let i = 0; i < value.length; i++) {
            relatedColumn += `${value[i]},`
          }

          if (relatedColumn != '') {
            relatedEntity += `,${key}($select=id,${relatedColumn.slice(0, -1)})`
          }

          entityLookupsClone &&
            Object.entries(entityLookupsClone?.lookupEntityFieldNames).map(
              ([entityKey, entityValue]) => {
                if (key === entityValue) {
                  const index =
                    entityLookupsClone?.lookupEntityFieldNames.indexOf(
                      entityValue
                    )
                  entityLookupsClone?.lookupEntityFieldNames.splice(index, 1)
                }
              }
            )
        })

        if (gridColumnsValues != '') {
          gridColumnsValues = `,${gridColumnsValues}`
        }
        /** Story 11955 - $select= Columns -- End */

        const sysEntityQuery = `/api/${
          sysListData.data.SysEntity
        }?$select=id${gridColumnsValues?.replace(/,\s*$/, '')}&$expand=${
          entityLookupsClone.lookupEntityFieldNames
        }${relatedEntity}`

        if (sysParentEntityId == null && !_.isEmpty(filterQuery)) {
          QueryAPIUrl = `${sysEntityQuery}${`&$filter=${filterQuery}`}`
        } else if (sysParentEntityId) {
          QueryAPIUrl = `${sysEntityQuery}&$filter=sysParentEntityID eq ${sysParentEntityId}`
        }

        if (sysListData.data?.Filter && sysParentEntityId) {
          return getCoreData('Post', `${sysEntityQuery}`, {
            queryOptions: null,
            freeFlowFilter: sysListData?.data?.Filter
              ? JSON.parse(sysListData.data.Filter)
              : null,
          })
            .then((response) => response.data)
            .catch((err) => {
              showToastMessage(JSON.stringify(err?.response?.data), 'error')
            })
        }

        return getCoreData('get', QueryAPIUrl)
          .then((response) => response.data)
          .catch((err) => {
            showToastMessage(JSON.stringify(err?.response?.data), 'error')
          })
      },
      enabled: sysListData.isFetched && !!entityLookups?.lookupEntityFieldNames,
    },
    // {
    //   queryKey: ['sysListGrid', 'entityFields'],
    //   queryFn: () =>
    //     getAPIData(
    //       APIEndPoints.GetEntity.method,
    //       `${APIEndPoints.GetEntity.url}?$filter=Name eq '${sysListData.data.SysEntity}'&$expand=entityfield($expand=entityfielddatatype)`
    //     ).then((response) => response.data.value[0]),
    //   enabled: sysListData.isFetched,
    // },
    {
      queryKey: ['sysListGrid', 'optionSets'],
      queryFn: () =>
        getAPIData(
          APIEndPoints.GetEntityFieldOptionset.method,
          `${APIEndPoints.GetEntityFieldOptionset.url}?$expand=OptionSetOptions`
        ).then((response) => response.data.value),
      enabled: sysListData.isFetched,
    },
    {
      queryKey: ['sysListGrid', 'allEntities'],
      queryFn: () =>
        getAPIData(
          APIEndPoints.GetEntity.method,
          `${APIEndPoints.GetEntity.url}?$expand=EntityField`
        ).then((response) => response.data.value),
      enabled: sysListData.isFetched,
    },
  ])

  const overrideColumnProperty = { editable: false }

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

  /* Uncomment when editing is needed
  function onEditingStoppedHandler(data) {
    let postData = {}
    let crudType = null

    if (!_.isEmpty(data)) {
      crudType = data.mode || 'edit'
      delete data.mode

      if (crudType === 'add') {
        delete data.id

        if (_.isEmpty(data)) return null

        postData = {
          Data: {
            ...data,
          },
          DataKey: {
            StoreType: 'Document',
            Organisation: 'NorthHerts',
          },
        }

        getCoreData(
          'post',
          `/api/${state.apiData.sysListColumnResponse.SysEntity}`,
          postData
        )
          .then(() => showToastMessage('Saved successfully'))
          .catch((err) => showToastMessage(err.message, 'error'))
      } else {
        postData = {
          Data: {
            ...utils.removeKeyFromObject(data, [
              '_attachments',
              '_etag',
              '_rid',
              '_self',
              '_ts',
              'CreatedOn',
            ])[0],
          },
          DataKey: {
            StoreType: 'Document',
            Organisation: 'NorthHerts',
          },
        }

        getCoreData(
          'patch',
          `/api/${state.apiData.sysListColumnResponse.SysEntity}(${data.id})`,
          postData
        )
          .then(() => showToastMessage('Updated successfully'))
          .catch((err) => showToastMessage(err.message, 'error'))
      }
    }
    return null
  }
*/

  React.useEffect(() => {
    if (
      !isFetching &&
      sysListData.data &&
      // entityFields.data &&
      optionSets.data &&
      allEntities.data
    ) {
      let gridColumns = utils.generateGridColumns(
        sysListData.data.ListColumn,
        {},
        overrideColumnProperty
      )
      const rowActions = [
        {
          ActionName: 'Delete',
          ActionHandler: onDelete,
        },
      ]

      // Provide cell editors based on datatype
      gridColumns = utils.provideCellEditors(
        gridColumns,
        {
          // entityFields: entityFields.data.EntityField,
          optionSets: optionSets.data,
          allEntities: allEntities.data,
        },
        '',
        '',
        '',
        sysListData.data
      )

      if (
        sysListData.data.IsShowIconsInList ||
        sysListData.data.IsShowIconsInList === 'true'
      )
        gridColumns.unshift({
          headerName: '',
          field: 'edit',
          cellRenderer: 'ListIconRenderer',
          width: 40,
          suppressMenu: true,
          suppressMovable: true,
          sortable: false,
          filter: false,
          resizable: false,
          ColumnIndex: -1,
          cellRendererParams: {
            // entityDetails: entityFields.data,
            entityDetails: '',
            iconFieldID: sysListData.data?.IconField,
            listIconID: sysListData.data?.ListIcon,
          },
        })

      isFileManagerDelete &&
        gridColumns.unshift({
          headerName: '',
          field: 'id',
          // cellRenderer: 'FFMoreVertIcon',
          checkboxSelection: true,
          width: 40,
          ColumnIndex: -2,
          suppressMenu: true,
          suppressMovable: true,
          sortable: false,
          filter: false,
          resizable: false,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
        })

      const gridProperties = generateGridProperties(sysListData.data)

      // Position columns based on ColumnIndex
      gridColumns = _.sortBy(gridColumns, ['ColumnIndex'])
      dispatch({
        type: 'SET_GRIDDATASOURCE',
        payload: {
          ...gridProperties,
          columnDefs: gridColumns,
          rowData: useCustomData || rowData?.data || [],
          rowActions: isFileManagerDelete ? rowActions : '',
          rowSelection: gridSelectmode || 'single',
          onSelectionChanged: onSelectionChanged || '',
          // editType: 'fullRow',
          // onRowEditingStopped: ({ data }) => onEditingStoppedHandler(data),
        },
      })
    }
  }, [isFetching, useCustomData])

  return (
    <FFGrid
      dataSource={state.gridDatasource}
      className={`syslistgrid ${className}`}
      useExternalFilters={useExternalFilters}
      onDelete={onDelete}
    />
  )
}

SysListGrid.defaultProps = {
  className: '',
  sysParentEntityId: null,
  filterQuery: '',
}

SysListGrid.propTypes = {
  className: PropTypes.string,
  sysListId: PropTypes.string.isRequired,
  sysParentEntityId: PropTypes.string,
  filterQuery: PropTypes.string,
}

export default SysListGrid
