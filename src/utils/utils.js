/* eslint-disable  */
import { v4 as generateGUID } from 'uuid'
import { isValid, format, parse } from 'date-fns'
import _, { result } from 'lodash'

/** Transform column properties from database fields to ag grid fields
 */
import React from 'react'
import getAPIData from '../models/api/api'
import apiEndpoints from '../models/api/apiEndpoints'
import componentLookup from './componentLookup'
import { DiscFullRounded, PartyModeSharp } from '@material-ui/icons'

function fieldValueSetter(params) {
  if (params.colDef?.EntityName) {
    if (params.data && params.data[params.colDef.EntityName])
      return params.data[params.colDef.EntityName][params.colDef.field]

    return params.value
  }

  return params.value
}
//TODO:Need to combine entitydesignergenerateGridColumns and generateGridColumns as a single function
const entitydesignergenerateGridColumns = (
  columnProperties,
  defaultColumnProperties = {},
  overrideColumnProperty = {},
  options = {},
  entityFields = {},
  rowDataResponse = [],
  allEntities
) => {
  if (!columnProperties.length) return []
  let stringifiedObject = JSON.stringify(columnProperties)
  let headerName = ''
  let statusValue = ''

  const overrideColumnPropertyDuplicate = { ...overrideColumnProperty }
  const ragCellClassRules = {
    'status-onhold-outer': function (params) {
      let statusfieldLength = 0
      statusfieldLength = params.value && params.value.length

      if (
        statusfieldLength !== undefined &&
        params.value !== undefined &&
        statusfieldLength !== 0
      ) {
        return (
          (params.value && params.value?.toString().toLowerCase()) ===
          statusValue?.toLowerCase()
        )
      }
    },
  }

  stringifiedObject = stringifiedObject.replace(/GridColumnProperty-/g, '')
  columnProperties = JSON.parse(stringifiedObject)
  return columnProperties.map((columnData) => {
    headerName = columnData?.Caption || columnData.Field

    if (headerName.toLowerCase() === 'status') {
      const rowLength = entityFields && entityFields.length

      for (let i = 0; i < rowLength; i++) {
        if (
          entityFields &&
          entityFields[i].Filters &&
          entityFields[i].Name.toLowerCase() === 'status'
        ) {
          if (
            JSON.parse(
              entityFields[i].Filters
            ).filters[0].field.toLowerCase() === headerName.toLowerCase()
          ) {
            statusValue = JSON.parse(
              entityFields[i].Filters
            ).filters[0].value.toLowerCase()

            overrideColumnPropertyDuplicate.cellClassRules = ragCellClassRules
            overrideColumnPropertyDuplicate.cellStyle = {
              fontSize: '12px',
            }
          }
        }
      }
    }
    if (options.useValueSetter) {
      let lookupEntityField = null
      const relatedEntit = columnProperties.find(
        (item) =>
          item?.entityField?.Name.toLowerCase() === headerName?.toLowerCase()
      )?.entityField?.Lookup
      const LookupTextField = columnProperties.find(
        (item) =>
          item?.entityField?.Name.toLowerCase() === headerName?.toLowerCase()
      )?.entityField?.LookupTextField
      const lookupEntity =
        relatedEntit &&
        allEntities.find(
          (entity) => entity.Id.toLowerCase() === relatedEntit?.toLowerCase()
        )
      if (lookupEntity) {
        lookupEntityField = lookupEntity.EntityField.find(
          (entityField) =>
            entityField.Id.toLowerCase() === LookupTextField?.toLowerCase()
        )
      }
      return {
        ...defaultColumnProperties,
        ...columnData,
        headerName: columnData?.EntityName
          ? `${headerName} (${columnData.EntityName})`
          : headerName,
        field: columnData.Field,
        valueFormatter: fieldValueSetter,
        // hide: columnData.rowGroup ? true : columnData.Hide || false,
        valueGetter: ({ data }) => {
          if (
            columnData?.EntityName &&
            options.parentEntity !== columnData.EntityName
          )
            return data &&
              data[columnData?.EntityName] &&
              data[columnData?.EntityName].length > 0
              ? data[columnData?.EntityName][0][columnData.Field]
              : ''
          //return data && data[columnData.Field] ? data[columnData.Field] : ''
          let result = ''
          if (lookupEntityField) {
            result =
              data && data[columnData.Field]
                ? [
                    {
                      [lookupEntityField?.Name]:
                        data[
                          `${columnData.Field}@OData.Community.Display.V1.FormattedValue`
                        ],
                      id: data[`${columnData.Field}`],
                      entityid: data?.id,
                    },
                  ]
                : ''
          } else {
            result =
              data && data[columnData.Field] ? data[columnData.Field] : ''
          }
          return result
        },
        // hide: columnData.Hide || false,

        hide:
          options.screenName === 'LIST_VIEWER'
            ? columnData.Visible === undefined
              ? false
              : columnData.Visible === true
              ? false
              : true
            : columnData.Hide || true,
        isrelatedEntity: relatedEntit ? true : false,
        // hide:
        //   options.screenName === 'LIST_VIEWER'
        //     ? !columnData.Visible
        //     : columnData.Hide || false,
        sortable: columnData.sortable || false,
        OptionsetId: entityFields.find(
          (item) => item.Name.toLowerCase() === headerName.toLowerCase()
        )?.OptionSetId,
        ...overrideColumnPropertyDuplicate,
      }
    }
    return {
      ...defaultColumnProperties,
      ...columnData,
      headerName: columnData?.EntityName
        ? `${headerName} (${columnData.EntityName})`
        : headerName,
      field: columnData.Field,
      // hide: columnData.rowGroup ? true : columnData.Hide || false,
      valueGetter: ({ data }) => {
        if (
          columnData?.EntityName &&
          options.parentEntity !== columnData.EntityName
        )
          return data[columnData?.EntityName] &&
            data[columnData?.EntityName].length > 0
            ? data[columnData?.EntityName][0][columnData.Field]
            : ''
        return data[columnData.Field]
      },
      isrelatedEntity: false,
      // hide: columnData.Hide || false,
      hide:
        options.screenName === 'LIST_VIEWER'
          ? !columnData.Visible
          : columnData.Hide || false,
      sortable: columnData.sortable || false,
      ...overrideColumnPropertyDuplicate,
    }
  })
}
//TODO:Need to combine entitydesignerprovideCellEditors and provideCellEditors as a single function
function entitydesignerprovideCellEditors(
  gridColumns,
  apiData,
  sysEntitydata,
  listId,
  history,
  sysListData,
  onRowModalClick,
  onGridEditClick
) {
  const SortProperty = gridColumns.find(
    (entityField) => entityField.sortable === true
  )
  const sysEntity = sysEntitydata
    ? sysEntitydata
    : history?.location?.pathname.substring(
        history?.location?.pathname.lastIndexOf('/') + 1,
        history?.location?.pathname.length
      )
  return gridColumns.map((gridColumn) => {
    const entityFields = apiData.entityFields.find(
      (entityField) => entityField.Id === gridColumn.EntityFieldId
    )
    const DefaultSortProperty = apiData.entityFields.find(
      (entityField) =>
        entityField.IsDisplayName === true &&
        entityField.Id === gridColumn.EntityFieldId
    )
    const cellEditorProperties = getCellEditorProperties(
      entityFields,
      apiData,
      sysEntity
    )

    if (!SortProperty && DefaultSortProperty)
      return {
        ...gridColumn,
        ...cellEditorProperties,
        ...{
          //TODO: We need to enable sorting for grid with lazyload.
          // sortable: true,
          // sort: 'asc',
          cellRenderer: (params) => {
            var link = document.createElement('a')
            link.href =
              sysListData?.EditMode === 'Standard'
                ? `/formViewer?entityName=${sysEntity}&entityId=${params?.data?.id}&listId=${listId}`
                : ''
            link.className = 'gridLinkclass'
            link.innerText = params.value || ''
            link.addEventListener('click', (e) => {
              e.preventDefault()
              if (params?.data?.id) {
                if (sysListData?.EditMode === 'Inline')
                  onGridEditClick(params.data)
                else if (sysListData?.EditMode === 'QuickView')
                  onRowModalClick(e, params?.data)
                // (sysListData.EditMode === 'Standard')
                else
                  history.push({
                    pathname: `/formViewer`,
                    search: `?entityName=${sysEntity}&entityId=${params.data.id}&listId=${listId}`,
                    state: {
                      dataId: params.data.id,
                      sysListColumnId: listId,
                    },
                  })
              }
            })
            return link
          },
        },
      }
    if (SortProperty && DefaultSortProperty)
      return {
        ...gridColumn,
        ...cellEditorProperties,
        ...{
          cellRenderer: (params) => {
            var link = document.createElement('a')
            link.href =
              sysListData?.EditMode === 'Standard'
                ? `/formViewer?entityName=${sysEntity}&entityId=${params?.data?.id}&listId=${listId}`
                : ''
            link.innerText = params.value || ''
            link.className = 'gridLinkclass'
            link.addEventListener('click', (e) => {
              e.preventDefault()
              if (params?.data?.id) {
                if (sysListData?.EditMode === 'Inline')
                  onGridEditClick(params.data)
                else if (sysListData?.EditMode === 'QuickView')
                  onRowModalClick(e, params?.data)
                //(sysListData.EditMode === 'Standard')
                else
                  history.push({
                    pathname: `/formViewer`,
                    search: `?entityName=${sysEntity}&entityId=${params.data.id}&listId=${listId}`,
                    state: {
                      dataId: params.data.id,
                      sysListColumnId: listId,
                    },
                  })
              }
            })
            return link
          },
        },
      }

    if (gridColumn.isrelatedEntity) debugger
    return {
      ...gridColumn,
      ...cellEditorProperties,
      ...{
        cellRenderer: (params) => {
          console.log('params', params)
          var link = document.createElement('a')
          link.href = `/formViewer?entityName=${
            params.entityName ? params.entityName : sysEntity
          }&entityId=${
            params.value
              ? typeof params.value === 'string'
                ? params.value
                : params.value.length &&
                  params.value.length !== 0 &&
                  params.value[0].id
              : '' || ''
          }&listId=`
          link.innerText = params.value
            ? (params.value.length &&
                params.value.length !== 0 &&
                params?.value[0]?.[params?.textField]) ||
              params.value ||
              ''
            : ''
          link.className = 'gridLinkclass'
          link.addEventListener('click', (e) => {
            e.preventDefault()
            history.push({
              pathname: `/formViewer`,
              search: `?entityName=${
                params.entityName ? params.entityName : sysEntity
              }&entityId=${
                params.value
                  ? typeof params.value === 'string'
                    ? params.value
                    : params.value.length !== 0 && params.value[0].id
                  : '' || ''
              }&listId=`,
              state: {
                dataId: params.data.id,
                sysListColumnId: listId,
              },
            })
          })
          return link
        },
      },
    }

    return {
      ...gridColumn,
      ...cellEditorProperties,
    }
  })
}

const generateGridColumns = (
  columnProperties,
  defaultColumnProperties = {},
  overrideColumnProperty = {},
  options = {},
  // entityFields = {},
  rowDataResponse = [],
  allEntities
) => {
  if (!columnProperties?.length) return []
  let stringifiedObject = JSON.stringify(columnProperties)
  let headerName = ''
  let statusValue = ''

  const overrideColumnPropertyDuplicate = { ...overrideColumnProperty }
  const ragCellClassRules = {
    'status-onhold-outer': function (params) {
      let statusfieldLength = 0
      statusfieldLength = params.value && params.value.length

      if (
        statusfieldLength !== undefined &&
        params.value !== undefined &&
        statusfieldLength !== 0
      ) {
        return (
          (params.value && params.value?.toString().toLowerCase()) ===
          statusValue?.toLowerCase()
        )
      }
    },
  }

  stringifiedObject = stringifiedObject.replace(/GridColumnProperty-/g, '')
  columnProperties = JSON.parse(stringifiedObject)
  return columnProperties.map((columnData) => {
    headerName = columnData?.Caption || columnData.Field

    if (headerName.toLowerCase() === 'status') {
      if (
        columnData?.entityField &&
        columnData?.entityField?.Filters &&
        columnData?.entityField?.Name.toLowerCase() === 'status'
      ) {
        if (
          JSON.parse(
            columnData?.entityField?.Filters
          ).filters[0].field.toLowerCase() === headerName.toLowerCase()
        ) {
          statusValue = JSON.parse(
            columnData?.entityField?.Filters
          ).filters[0].value.toLowerCase()

          overrideColumnPropertyDuplicate.cellClassRules = ragCellClassRules
          overrideColumnPropertyDuplicate.cellStyle = {
            fontSize: '12px',
          }
        }
      }

      // const rowLength = entityFields && entityFields.length

      // for (let i = 0; i < rowLength; i++) {
      //   if (
      //     entityFields &&
      //     entityFields[i].Filters &&
      //     entityFields[i].Name.toLowerCase() === 'status'
      //   ) {
      //     if (
      //       JSON.parse(
      //         entityFields[i].Filters
      //       ).filters[0].field.toLowerCase() === headerName.toLowerCase()
      //     ) {
      //       statusValue = JSON.parse(
      //         entityFields[i].Filters
      //       ).filters[0].value.toLowerCase()

      //       overrideColumnPropertyDuplicate.cellClassRules = ragCellClassRules
      //       overrideColumnPropertyDuplicate.cellStyle = {
      //         fontSize: '12px',
      //       }
      //     }
      //   }
      // }
    }
    if (options.useValueSetter) {
      // const relatedEntit = entityFields.find(
      //   (item) => item.columnData?.entityFieldName.toLowerCase() === headerName.toLowerCase()
      // )?.Lookup
      let lookupEntityField = null
      const relatedEntit = columnProperties.find(
        (item) =>
          item?.entityField?.Name.toLowerCase() === headerName?.toLowerCase()
      )?.entityField?.Lookup
      const LookupTextField = columnProperties.find(
        (item) =>
          item?.entityField?.Name.toLowerCase() === headerName?.toLowerCase()
      )?.entityField?.LookupTextField
      const lookupEntity =
        relatedEntit &&
        allEntities.find(
          (entity) => entity.Id.toLowerCase() === relatedEntit?.toLowerCase()
        )
      if (lookupEntity) {
        lookupEntityField = lookupEntity.EntityField.find(
          (entityField) =>
            entityField.Id.toLowerCase() === LookupTextField?.toLowerCase()
        )
      }
      return {
        ...defaultColumnProperties,
        ...columnData,
        headerName: columnData?.EntityName
          ? `${headerName} (${columnData.EntityName})`
          : headerName,
        field: columnData.Field,
        valueFormatter: fieldValueSetter,
        // hide: columnData.rowGroup ? true : columnData.Hide || false,
        valueGetter: ({ data }) => {
          if (
            columnData?.EntityName &&
            options.parentEntity !== columnData.EntityName
          )
            return data &&
              data[columnData?.EntityName] &&
              data[columnData?.EntityName].length > 0
              ? data[columnData?.EntityName][0][columnData.Field]
              : ''
          //return data && data[columnData.Field] ? data[columnData.Field] : ''
          let result = ''
          if (lookupEntityField) {
            result =
              data && data[columnData.Field]
                ? [
                    {
                      [lookupEntityField?.Name]:
                        data[
                          `${columnData.Field}@OData.Community.Display.V1.FormattedValue`
                        ],
                      id: data[`${columnData.Field}`],
                      entityid: data?.id,
                    },
                  ]
                : ''
          } else {
            result =
              data && data[columnData.Field] ? data[columnData.Field] : ''
          }
          return result
        },

        // hide: columnData.Hide || false,

        hide:
          options.screenName === 'LIST_VIEWER'
            ? columnData.Visible === undefined
              ? false
              : columnData.Visible === true
              ? false
              : true
            : columnData.Hide || true,
        //isrelatedEntity: relatedEntit ? true : false,
        isrelatedEntity: columnData?.entityField?.Lookup ? true : false,
        // hide:
        //   options.screenName === 'LIST_VIEWER'
        //     ? !columnData.Visible
        //     : columnData.Hide || false,
        sortable: columnData.sortable || false,
        // OptionsetId: entityFields.find(
        //   (item) => item.Name.toLowerCase() === headerName.toLowerCase()
        // )?.OptionSetId,
        OptionsetId: columnData?.entityField?.OptionSetId,
        ...overrideColumnPropertyDuplicate,
      }
    }
    return {
      ...defaultColumnProperties,
      ...columnData,
      headerName: columnData?.EntityName
        ? `${headerName} (${columnData.EntityName})`
        : headerName,
      field: columnData.Field,
      // hide: columnData.rowGroup ? true : columnData.Hide || false,
      valueGetter: ({ data }) => {
        if (
          columnData?.EntityName &&
          options.parentEntity !== columnData.EntityName
        )
          return data[columnData?.EntityName] &&
            data[columnData?.EntityName].length > 0
            ? data[columnData?.EntityName][0][columnData.Field]
            : ''
        return data[columnData.Field]
      },
      isrelatedEntity: false,
      // hide: columnData.Hide || false,
      hide:
        options.screenName === 'LIST_VIEWER'
          ? !columnData.Visible
          : columnData.Hide || false,
      sortable: columnData.sortable || false,
      ...overrideColumnPropertyDuplicate,
    }
  })
}

const removeKeyFromObject = (obj, keysToRemove = []) => {
  let objClone = _.cloneDeep(obj)
  if (!Array.isArray(obj)) objClone = [objClone]

  return objClone.map((objItem) => {
    keysToRemove.map((keyItem) => delete objItem[keyItem])

    return objItem
  })
}

const dateComparator = (filterLocalDateAtMidnight, cellValue) => {
  // const dateAsString = cellValue
  // const dateParts = dateAsString.split('/')
  // const cellDate = new Date(
  //   Number(dateParts[2]),
  //   Number(dateParts[1]) - 1,
  //   Number(dateParts[0])
  // )

  const dateAsString = cellValue.split(' ')
  const dateParts = dateAsString[0].split('-')
  // Year, Month, Date
  const cellDate = new Date(
    Number(dateParts[0]),
    Number(dateParts[2]) - 1,
    Number(dateParts[1])
  )

  if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
    return 0
  }
  if (cellDate < filterLocalDateAtMidnight) {
    return -1
  }
  if (cellDate > filterLocalDateAtMidnight) {
    return 1
  }
}

/**
 * * Suppress default key board event in AgGrid
 * @param {*} params
 */
function suppressKeyboardEvent(params) {
  const KEY_ENTER = 13 // * Enter Key
  const { event } = params

  return event.which === KEY_ENTER
}

function replaceSpecialCharacters(value) {
  if (_.isEmpty(value)) return ''

  return _.replace(value, /\n|\t/g, '')
}

function getCellEditorProperties(entityFields, apiData, sysEntity) {
  let optionSetOptions = null
  let lookupEntity = null
  let lookupEntityField = null
  let ParentEntityName = null
  if (!entityFields) return {}
  switch (entityFields.EntityFieldDataType.Name) {
    case 'TwoOptions':
      return {
        cellEditor: 'agSelectCellEditor',
        filter: 'agDateColumnFilter',
        entityName: sysEntity,
        cellEditorParams: {
          values: [true, false],
        },
      }
    case 'Text':
    case 'MultiLineText':
    case 'Duration':
    case 'eMail':
      if (entityFields.Name.toLowerCase() === 'menuurl')
        return {
          cellEditor: 'TextEditor',
          cellRenderer: 'MenuUrlRender',
          entityName: sysEntity,
          cellRendererParams: {
            sysListItems: apiData.syslistitem,
          },
          filterParams: (props) => {
            return {
              valueGetter: (params) =>
                replaceSpecialCharacters(params.data[props.column.colId]),
            }
          },
        }
      return {
        cellEditor: 'TextEditor',
        entityName: sysEntity,
        filterParams: (props) => {
          return {
            valueGetter: (params) =>
              replaceSpecialCharacters(params.data[props.column.colId]),
          }
        },
      }
    case 'DecimalNumber':
    case 'WholeNumber':
    case 'Phone':
      return { cellEditor: 'NumericEditor' }
    case 'OptionSet':
      // optionSetOptions = apiData?.optionSets?.find(
      //   (optionSet) => optionSet.Id === entityFields.OptionSetId
      // )
      // if (optionSetOptions) {
      return {
        cellEditor: 'AutoCompleteEditor',
        //cellEditorParams: {
        cellEditorParams: () => {
          return {
            //options: optionSetOptions?.OptionSetOptions || [],
            dataSourceURL:
              (entityFields.OptionSetId &&
                `/api/OptionSet(${entityFields.OptionSetId})?$expand=OptionSetOptions`) ||
              `/api/OptionSet?$expand=OptionSetOptions`,
            textField: 'Name',
            valueField: 'Value',
            isEntityManager: true,
            entityName: sysEntity,
            entityMetaData: apiData.allEntities,
          }
        },
        cellRendererParams: () => {
          return {
            dataSourceURL: `/api/OptionSet?$expand=OptionSetOptions`,
            entityName: lookupEntity?.Name,
            textField: 'Name',
            valueField: 'Value',
            isEntityManager: true,
            // header:
            //   entityFields?.LookupFilter && entityFields.LookupFilter !== null
            //     ? {
            //         EntityFieldId: entityFields.Id,
            //         IsLookupFilter: 'true',
            //         ParentEntityName: ParentEntityName.Name,
            //       }
            //     : '',
            // cascadingProperties: {
            //   CascadingEntityColumn: entityFields?.CascadingEntityColumn,
            //   CascadingParentEntityField:
            //     entityFields?.CascadingParentEntityField,
            // },
            lookupname: lookupEntity?.Name,
            entityMetaData: apiData.allEntities,
          }
        },
        // cellRenderer: ({ value }) => {
        //   if (!value) return null
        //   // if (typeof value === 'object') return value?.Name
        //   const selectedOption = optionSetOptions.OptionSetOptions.find(
        //     (option) => option.Value === value
        //   )
        //   return selectedOption?.Name || null
        // },
        suppressKeyboardEvent,
      }
    //}

    case 'Lookup':
      lookupEntity = apiData.allEntities.find(
        (entity) =>
          entity.Id.toLowerCase() === entityFields?.Lookup?.toLowerCase()
      )
      if (lookupEntity) {
        lookupEntityField = lookupEntity.EntityField.find(
          (entityField) =>
            entityField.Id.toLowerCase() ===
            entityFields.LookupTextField?.toLowerCase()
        )
        ParentEntityName = apiData.allEntities.find(
          (entity) =>
            entity.Id.toLowerCase() === entityFields.EntityId.toLowerCase()
        )

        let lookupfieldfilterURL = `${lookupEntity.Name}`
        // if (entityFields?.lookupfieldfilter) {
        //   lookupfieldfilterURL = `${lookupEntity.Name}?${entityFields?.lookupfieldfilter}`
        // } else {
        //   lookupfieldfilterURL = `${lookupEntity.Name}`
        // }

        return {
          cellEditor: 'AutoCompleteEditor',
          cellEditorParams: () => {
            return {
              dataSourceURL: `/api/${lookupfieldfilterURL}${
                lookupEntity.Name.toLowerCase() === 'list'
                  ? `?$filter=contains(UseType,'View')`
                  : ''
              }`,
              textField: lookupEntityField?.Name || 'id',
              // textField: 'test1',
              valueField: 'id',
              postBody: {
                queryOptions: null,
                freeFlowFilter: entityFields?.LookupFilter
                  ? JSON.parse(entityFields?.LookupFilter)
                  : null,
              },
              // header:
              //   entityFields?.LookupFilter && entityFields.LookupFilter !== null
              //     ? {
              //         EntityFieldId: entityFields.Id,
              //         IsLookupFilter: 'true',
              //         ParentEntityName: ParentEntityName.Name,
              //       }
              //     : '',
              cascadingProperties: {
                CascadingEntityColumn: entityFields?.CascadingEntityColumn,
                CascadingParentEntityField:
                  entityFields?.CascadingParentEntityField,
                cascadingEntity: entityFields.EntityId,
                lookupEntity,
              },
              entityMetaData: apiData.allEntities,
              lookupname: lookupEntity.Name,
            }
          },
          filterParams: (props) => {
            return {
              // valueGetter: (params) => {
              //   if (
              //     _.isArray(params.data[props.column.colId]) &&
              //     params.data[props.column.colId].length > 0
              //   )
              //     // return params.data[
              //     //   `${props.column.colId}@OData.Community.Display.V1.FormattedValue`
              //     // ][0][lookupEntityField?.Name || 'id']
              //     return params.data[
              //       'User@OData.Community.Display.V1.FormattedValue'
              //     ]
              //   // return params.data[props.column.colId]
              // },
            }
          },
          cellRenderer: 'AutoCompleteRenderer',
          cellRendererParams: (params) => {
            // if (params.value === '') {
            return {
              dataSourceURL: `/api/${lookupEntity.Name}${
                lookupEntity.Name.toLowerCase() === 'list'
                  ? `?$filter=contains(UseType,'View')`
                  : ''
              }`,

              entityName: lookupEntity?.Name,
              textField: lookupEntityField?.Name || 'id',
              //textField: 'test1',
              // params?.data[
              //   `${params.column.colId}@OData.Community.Display.V1.FormattedValue`
              // ],

              valueField: 'id',
              postBody: {
                queryOptions: null,
                freeFlowFilter: entityFields?.LookupFilter
                  ? JSON.parse(entityFields?.LookupFilter)
                  : null,
              },
              header:
                entityFields?.LookupFilter && entityFields.LookupFilter !== null
                  ? {
                      EntityFieldId: entityFields.Id,
                      IsLookupFilter: 'true',
                      ParentEntityName: ParentEntityName.Name,
                    }
                  : '',
              cascadingProperties: {
                CascadingEntityColumn: entityFields?.CascadingEntityColumn,
                CascadingParentEntityField:
                  entityFields?.CascadingParentEntityField,
              },
              lookupname: lookupEntity.Name,
              entityMetaData: apiData.allEntities,
            }
            // }
            // return params.data[
            //   `${params.column.colId}@OData.Community.Display.V1.FormattedValue`
            // ]
          },
          suppressKeyboardEvent,
        }
      }

      return {
        cellEditor: 'AutoCompleteEditor',
        cellEditorParams: {
          dataSourceURL: '',
          textField: 'id',
          valueField: 'id',
        },
        suppressKeyboardEvent,
      }

    case 'Date':
      return {
        cellEditor: 'dateEditor',
        cellEditorParams: {
          format: 'MM/dd/yyyy',
          requestDateFormat: 'yyyy-dd-MM',
        },
        filter: 'agDateColumnFilter',
        filterParams: {
          clearButton: true,
          suppressAndOrCondition: true,
          comparator: dateComparator,
        },
        editable:
          entityFields.Name === 'CreatedOn' ||
          entityFields.Name === 'LastUpdatedDate'
            ? false
            : true,
        cellRenderer: ({ value }) => {
          let dateString = null

          if (!value) return null
          try {
            dateString = parse(value, 'yyyy-MM-dd HH:mm:ss', new Date())

            if (isValid(dateString))
              dateString = format(dateString, 'MM/dd/yyyy')
            else return null
          } catch (error) {
            return null
          }

          return dateString
        },
      }
    case 'DateAndTime':
      return {
        cellEditor: 'dateEditor',
        cellEditorParams: {
          format: 'MM/dd/yyyy',
          requestDateFormat: 'yyyy-dd-MM HH:mm:ss',
        },
        filter: 'agDateColumnFilter',
        filterParams: {
          clearButton: true,
          suppressAndOrCondition: true,
          comparator: dateComparator,
        },
        editable:
          entityFields.Name === 'CreatedOn' ||
          entityFields.Name === 'LastUpdatedDate'
            ? false
            : true,
        cellRenderer: ({ value }) => {
          let dateString = null

          if (!value) return null
          try {
            dateString = parse(value, 'yyyy-dd-MM HH:mm:ss', new Date())

            if (isValid(dateString))
              dateString = format(dateString, 'MM/dd/yyyy')
            else return null
          } catch (error) {
            return null
          }

          return dateString
        },
      }

    default:
      return {}
  }
}

function provideCellEditors(
  gridColumns,
  apiData,
  sysEntitydata,
  listId,
  history,
  sysListData,
  onRowModalClick,
  onGridEditClick
) {
  const SortProperty = gridColumns.find(
    (entityField) => entityField.sortable === true
  )
  const sysEntity = sysEntitydata
    ? sysEntitydata
    : history?.location?.pathname.substring(
        history?.location?.pathname.lastIndexOf('/') + 1,
        history?.location?.pathname.length
      )
  return gridColumns.map((gridColumn) => {
    // const entityFields = apiData.entityFields.find(
    //   (entityField) => entityField.Id === gridColumn.EntityFieldId
    // )
    const entityFields = sysListData?.ListColumn.find(
      (entityField) => entityField.entityField.Id === gridColumn.EntityFieldId
    )

    // const DefaultSortProperty = apiData.entityFields.find(
    //   (entityField) =>
    //     entityField.IsDisplayName === true &&
    //     entityField.Id === gridColumn.EntityFieldId
    // )

    const DefaultSortProperty = sysListData?.ListColumn.find(
      (entityField) =>
        entityField.entityField.IsDisplayName === true &&
        entityField.entityField.Id === gridColumn.EntityFieldId
    )

    const cellEditorProperties = getCellEditorProperties(
      //entityFields,
      entityFields?.entityField,
      apiData,
      sysEntity
    )

    if (!SortProperty && DefaultSortProperty)
      return {
        ...gridColumn,
        ...cellEditorProperties,
        ...{
          //TODO: We need to enable sorting for grid with lazyload.
          // sortable: true,
          // sort: 'asc',
          cellRenderer: (params) => {
            var link = document.createElement('a')
            link.href =
              sysListData?.EditMode === 'Standard'
                ? `/formViewer?entityName=${sysEntity}&entityId=${params?.data?.id}&listId=${listId}`
                : ''
            link.className = 'gridLinkclass'
            link.innerText = params.value || ''
            link.addEventListener('click', (e) => {
              e.preventDefault()
              if (params?.data?.id) {
                if (sysListData?.EditMode === 'Inline')
                  onGridEditClick(params.data)
                else if (sysListData?.EditMode === 'QuickView')
                  onRowModalClick(e, params?.data)
                // (sysListData.EditMode === 'Standard')
                else
                  history.push({
                    pathname: `/formViewer`,
                    search: `?entityName=${sysEntity}&entityId=${params.data.id}&listId=${listId}`,
                    state: {
                      dataId: params.data.id,
                      sysListColumnId: listId,
                    },
                  })
              }
            })
            return link
          },
        },
      }
    if (SortProperty && DefaultSortProperty)
      return {
        ...gridColumn,
        ...cellEditorProperties,
        ...{
          cellRenderer: (params) => {
            var link = document.createElement('a')
            link.href =
              sysListData?.EditMode === 'Standard'
                ? `/formViewer?entityName=${sysEntity}&entityId=${params?.data?.id}&listId=${listId}`
                : ''
            link.innerText = params.value || ''
            link.className = 'gridLinkclass'
            link.addEventListener('click', (e) => {
              e.preventDefault()
              if (params?.data?.id) {
                if (sysListData?.EditMode === 'Inline')
                  onGridEditClick(params.data)
                else if (sysListData?.EditMode === 'QuickView')
                  onRowModalClick(e, params?.data)
                //(sysListData.EditMode === 'Standard')
                else
                  history.push({
                    pathname: `/formViewer`,
                    search: `?entityName=${sysEntity}&entityId=${params.data.id}&listId=${listId}`,
                    state: {
                      dataId: params.data.id,
                      sysListColumnId: listId,
                    },
                  })
              }
            })
            return link
          },
        },
      }

    if (gridColumn.isrelatedEntity)
      return {
        ...gridColumn,
        ...cellEditorProperties,
        ...{
          cellRenderer: (params) => {
            var link = document.createElement('a')
            link.href = `/formViewer?entityName=${
              params.entityName ? params.entityName : sysEntity
            }&entityId=${
              params.value
                ? typeof params.value === 'string'
                  ? params.value
                  : params.value.length &&
                    params.value.length !== 0 &&
                    params.value[0].id
                : '' || ''
            }&listId=`
            link.innerText = params.value
              ? (params.value.length &&
                  params.value.length !== 0 &&
                  params?.value[0]?.[params?.textField]) ||
                params.value ||
                ''
              : ''
            link.className = 'gridLinkclass'
            link.addEventListener('click', (e) => {
              e.preventDefault()
              history.push({
                pathname: `/formViewer`,
                search: `?entityName=${
                  params.entityName ? params.entityName : sysEntity
                }&entityId=${
                  params.value
                    ? typeof params.value === 'string'
                      ? params.value
                      : params.value.length !== 0 && params.value[0].id
                    : '' || ''
                }&listId=`,
                state: {
                  dataId: params.data.id,
                  sysListColumnId: listId,
                },
              })
            })
            return link
          },
        },
      }

    return {
      ...gridColumn,
      ...cellEditorProperties,
    }
  })
}
// async function getEntityLookFieldData(propertySchema) {
//   const lookupFieldsID = []
//   const lookupEntityFields = []

//   if (!propertySchema || propertySchema.length <= 0) return []

//   propertySchema.map((propertyObj) => {
//     if (propertyObj.EntityFieldDataType.Name === 'Lookup') {
//       lookupFieldsID.indexOf(propertyObj.Lookup) === -1
//         ? lookupFieldsID.push(propertyObj.Lookup)
//         : null

//       const index = lookupEntityFields.findIndex(
//         (x) => x.Id === propertyObj.Entity.Id
//       )
//       index === -1 ? lookupEntityFields.push(propertyObj.Entity) : null
//     }
//   })

//   if (!lookupFieldsID || lookupFieldsID.length <= 0) {
//     lookupEntityFields.push(propertySchema[0].Entity)
//     return [...lookupEntityFields]
//   }

//   const lookupEntityFieldsAPI = await getAPIData(
//     apiEndpoints.GetEntity.method,
//     `${apiEndpoints.GetEntity.url}?$expand=EntityField&$filter=id in (${lookupEntityFields[0].Id})`
//   ).then((response) => response.data.value)
//   const lookupEntityTextField = await getAPIData(
//     apiEndpoints.GetEntity.method,
//     `${apiEndpoints.GetEntity.url}?$expand=EntityField&$filter=id in (${lookupFieldsID})`
//   ).then((response) => response.data.value)

//   return [...lookupEntityFieldsAPI, ...lookupEntityTextField]
// }

// async function EntityLookupbind(entityname) {
//   const entityList = await getAPIData(
//     apiEndpoints.GetEntityFields.method,
//     `${apiEndpoints.GetEntityFields.url}?$expand=Entity,EntityFieldDataType,OptionSet($expand=OptionSetOptions)&$filter=Entity/Name eq '${entityname}'`
//   ).then((response) => response.data.value)
//   const propertiesData = await getEntityLookFieldData(entityList)
//   return propertiesData
// }

async function EntityLookupbind(entityname) {
  const entityList = await getAPIData(
    apiEndpoints.GetEntity.method,
    `${apiEndpoints.GetEntity.url}?$expand=EntityField($expand=EntityFieldDataType,OptionSet($expand=OptionSetOptions))`
  ).then((response) => response.data.value)
  const baseEntitydata = entityList.find((entity) => entity.Name === entityname)
  const Lookupiddata = []
  const lookupdata = getlookupdata(baseEntitydata, entityList, Lookupiddata)

  const Entitydata = []
  Entitydata.push(baseEntitydata)
  lookupdata.length !== 0 &&
    lookupdata.forEach((entityField) => {
      const data = entityList.find((entity) => entity.Id === entityField)
      if (data) Entitydata.push(data)
    })
  return Entitydata
}
async function EntityLookupbinddept(entityname) {
  const entityList = await getAPIData(
    apiEndpoints.GetEntity.method,
    `${apiEndpoints.GetEntity.url}?$expand=EntityField($expand=EntityFieldDataType,OptionSet($expand=OptionSetOptions))`
  ).then((response) => response.data.value)

  const baseEntitydata = entityList.find((entity) => entity.Name === entityname)
  const Lookupiddata = []
  const lookupdata = getlookupdatadept(baseEntitydata, entityList, Lookupiddata)

  const Entitydata = []
  Entitydata.push(baseEntitydata)
  lookupdata.length !== 0 &&
    lookupdata.forEach((entityField) => {
      const data = entityList.find(
        (entity) => entity.Id === entityField.split(',')[0]
      )
      if (data) {
        Entitydata.push({
          ...data,
          DisplayName: data.Name + entityField.split(',')[1],
        })
      }
    })
  return Entitydata
}

function getlookupdatadept(baseEntitydata, entityList, Lookupiddata) {
  entityList.length !== 0 &&
    baseEntitydata.EntityField.forEach((entityField) => {
      if (entityField.EntityFieldDataType.Name === 'Lookup') {
        Lookupiddata.push(`${entityField.Lookup},(${baseEntitydata.Name})`)
      }
    })
  // const uniqueNames = Array.from(new Set(Lookupiddata))

  const recusivelookup = getlookuprecusive(
    removeDuplicates(Lookupiddata),
    entityList,
    Lookupiddata
  )
  return recusivelookup
}
function getlookupdata(baseEntitydata, entityList, Lookupiddata) {
  entityList.length !== 0 &&
    baseEntitydata.EntityField.forEach((entityField) => {
      if (entityField.EntityFieldDataType.Name === 'Lookup') {
        Lookupiddata.push(entityField.Lookup)
      }
    })
  const uniqueNames = Array.from(new Set(Lookupiddata))
  // const recusivelookup = getlookuprecusive(
  //   removeDuplicates(Lookupiddata),
  //   entityList,
  //   Lookupiddata
  // )
  return uniqueNames
}
function getlookuprecusive(lookupentitesdata, entityList, Lookupiddata) {
  const lookupentitesid = []
  entityList.length !== 0 &&
    lookupentitesdata.length !== 0 &&
    lookupentitesdata.forEach((item) => {
      const Entitydata = entityList.find(
        (entity) => entity.Id === item.split(',')[0].toLowerCase()
      )
      Entitydata &&
        Entitydata.EntityField.forEach((entityField) => {
          if (entityField.EntityFieldDataType.Name === 'Lookup') {
            if (Lookupiddata.indexOf(entityField.Lookup) === -1) {
              Lookupiddata.push(
                `${entityField.Lookup},(${Entitydata.Name})${
                  item.split(',')[1]
                }`
              )
              lookupentitesid.push(
                `${entityField.Lookup},(${Entitydata.Name})${
                  item.split(',')[1]
                }`
              )
            }
          }
        })
    })
  const uniqueNames = Array.from(new Set(Lookupiddata))

  // lookupentitesid.length !== 0 &&
  //   getlookuprecusive(
  //     removeDuplicates(lookupentitesid),
  //     entityList,
  //     Lookupiddata
  //   )

  return uniqueNames
}

function removeDuplicates(data) {
  return [...new Set(data)]
}

function mutateObjectById(obj, objectId, valueToUpdate) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      if (value?.id === objectId) {
        if (!valueToUpdate) delete obj[key]
        // else if (_.isEqual(valueToUpdate, {}))
        //   Object.entries(value).forEach(
        //     ([keyToDelete]) => keyToDelete !== 'id' && delete value[keyToDelete]
        //   )
        // else Object.assign(value, valueToUpdate)
        else {
          Object.entries(value).forEach(
            ([keyToDelete]) => keyToDelete !== 'id' && delete value[keyToDelete]
          )
          Object.assign(value, valueToUpdate)
        }
      } else mutateObjectById(value, objectId, valueToUpdate)
    }
  })
}

function transformJSONToTree(arr, uniqueKey, parentKey) {
  const nodes = {}
  return _.cloneDeep(arr).filter(function (obj) {
    const id = obj[uniqueKey]
    const parentId =
      Array.isArray(obj[parentKey]) && obj[parentKey].length > 0
        ? obj[parentKey][0].id
        : undefined //obj[parentKey]

    nodes[id] = _.defaults(obj, nodes[id], { children: [] })
    parentId &&
      (nodes[parentId] = nodes[parentId] || { children: [] }).children.push(obj)

    return !parentId
  })
}

function getFileIcons(FullURL) {
  const Extension =
    FullURL && FullURL.substring(FullURL.lastIndexOf('.') + 1)?.toLowerCase()
  if (Extension) {
    switch (Extension) {
      case 'png':
        return (
          <img src={FullURL} alt={Extension} className="FileViewType-image" />
        )
      case 'jpg':
        return (
          <img src={FullURL} alt={Extension} className="FileViewType-image" />
        )
      case 'jpeg':
        return (
          <img src={FullURL} alt={Extension} className="FileViewType-image" />
        )
      case 'svg':
        return (
          <img src={FullURL} alt={Extension} className="FileViewType-image" />
        )
      case 'doc':
        return componentLookup.WordImage.component
      case 'docx':
        return componentLookup.WordImage.component
      case 'txt':
        return componentLookup.WordImage.component
      case 'pdf':
        return componentLookup.PdfImage.component
      case 'xlsx':
        return componentLookup.ExcelImage.component
      case 'xls':
        return componentLookup.ExcelImage.component
      case 'csv':
        return componentLookup.ExcelImage.component
      case 'mp3':
        return componentLookup.MusicImage.component
      case 'aac':
        return componentLookup.MusicImage.component
      case 'wma':
        return componentLookup.MusicImage.component
      case 'wav':
        return componentLookup.MusicImage.component
      case 'mp4':
        return componentLookup.MusicImage.component
      case 'avi':
        return componentLookup.MusicImage.component
      case 'mkv':
        return componentLookup.MusicImage.component
      case 'mov':
        return componentLookup.MusicImage.component
      case 'webm':
        return componentLookup.MusicImage.component

      default:
        return null // componentLookup.FileImage.component
    }
  }
}
const getEntityFieldDataType = {
  Lookup: '67ef0824-8610-4be5-89d1-72da9a8bb953',
}

const OdataAnnotations = {
  'Odata.include-annotations': '*',
}

function getCascadeDependentFields(parentEntityName, entityFieldsMetadata) {
  const parentEntity = entityFieldsMetadata.find(
    (entityField) => entityField.Name === parentEntityName
  )

  return entityFieldsMetadata.filter(
    (entityField) => entityField.CascadingEntityColumn === parentEntity.Id
  )
}

/**
 * Retrieve all childrens and it's nested/grand childrens based on the given id
 * @param {Array} arr
 * @param {string} id
 * @returns Array
 */
function getAllChildrens(arr, parentID, parentKeyField, uniqueIDField) {
  if (!Array.isArray(arr)) return []

  return arr.reduce((acc, curr) => {
    const parentUniqueID =
      _.isArray(curr[parentKeyField]) && curr[parentKeyField].length > 0
        ? curr[parentKeyField][0].id
        : curr[parentKeyField]

    if (parentUniqueID === parentID)
      return acc.concat(
        curr,
        ...getAllChildrens(
          arr,
          curr[uniqueIDField],
          parentKeyField,
          uniqueIDField
        )
      )

    return acc
  }, [])
}

/**
 * Swaps the items based on specified fromPostion and toPostion
 * @param {array} input
 * @param {number} fromPosition
 * @param {number} toPosition
 * @returns {array} returns the swapped input
 */
function swapItemsBasedOnIndices(input, fromPosition, toPosition) {
  const clonedInput = _.cloneDeep(input)

  ;[clonedInput[toPosition], clonedInput[fromPosition]] = [
    clonedInput[fromPosition],
    clonedInput[toPosition],
  ]

  return clonedInput
}

/**
 * Swaps the items based on specified criteria and toPostion
 * @param {array} input
 * @param {object} criteria
 * @param {number} toPosition
 * @returns {array} returns the swapped input
 */
function swapItemsBasedOnCriteria(input, criteria, toPosition) {
  const clonedInput = _.cloneDeep(input)
  const fromPosition = _.findIndex(clonedInput, criteria)

  if (fromPosition < 0) return clonedInput
  ;[clonedInput[toPosition], clonedInput[fromPosition]] = [
    clonedInput[fromPosition],
    clonedInput[toPosition],
  ]

  return clonedInput
}

export default {
  generateGUID,
  generateGridColumns,
  entitydesignergenerateGridColumns,
  removeKeyFromObject,
  dateComparator,
  getCellEditorProperties,
  provideCellEditors,
  entitydesignerprovideCellEditors,
  EntityLookupbind,
  EntityLookupbinddept,
  mutateObjectById,
  transformJSONToTree,
  getFileIcons,
  getEntityFieldDataType,
  getCascadeDependentFields,
  getAllChildrens,
  swapItemsBasedOnIndices,
  swapItemsBasedOnCriteria,
  OdataAnnotations,
}
