import React from 'react'
import { TextField, CircularProgress, Grid } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { useQuery } from 'react-query'
import getAPIData, { getCoreData } from '../../../../models/api/api'

import { MaterialIconAsync } from '../../../../utils/DatatypeIconData'
import './FFAutocomplete.css'
import _ from 'lodash'

function FFAutocomplete({
  id,
  name,
  className,
  Field,
  value,
  onChangeHandler,
  variant,
}) {
  let dataSourceQuery = null
  let dataSourceURL = ''

  const fieldsDataSource = Field.Datasource
  fieldsDataSource &&
    fieldsDataSource.unshift({
      Name: 'Select',
      id: 'Select',
    })

  // To avoid the duplication from data source
  const fieldDataSource = [
    ...new Map(
      fieldsDataSource?.map((item) => [JSON.stringify(item), item])
    ).values(),
  ]

  if (Field?.DatasourceURL === '/api/List')
    dataSourceURL = `${Field?.DatasourceURL}?$filter=contains(UseType,'View')`
  else dataSourceURL = Field?.DatasourceURL

  if (Field.dataSourceAPI) {
    dataSourceQuery = useQuery(
      ['autoCompleteData', dataSourceURL, Field.header],
      () =>
        getAPIData('get', dataSourceURL, '', Field.header).then((response) => {
          const data = response.data?.value[0]?.EntityField
          data.unshift({
            Name: 'Select',
            id: 'Select',
          })
          return data
        }),
      {
        enabled: !!dataSourceURL,
        placeholderData: [],
        retry: false,
      }
    )
  } else if (Field.Header && Field.Header !== null) {
    dataSourceQuery = useQuery(
      ['autoCompleteData', Field.Header],
      () =>
        getCoreData('get', dataSourceURL, '', Field.Header).then(
          (response) => response.data
        ),
      {
        enabled: !!dataSourceURL,
        placeholderData: [],
        retry: false,
      }
    )
  } else {
    dataSourceQuery = useQuery(
      ['autoCompleteData', dataSourceURL, Field.header],
      () =>
        getCoreData(
          Field?.postBody ? 'post' : 'get',
          dataSourceURL,
          Field?.postBody ? Field?.postBody : '',
          Field.header
        ).then((response) => {
          const { data } = response
          data.unshift({
            Name: 'Select',
            id: 'Select',
          })
          return response.data
        }),
      {
        enabled: !!dataSourceURL,
        placeholderData: [],
        retry: false,
      }
    )
  }
  //  const dataSourceQuery = useQuery(
  //    ['autoCompleteEditor', dataSourceURL],
  //    () => {
  //      if (!dataSourceURL) return []

  //      return getCoreData('get', dataSourceURL, '', dataSourceheader).then(
  //        (response) => response.data
  //      )
  //    },
  //    {
  //      enabled: !!props.dataSourceURL && open,
  //      refetchOnWindowFocus: false,
  //      placeholderData: [],
  //    }
  //  )

  function onChange(event, selectedValue) {
    if (onChangeHandler)
      onChangeHandler(event, {
        id: Field?.FieldValue,
        name: Field?.FieldValue,
        value: selectedValue[Field.ValueField] ?? 'Select',
        text: selectedValue[Field.TextField],
      })
  }

  function getOptionLabel(option) {
    const dataSource = Field.DatasourceURL
      ? dataSourceQuery?.data
      : fieldDataSource
    if (typeof option === 'string') {
      const selectedOption = dataSource?.find((item) => {
        if (item[Field.ValueField]) return item[Field.ValueField] === option
        return (item[Field.ValueField] ?? 'Select') === option
      })
      return selectedOption
        ? `${
            selectedOption[Field.TextField] || selectedOption[Field.ValueField]
          }`
        : ''
    }

    return `${option[Field.TextField] || option[Field.ValueField] || ''}`
  }

  if (Field?.DatasourceURL && dataSourceQuery?.isFetching) return null

  const dataSource = Field?.DatasourceURL
    ? dataSourceQuery?.data || []
    : fieldDataSource

  return (
    <div className="autocompletectrl">
      {Field.className === 'Formviwer' ? (
        <span className="FormviwerFFAutocomplete-Label">
          {' '}
          {Field && Field.FieldLabel}
        </span>
      ) : (
        ''
      )}
      <Autocomplete
        id={id}
        name={name || id}
        InputProps={{ style: { fontSize: 30 } }}
        // className={`autocomplete ${className}`}
        className={`autocomplete ${Field.className} ${className}`}
        disableClearable
        loading={Field?.DatasourceURL && dataSourceQuery?.isFetching}
        loadingText="Loading..."
        options={
          dataSource.length == 0
            ? [{ Name: 'Select', id: 'Select' }]
            : dataSource
        }
        getOptionSelected={(option, optionValue) =>
          option[Field.ValueField] === optionValue
        }
        disabled={Field?.Disabled ? Field.Disabled : false}
        getOptionLabel={getOptionLabel}
        onChange={onChange}
        defaultValue={Field.DefaultValue}
        value={value || ''}
        renderOption={(option) => {
          if (option.Icon) {
            return (
              <Grid container className="iconselect">
                <Grid item xs={1.5}>
                  <MaterialIconAsync icon={option.Icon} />
                </Grid>
                <Grid item xs={6}>
                  {`${
                    option[Field.TextField] || option[Field.ValueField] || ''
                  }`}
                </Grid>
              </Grid>
            )
          }
          return `${option[Field.TextField] || option[Field.ValueField] || ''}`
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={Field.FieldLabel}
            // variant={variant || 'filled'}
            variant={
              Field.className === 'Formviwer' ? 'standard' : variant || 'filled'
            }
            className={`${Field.className} ${''}`}
            size="small"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {dataSourceQuery?.isFetching ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  )
}

export default FFAutocomplete
