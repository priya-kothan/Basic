import PropTypes from 'prop-types'
import React from 'react'
import FFGrid from '../../base/FFGrid/FFGrid'

const OptionSetGrid = ({ DataSource, onEdit, onDelete }) => {
  return (
    <FFGrid
      data={DataSource}
      sortable="true"
      filter="true"
      floatingFilter={false}
      pagination={false}
      paginationPageSize={5}
      quickFilter={false}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
}

OptionSetGrid.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  DataSource: PropTypes.objectOf(PropTypes.any),
}

OptionSetGrid.defaultProps = {
  onEdit: () => null,
  onDelete: () => null,
  DataSource: {},
}

export default OptionSetGrid
