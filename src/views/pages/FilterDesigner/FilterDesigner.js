/* eslint-disable */
import React, { useState } from 'react'
import FilterDesigner from '../../components/custom/FilterDesigner/FilterDesigner'
const FilterDesignerPage = () => {
  const generateID = () => Math.random().toString()
  const DefaultQuery = {
    id: `g-${generateID()}`,
    type: 'group',
    groupType: 'and',
    entity: '',
    entityType: '',
    filters: [],
  }
  const [query, setQuery] = useState(DefaultQuery)

  const handleChange = (query) => {
    setQuery(query)
  }
  const formatString = JSON.stringify(query, null, 2)
  return (
    <div>
      <FilterDesigner
        EntityData="Case"
        QueryData={DefaultQuery}
        handleChange={handleChange}
      />
      <div>
        <pre>{formatString}</pre>
      </div>
    </div>
  )
}

export default FilterDesignerPage
