/* eslint-disable no-case-declarations */
import FormControl from '@material-ui/core/FormControl'
import React from 'react'
import FFAutocomplete from '../../../base/FFAutocomplete/FFAutocomplete'
import SwitchButton from '../../Switch/SwitchButton'
import FFTextBox from '../../../base/FFTextBox/FFTextBox'
import FFDatePicker from '../../../base/FFDatePicker/FFDatepicker'
import FFDateTimepicker from '../../../base/FFDateTimepicker/FFDateTimepicker'
import './Common.css'

const ValueEditor = ({
  field,
  operator,
  value,
  handleOnChange,
  title,
  className,
  type,
  inputType,
  values,
  fieldData,
  filterdata,
}) => {
  if (operator === 'null' || operator === 'notNull') {
    return null
  }
  switch (type) {
    case 'AutoComplete':
      const LookupEntityField =
        filterdata.length !== 0 &&
        fieldData.Lookup.length !== 0 &&
        filterdata.find((f) => f.Id === fieldData.Lookup)
      const ValueField =
        LookupEntityField &&
        LookupEntityField.EntityField.find(
          (f) => f.Id === fieldData.LookupTextField
        )
      return (
        <FormControl className={className}>
          <FFAutocomplete
            id={field}
            name={field}
            // variant="outlined"
            Field={{
              FieldValue: field,
              FieldLabel: field,
              DatasourceURL:
                (LookupEntityField && `/api/${LookupEntityField.Name}`) ||
                '/api/',
              ValueField: 'id',
              TextField: (ValueField && ValueField.DisplayName) || 'id',
            }}
            value={value}
            onChangeHandler={(event, params) => handleOnChange(params.value)}
          />
        </FormControl>
      )
    case 'MultiSelect':
      return (
        <FormControl className={className}>
          <FFAutocomplete
            id={field}
            name={field}
            // variant="outlined"
            Field={{
              FieldValue: field,
              FieldLabel: field,
              Datasource:
                fieldData.DataTypeName === 'OptionSet'
                  ? fieldData.OptionSetOptions
                  : fieldData.DataTypeName === 'TwoOptions'
                  ? [
                      { Name: 'True', Name: 'True' },
                      { Name: 'False', Name: 'False' },
                    ]
                  : [],
              DefaultValue: '',
              ValueField: 'Name',
              TextField: 'Name',
            }}
            value={value}
            onChangeHandler={(event, params) => handleOnChange(params.value)}
          />
        </FormControl>
      )
    case 'SwitchButton':
      return (
        <FormControl className={`${className} FilterDesigner_Switch`}>
          {/* <FFAutocomplete
            id={field}
            name={field}
            variant="outlined"
            Field={{
              FieldValue: field,
              FieldLabel: field,
              Datasource:
                fieldData.DataTypeName === 'OptionSet'
                  ? fieldData.OptionSetOptions
                  : fieldData.DataTypeName === 'TwoOptions'
                  ? [
                      { Name: 'True', Name: 'True' },
                      { Name: 'False', Name: 'False' },
                    ]
                  : [],
              DefaultValue: '',
              ValueField: 'Name',
              TextField: 'Name',
            }}
            value={value}
            onChangeHandler={(event, params) => handleOnChange(params.value)}
          /> */}
          <SwitchButton
            name={field}
            label={field}
            id={field}
            // CSSClass="FilterDesigner_Switch"
            value={value}
            checked={value}
            Field={{
              FieldName: field,
              FieldValue: true,
              FieldLabel: field,
              FieldType: 'Switch',
              CSSClass: '',
              IsView: false,
              className: 'filterControl',
            }}
            Screen="FilterDesigner"
            onSwitchhandler={(event, value) => handleOnChange(value)}
          />
        </FormControl>
      )
    case 'Date':
      return (
        <FormControl className={className}>
          <FFDatePicker
            name={field}
            label={field}
            Field={{
              FieldValue: field,
              FieldLabel: field,
              DateFormat: 'yyyy-dd-MM HH:mm:ss',
              className: 'filterControl',
            }}
            variant="filled"
            onChangeHandler={(e, params) => handleOnChange(params.value)}
            value={value}
          />
        </FormControl>
      )
    case 'DateandTime':
      return (
        <FormControl className={className}>
          <FFDateTimepicker
            name={field}
            label={field}
            Field={{
              FieldValue: field,
              FieldLabel: field,
              DateFormat: 'yyyy-dd-MM HH:mm:ss',
              className: 'filterControl',
            }}
            variant="filled"
            onChangeHandler={(e, params) => handleOnChange(params.value)}
            value={value}
          />
        </FormControl>
      )
    case 'Time':
      return (
        <FormControl className={className}>
          <FFTextBox
            name={field}
            value={value}
            label={field}
            // variant="outlined"
            type="time"
            onChange={(e) => handleOnChange(e.target.value)}
            // className={className}
            Field={{
              FieldValue: field,
              // FieldLabel: field,
              Type: 'time',
              Placeholder: field,
              Validation: { IsRequired: 'False' },
            }}
          />
        </FormControl>
      )
    case 'LogicNumber':
      return (
        <FormControl className={className}>
          <FFTextBox
            name={field}
            value={value}
            variant="filled"
            type="number"
            onChange={(e) => handleOnChange(e.target.value)}
            // className={className}
            Field={{
              FieldValue: field,
              FieldLabel: field,
              Type: 'number',
              Placeholder: field,
              inputmode: 'numeric',
              Validation: { IsRequired: 'False' },
            }}
          />
        </FormControl>
      )
    case 'Number':
      return (
        <FormControl className={className}>
          <FFTextBox
            name={field}
            value={value}
            variant="filled"
            type="number"
            onChange={(e) => handleOnChange(e.target.value)}
            // className={className}
            Field={{
              FieldValue: field,
              FieldLabel: field,
              Type: 'number',
              Placeholder: field,
              inputmode: 'numeric',
              Validation: { IsRequired: 'False' },
            }}
          />
        </FormControl>
      )
    case 'Decimal':
      return (
        <FormControl className={className}>
          <FFTextBox
            name={field}
            value={value}
            // variant="outlined"
            type="number"
            onChange={(e) => handleOnChange(e.target.value)}
            // className={className}
            Field={{
              FieldValue: field,
              FieldLabel: field,
              Type: 'number',
              Placeholder: field,
              inputmode: 'numeric',
              Validation: { IsRequired: 'False' },
            }}
          />
        </FormControl>
      )
    default:
      return (
        <FormControl className={className}>
          <FFTextBox
            name={field}
            value={value}
            // variant="outlined"
            type="text"
            onChange={(e) => handleOnChange(e.target.value)}
            // className={className}
            Field={{
              FieldValue: field,
              FieldLabel: field,
              Type: 'text',
              Placeholder: field,
              Validation: { IsRequired: 'False' },
            }}
          />
        </FormControl>
      )
  }
}

ValueEditor.displayName = 'ValueEditor'
export default ValueEditor
