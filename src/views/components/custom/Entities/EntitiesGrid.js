import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import FFGrid from '../../base/FFGrid/FFGrid'

const EntityGrid = ({ onEdit, onDelete, searchData }) => {
  const history = useHistory()

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
      { headerName: 'Entity', field: 'Name', width: 200 },
      { headerName: 'Display Name', field: 'DisplayName', width: 200 },
      {
        headerName: 'Display Name Plural',
        field: 'DisplayNamePlural',
        width: 250,
      },
      { headerName: 'Description', field: 'Description', width: 400 },
      {
        headerName: 'Has Multiple Attachments',
        field: 'HasMultipleAttachments',
        width: 200,
      },
      {
        headerName: 'Supports Payments',
        field: 'IsSupportPayments',
        width: 155,
      },
      {
        headerName: 'Supports Activities',
        field: 'IsSupportActivities',
        width: 150,
      },
      {
        headerName: 'Supports Correspondence',
        field: 'IsSupportCorrespondences',
        width: 200,
      },
      {
        headerName: 'Enable Caching',
        field: 'IsEnableCaching',
        width: 150,
      },
      {
        headerName: 'TTL',
        field: 'TTL',
        width: 100,
      },
      {
        headerName: 'System Entity',
        field: 'IsSystemEntity',
        width: 150,
      },
    ],
    rowData: searchData && searchData[0]?.value,
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
      onCellClicked={(params) => {
        if (params.colDef.field !== 'edit') {
          history.push(
            `/Field?entityId=${params.data.Id}&` + `Name=${params.data.Name}`
          )
        }
      }}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}

EntityGrid.defaultProps = {
  onEdit: null,
  onDelete: null,
  searchData: [],
}

EntityGrid.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  searchData: PropTypes.instanceOf(Array),
}

export default EntityGrid
