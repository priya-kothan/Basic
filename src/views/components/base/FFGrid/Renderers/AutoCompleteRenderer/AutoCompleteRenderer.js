import React from 'react'
import { useQuery } from 'react-query'
import _ from 'lodash'

import { getCoreData } from '../../../../../../models/api/api'

const AutoCompleteRenderer = (props) => {
  const dataSourceQuery = useQuery(
    ['autoCompleteEditor', props.dataSourceURL],
    () =>
      getCoreData('post', props.dataSourceURL, props.postBody).then(
        (response) => response.data
      ),
    {
      enabled: !!props.dataSourceURL,
      placeholderData: [{ id: '' }],
      staleTime: 60000, // Data is considered fresh for 1 min, meaning that, i'll not fetch for fresh data for 1 min
    }
  )

  if (_.isEmpty(props.value)) return ''

  const selectedOption = dataSourceQuery.data.find((item) => {
    if (typeof props.value[0] !== 'object') return item.id === props.value[0]

    return item.id === props.value[0]?.id
  })

  return selectedOption
    ? selectedOption[props.textField] ||
        selectedOption[props.valueField] ||
        null
    : null
}

export default AutoCompleteRenderer
