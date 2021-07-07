import React from 'react'
import PropTypes from 'prop-types'
import FFGrid from '../../base/FFGrid/FFGrid'

const FormDesignerGrid = ({ onEdit, onDelete, searchData }) => {
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

  const data = {
    columnDefs: [
      {
        headerName: '',
        field: 'edit',
        cellRenderer: 'FFMoreVertIcon',
        width: 40,
        suppressMenu: false,
        suppressMovable: true,
        sortable: false,
        filter: false,
        resizable: false,
        lockVisible: true,
      },
      { headerName: 'Form Name', field: 'FormName', width: 250 },
      {
        headerName: 'Published',
        field: 'IsPublished',
        width: 250,
        hide: true,
      },
    ],
    rowData: searchData && searchData[0],
    rowActions,
  }

  return (
    <FFGrid
      data={data}
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

FormDesignerGrid.defaultProps = {
  onEdit: null,
  onDelete: null,
  searchData: [],
}

FormDesignerGrid.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  searchData: PropTypes.instanceOf(Array),
}

export default FormDesignerGrid
