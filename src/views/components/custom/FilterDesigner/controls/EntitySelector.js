import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { isEmpty } from 'lodash'
import React from 'react'

import FFAutocomplete from '../../../base/FFAutocomplete/FFAutocomplete'

const EntitySelector = ({
  className,
  handleOnChange,
  options,
  value,
  title,
  field,
  fieldData,
  type,
  stringoperators,
  inputType,
  currentroot,
}) => {
  const datasource =
    currentroot &&
    isEmpty(currentroot.property) &&
    (type === 'LogicText' || type === 'LogicNumber')
      ? [...options, ...stringoperators]
      : options
  return options.length > 0 ? (
    // return options.length !== 0 ? (
    <FormControl className={className} title={title}>
      <FFAutocomplete
        id={title}
        name={title}
        // variant="outlined"
        Field={{
          FieldValue: title,
          FieldLabel: title,
          Datasource: datasource, // options,
          ValueField: 'DisplayName',
          TextField: 'DisplayName',
        }}
        value={value}
        onChangeHandler={(event, params) => handleOnChange(params.value)}
      />
    </FormControl>
  ) : null
}
EntitySelector.displayName = 'EntitySelector'
export default EntitySelector
