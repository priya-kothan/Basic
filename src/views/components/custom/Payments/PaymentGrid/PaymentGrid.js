import React from 'react'
import FFGrid from '../../../base/FFGrid/FFGrid'
import getAPIData, { getCoreData } from '../../../../../models/api/api'
import APIEndPoints from '../../../../../models/api/apiEndpoints'
import useAppContext from '../../../hooks/useToast'
import utils from '../../../../../utils/utils'
import './PaymentGrid.css'

function PaymentGridReducer(state, action) {
  switch (action.type) {
    case 'SET_APIDATA':
      return { ...state, apiData: action.apiData }
    case 'SET_GRIDDATASOURCE':
      return { ...state, gridDatasource: action.gridDatasource }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const PaymentGrid = ({
  sysListId,
  sysParentEntityId,
  sysParentEntityType,
  transferPaymentId,
}) => {
  const initialState = {
    apiData: {},
    gridDatasource: { columnDefs: [], rowData: [] },
  }

  const [state, dispatch] = React.useReducer(PaymentGridReducer, initialState)
  const { showToastMessage, showLoading } = useAppContext()

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

  function onRowSelected(event) {
    const TransferListID = this.api.getSelectedNodes()
    const id =
      TransferListID[0] && TransferListID[0].id ? TransferListID[0].id : null
    const PaymentTransferStatus = event.node.selected
    transferPaymentId(id, PaymentTransferStatus)
  }

  React.useEffect(() => {
    async function fetchData() {
      showLoading(true)
      const sysListColumn = await getCoreData(
        APIEndPoints.GetSysList.method,
        `${APIEndPoints.GetSysList.url}(${sysListId}).GetViewDetails()`
      )
      if (sysListColumn.status === 200) {
        await Promise.all([
          getCoreData(
            'get',
            `/api/${sysListColumn.data[0].SysEntity}?$filter=id ne ${sysParentEntityId}`
          ),
          // getAPIData(
          //   APIEndPoints.GetEntity.method,
          //   `${APIEndPoints.GetEntity.url}?$filter=Name eq '${sysListColumn.data[0].SysEntity}'&$expand=entityfield($expand=entityfielddatatype)`
          // ),
          getAPIData(
            APIEndPoints.GetEntityFieldOptionset.method,
            `${APIEndPoints.GetEntityFieldOptionset.url}?$expand=OptionSetOptions`
          ),
          getAPIData(
            APIEndPoints.GetEntity.method,
            `${APIEndPoints.GetEntity.url}?$expand=EntityField`
          ),
        ])
          .then(([rowData, optionSets, allEntities]) => {
            dispatch({
              type: 'SET_APIDATA',
              apiData: {
                sysListColumnResponse: sysListColumn.data[0],
                rowDataResponse: rowData.data,
                // entityFields: entityFields.data.value[0].EntityField,
                optionSets: optionSets.data.value,
                allEntities: allEntities.data.value,
              },
            })
          })
          .catch((err) => {
            showLoading(false)
            showToastMessage(err.message, 'error')
          })
          .finally(() => {
            showLoading(false)
          })
      }
    }
    fetchData()
  }, [showToastMessage, sysListId])

  React.useEffect(() => {
    const {
      sysListColumnResponse,
      rowDataResponse,
      // entityFields,
      optionSets,
      allEntities,
    } = state.apiData
    if (sysListColumnResponse && rowDataResponse) {
      let gridColumns = utils.generateGridColumns(
        sysListColumnResponse.ListColumn,
        {},
        overrideColumnProperty
      )

      // Provide cell editors based on datatype
      gridColumns = utils.provideCellEditors(
        gridColumns,
        {
          // entityFields,
          optionSets,
          allEntities,
        },
        '',
        '',
        '',
        sysListColumnResponse
      )
      const gridProperties = generateGridProperties(sysListColumnResponse)
      const GridDataIndex = gridColumns.findIndex((item) => item.Hide === false)
      gridColumns[GridDataIndex].checkboxSelection = true
      dispatch({
        type: 'SET_GRIDDATASOURCE',
        gridDatasource: {
          ...gridProperties,
          columnDefs: gridColumns,
          rowData: rowDataResponse || [],
          rowSelection: 'single',
          onRowSelected,
        },
      })
    }
  }, [state.apiData])

  return <FFGrid dataSource={state.gridDatasource} className="paymentGrid" />
}

export default PaymentGrid
