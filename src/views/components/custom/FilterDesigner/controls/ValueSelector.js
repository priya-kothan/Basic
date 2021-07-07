import FormControl from '@material-ui/core/FormControl'
import _, { isEmpty } from 'lodash'
import React from 'react'

import FFAutocomplete from '../../../base/FFAutocomplete/FFAutocomplete'

const ValueSelector = ({
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
  const Numeric = [
    {
      Id: 'lt',
      Name: 'lt',
      DisplayName: 'Less than',
      ODataDesc: 'Less than',
      operatortype: 'NumericOpertionExp',
    },
    {
      Id: 'gt',
      Name: 'gt',
      DisplayName: 'Greater than',
      ODataDesc: 'Greater than',
      operatortype: 'NumericOpertionExp',
    },
    {
      Id: 'ge',
      Name: 'ge',
      DisplayName: 'Greater than or Equals',
      ODataDesc: 'Greater than or equal to',
      operatortype: 'NumericOpertionExp',
    },
    {
      Id: 'le',
      Name: 'le',
      DisplayName: 'Less than or Equals',
      ODataDesc: 'Less than or equal to',
      operatortype: 'NumericOpertionExp',
    },
  ]

  let datasource =
    currentroot &&
    isEmpty(currentroot.property) &&
    (type === 'LogicText' || type === 'LogicNumber')
      ? [...options, ...stringoperators]
      : options

  if (currentroot && !_.isEmpty(currentroot.property)) {
    if (title === 'Operators' && currentroot.property === 'length') {
      datasource = [...datasource, ...Numeric]
    }
  }

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
          ValueField: 'Name',
          TextField: 'DisplayName',
        }}
        value={value}
        onChangeHandler={(event, params) => handleOnChange(params.value)}
      />
    </FormControl>
  ) : null
}
ValueSelector.displayName = 'ValueSelector'
export default ValueSelector
