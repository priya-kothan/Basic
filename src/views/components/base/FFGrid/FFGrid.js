import React from 'react'
import PropTypes from 'prop-types'
import { AgGridReact } from '@ag-grid-community/react'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import _ from 'lodash'

import FFMoreVertIcon from '../FFMoreVertIcon/FFMoreVertIcon'
import ListIconRenderer from './Renderers/ListIconRenderer/ListIconRenderer'
import CustomLoadingOverlay from './CustomLoadingOverlay/CustomLoadingOverlay'
import ListViewDesignerGridHeader from './ListViewDesignerGridHeader/ListViewDesignerGridHeader'
import AddColumnHeader from './AddColumnHeader/AddColumnHeader'
import DatePicker from './CellComponents/DatePicker/DatePicker'
import DateEditor from './Editors/DateEditor/DateEditor'
import AutoCompleteEditor from './Editors/AutoCompleteEditor/AutoCompleteEditor'
import AutoCompleteRenderer from './Renderers/AutoCompleteRenderer/AutoCompleteRenderer'
import TextEditor from './Editors/TextEditor/TextEditor'
import NumericEditor from './Editors/NumericEditor/NumericEditor'
import GridAddButton from './CellComponents/GridAddButton/GridAddButton'
import IconCell from './CellComponents/IconCell/IconCell'
import EntityGridForm from './EntityGridForm/EntityGridForm'
import FFIconText from './FFIconText/FFIconText'
import '@ag-grid-enterprise/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham.css'
import MenuUrlRender from './Renderers/MenuUrlRender/MenuUrlRender'

import './FFGrid.css'

const FFGrid = ({
  dataSource,
  data,
  pagination,
  paginationPageSize,
  floatingFilter,
  onRowClicked,
  onCellClicked,
  onEdit,
  onDelete,
  onCopy,
  onGridReady,
  className,
  entityName,
  onGridRowEditHandler,
  useExternalFilters,
  rowModelType,
  cacheOverflowSize,
  maxBlocksInCache,
  infiniteInitialRowCount,
  cacheBlockSize,
  serverSideStoreType,
}) => {
  const [gridAPI, setGridAPI] = React.useState({})
  const { columnDefs } = dataSource || data
  const useExternalFiltersRef = React.useRef(useExternalFilters)

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    editable: false,
  }

  const gridproptarray = []

  if (onEdit)
    gridproptarray.push({
      ActionName: 'Edit',
      ActionHandler: onEdit,
    })
  if (onDelete)
    gridproptarray.push({
      ActionName: 'Delete',
      ActionHandler: onDelete,
    })
  if (onCopy)
    gridproptarray.push({
      ActionName: 'Copy',
      ActionHandler: onCopy,
    })
  // Todo: Refactor
  const gridProperties = {
    RowActions: gridproptarray,
  }

  const gridCellComponents = {
    FFMoreVertIcon: (params) => {
      if (params.data && gridProperties) {
        return (
          <FFMoreVertIcon
            RowActions={
              gridProperties.RowActions ? gridProperties.RowActions : null
            }
            {...params}
          />
        )
      }
      return <img src="https://www.ag-grid.com/example-assets/loading.gif" />
    },
    FFIconText: (params) => {
      if (gridProperties)
        return (
          <FFIconText
            RowActions={
              gridProperties.RowActions ? gridProperties.RowActions : null
            }
            {...params}
          />
        )
      return <img src="https://www.ag-grid.com/example-assets/loading.gif" />
    },
    CustomLoadingOverlay,
    EntityGridForm,
    ListViewDesignerGridHeader,
    AddColumnHeader,
    GridAddButton,
    agDateInput: DatePicker,
    dateEditor: DateEditor,
    AutoCompleteEditor,
    TextEditor,
    NumericEditor,
    AutoCompleteRenderer,
    IconCell: (params) => {
      return (
        <IconCell
          RowActions={
            gridProperties.RowActions ? gridProperties.RowActions : null
          }
          {...params}
          node={params.node}
        />
      )
    },
    ListIconRenderer,
    MenuUrlRender,
  }

  const onGridReadyHandler = (params) => {
    setGridAPI(params)
    if (onGridReady) onGridReady(params)
  }

  const isExternalFilterPresent = () => {
    return !_.isEmpty(useExternalFiltersRef.current)
  }

  function doesExternalFilterPass(node) {
    if (_.isEmpty(useExternalFiltersRef.current)) return true

    if (!_.isArray(useExternalFiltersRef.current))
      return _.isMatch(node.data, useExternalFiltersRef.current)

    return _.some(useExternalFiltersRef.current, (filter) =>
      _.isMatch(node.data, filter)
    )
  }

  // React.useEffect(() => {
  //   const rowData = dataSource?.rowData || data?.rowData

  //   if (gridAPI && _.isEmpty(rowData)) {
  //     gridAPI.api.hideOverlay()
  //     gridAPI.api.showNoRowsOverlay()
  //   }
  // }, [data?.rowData, dataSource?.rowData, gridAPI])

  React.useEffect(() => {
    if (useExternalFilters) {
      useExternalFiltersRef.current = useExternalFilters
      gridAPI.api?.onFilterChanged()
    }
  }, [gridAPI.api, useExternalFilters])

  return (
    <div className={`ag-theme-balham ${className || ''}`}>
      <AgGridReact
        modules={AllModules}
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
        rowData={data && data?.rowData && [...data?.rowData]}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        frameworkComponents={gridCellComponents}
        floatingFilter={floatingFilter}
        cacheQuickFilter
        onGridReady={onGridReadyHandler}
        onRowClicked={onRowClicked && onRowClicked}
        onCellClicked={onCellClicked && onCellClicked}
        overlayNoRowsTemplate="<span>No records to show</span>"
        // loadingOverlayComponent="CustomLoadingOverlay"
        overlayLoadingTemplate={
          '<span className="custom-loading-overlay">Please wait while your records are loading</span>'
        }
        suppressDragLeaveHidesColumns
        getRowNodeId={(gridData) => gridData.id}
        gridOptions={{ rowHeight: 40 }}
        // stopEditingWhenGridLosesFocus
        suppressMakeColumnVisibleAfterUnGroup
        // groupMultiAutoColumn
        // showOpenedGroup
        animateRows
        applyColumnDefOrder
        entityName={entityName}
        onGridRowEditHandler={onGridRowEditHandler}
        isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass}
        rowModelType={rowModelType}
        cacheOverflowSize={cacheOverflowSize}
        maxBlocksInCache={maxBlocksInCache}
        infiniteInitialRowCount={infiniteInitialRowCount}
        cacheBlockSize={cacheBlockSize}
        serverSideStoreType={serverSideStoreType}
        rowBuffer={0}
        {...dataSource}
        rowHeight="40"
      />
    </div>
  )
}

FFGrid.defaultProps = {
  dataSource: null,
  data: null,
  pagination: null,
  paginationPageSize: null,
  floatingFilter: null,
  onRowClicked: null,
  onCellClicked: null,
  onEdit: null,
  onDelete: null,
  onCopy: null,
  onGridReady: null,
  cacheOverflowSize: null,
  rowModelType: null,
  maxBlocksInCache: null,
  infiniteInitialRowCount: null,
  cacheBlockSize: null,
  serverSideStoreType: null,
}

FFGrid.propTypes = {
  dataSource: PropTypes.shape({
    columnDefs: PropTypes.arrayOf(PropTypes.object),
    rowData: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.bool,
    paginationPageSize: PropTypes.number,
  }),
  data: PropTypes.instanceOf(Array),
  pagination: PropTypes.number,
  paginationPageSize: PropTypes.number,
  floatingFilter: PropTypes.string,
  onRowClicked: PropTypes.func,
  onCellClicked: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onCopy: PropTypes.func,
  onGridReady: PropTypes.func,
}

export default FFGrid
