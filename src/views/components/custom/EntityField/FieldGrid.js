import React from 'react'
import PropTypes from 'prop-types'
import FFGrid from '../../base/FFGrid/FFGrid'
import './FieldGrid.css'

const FieldGrid = ({ onEdit, onDelete, EntityFieldGridData }) => {
  const rowActions = [
    {
      ActionName: 'Edit',
      ActionHandler: onEdit,
    },
    {
      ActionName: 'Delete',
      ActionHandler: onDelete,
    },
  ]
  const Griddata = {
    columnDefs: [
      {
        cellRenderer: 'FFMoreVertIcon',
        headerName: '',
        field: 'Edit',
        width: 50,
        suppressMenu: false,
        suppressMovable: true,
        sortable: false,
        filter: false,
        resizable: false,
        lockVisible: true,
      },
      {
        headerName: 'Name',
        field: 'Name',
        width: 200,
      },
      {
        headerName: 'Display Name',
        field: 'DisplayName',
        width: 200,
      },
      {
        headerName: 'DataType',
        field: 'DataType',
        width: 200,
        cellRenderer: 'FFIconText',
        suppressMenu: true,
      },
      { headerName: 'Required', field: 'Required', width: 100 },
      { headerName: 'OptionSet', field: 'OptionSet', width: 100 },
      { headerName: 'MaxLength', field: 'MaxLength', width: 100 },
      { headerName: 'Lookup', field: 'Lookup', width: 100 },
      { headerName: 'ValidationRule', field: 'ValidationRule', width: 120 },
      { headerName: 'Description', field: 'Description', width: 250 },
      { headerName: 'Filters', field: 'Filters', width: 200 },
      { headerName: 'IsVisibleInUI', field: 'IsVisibleInUI', width: 120 },
      { headerName: 'Key', field: 'UniqueKey', width: 100 },
    ],
    rowData: EntityFieldGridData,
    rowActions,
  }

  return (
    <FFGrid
      data={Griddata}
      sortable
      filter
      floatingFilter={false}
      pagination={false}
      paginationPageSize={5}
      quickFilter={false}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}

FieldGrid.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  EntityFieldGridData: PropTypes.arrayOf(PropTypes.array),
}
FieldGrid.defaultProps = {
  onEdit: () => null,
  onDelete: () => null,
  EntityFieldGridData: [],
}

export default FieldGrid
