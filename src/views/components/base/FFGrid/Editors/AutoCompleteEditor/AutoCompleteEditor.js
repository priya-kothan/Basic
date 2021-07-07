import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react'
import { TextField, CircularProgress } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useQuery } from 'react-query'
import _ from 'lodash'
import utils from '../../../../../../utils/utils'
import getAPIData, { getCoreData } from '../../../../../../models/api/api'
// import APIEndPoints from '../../../../../../models/api/apiEndpoints'

const AutoCompleteEditor = forwardRef((props, ref) => {
  let inputval = ''
  if (typeof props?.value === 'string') {
    inputval = props?.value
  } else if (!_.isEmpty(props?.value)) {
    inputval = props?.value[0][props.textField || props.valueField]
  }
  const finput = { [props.textField]: inputval }
  const [value, setValue] = useState(finput)
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = React.useState(false)
  let dataSourceQuery = null
  const [dataSourceheader, setdataSourceheader] = useState(props.header)
  function getCascadingProperties() {
    const cascadingEntityFields = props.entityMetaData.find(
      (entity) => entity.Id === props.cascadingProperties.cascadingEntity
    )
    const cascadingBasedOn = cascadingEntityFields.EntityField.find(
      (entityField) =>
        entityField.Id === props.cascadingProperties.CascadingEntityColumn
    )
    const filterProperty = props.cascadingProperties.lookupEntity.EntityField.find(
      (entityField) =>
        entityField.Id === props.cascadingProperties.CascadingParentEntityField
    )

    return {
      cascadingBasedOn: cascadingBasedOn?.Name,
      filterProperty: filterProperty?.Name,
    }
  }

  function getDataSourceUrl() {
    if (props.cascadingProperties?.CascadingEntityColumn) {
      const cascadingProperties = getCascadingProperties(
        props.cascadingProperties
      )

      if (props.data[cascadingProperties.cascadingBasedOn])
        return `${props.dataSourceURL}?$filter=${
          cascadingProperties.filterProperty
        } eq ${props.data[cascadingProperties.cascadingBasedOn]}`

      return ''
    }

    return props.dataSourceURL
  }

  function getMenuHierarchy() {
    if (
      props?.lookupname?.toLowerCase() === 'menuitem' &&
      props.data?.MenuType?.toLowerCase() === 'item'
    ) {
      return `${props.dataSourceURL}?$filter=MenuType eq 'NavSection'`
    }
    if (
      props?.lookupname?.toLowerCase() === 'menuitem' &&
      props.data?.MenuType?.toLowerCase() === 'navsection'
    ) {
      return `${props.dataSourceURL}?$filter=MenuType eq 'NavGroup'`
    }
    return props.dataSourceURL
  }

  const dataSourceURL =
    props?.lookupname?.toLowerCase() === 'menuitem' &&
    (props.data?.MenuType?.toLowerCase() === 'item' ||
      props.data?.MenuType?.toLowerCase() === 'navsection')
      ? getMenuHierarchy()
      : getDataSourceUrl()

  const postBody = props?.postBody
  dataSourceQuery = useQuery(
    ['autoCompleteEditor', dataSourceURL],
    () => {
      if (!dataSourceURL) return []

      if (props?.isEntityManager) {
        return getAPIData('get', dataSourceURL, '', dataSourceheader).then(
          (response) => {
            const data = response.data.value.find(
              (item) => item.Id === props.colDef.OptionsetId
            )?.OptionSetOptions
            if (
              props.agGridReact.props.entityName.toLowerCase() === 'menuitem'
            ) {
              data.unshift({
                Name: 'Select',
                Value: 'Select',
              })
            }
            return data
          }
        )
      }

      return getCoreData(
        'post',
        dataSourceURL,
        postBody,
        dataSourceheader
      ).then((response) => {
        if (props.agGridReact.props.entityName.toLowerCase() === 'menuitem') {
          const { data } = response

          data.unshift({
            Name: 'Select',
            id: 'Select',
          })
          return data
        }

        return response.data
      })
    },
    {
      enabled: !!props.dataSourceURL,
      // TODO, Check this and find why we are using this.
      staleTime: 60000, // Data is considered fresh for 1 min, meaning that, i'll not fetch for fresh data for 1 min
      placeholderData: [],
    }
  )
  // }

  function onChangeHandler(e, value) {
    setValue(value)
    props.api
      .getRowNode(props.data.id)
      .setDataValue(props.colDef.field, value[props.valueField])
  }

  function onInputChangeHandler(e, inputValue) {
    setInputValue(inputValue)
  }

  useImperativeHandle(ref, () => {
    return {
      getValue: () => {
        // if (!value && props.options.length > 0)
        //   return props.options[0][props.valueField]
        if (value) return value[props.valueField]
        return null
      },
      afterGuiAttached: () => {
        let selectedOption = null
        let dataSource = null

        if (_.isEmpty(props.value)) return null

        if (props.dataSourceURL) dataSource = dataSourceQuery.data
        else dataSource = props.options

        selectedOption =
          dataSource &&
          dataSource.find((option) => {
            if (typeof props.value[0] !== 'object') {
              return option[props.valueField] === props.value
            }
            return option[props.valueField] === props.value[0]?.id
          })
        if (selectedOption) setValue(selectedOption)
      },
      focusIn: () => {
        const inputRef = document.getElementById(
          `autocomplete-${props.column.colId}`
        )
        inputRef.focus()
        inputRef.select()
      },
    }
  })

  function getOptionLabel(option) {
    return `${option[props.textField] || option[props.valueField] || ''}`
  }

  React.useEffect(() => {
    async function fetchData() {
      // const casecadingAPICall = await getAPIData(
      //   APIEndPoints.GetEntity.method,
      //   `${APIEndPoints.GetEntity.url}?$expand=EntityField`
      // ).then((response) => response.data.value)

      if (props.entityMetaData) {
        const casecadingAPICall = props.entityMetaData
        const entitydata = casecadingAPICall.find(
          (item) => item.Name === props.agGridReact.props.entityName
        )

        const AppResourceId = casecadingAPICall.find(
          (item) => item.Name === 'AppResource'
        )

        const entityField = entitydata.EntityField.filter((item) => {
          return (
            item.Lookup?.toLowerCase() === AppResourceId.Id?.toLowerCase() &&
            item.DataTypeId?.toLowerCase() ===
              utils.getEntityFieldDataType.Lookup?.toLowerCase()
          )
        }).map(({ Id, LookupFilter }) => {
          return { Id, LookupFilter }
        })

        let header = {}

        if (
          entityField &&
          entityField[0]?.LookupFilter !== '' &&
          (entitydata.Name.toLowerCase() === 'menuitem' || 'list')
        ) {
          header = {
            EntityFieldId: entityField && entityField[0]?.Id,
            IsLookupFilter: true,
            ParentEntityName: entitydata.Name,
          }
          localStorage.setItem('editableheaderdata', JSON.stringify(header))
        } else {
          localStorage.setItem('editableheaderdata', JSON.stringify(header))
        }
      }
    }
    fetchData()
  }, [])

  return (
    <Autocomplete
      id={`autocomplete-${props.column.colId}`}
      options={
        props.dataSourceURL
          ? dataSourceQuery.data || []
          : props?.options ?? [{ id: '' }]
      }
      // options={props.options}
      value={value}
      loading={dataSourceQuery.isFetching}
      getOptionLabel={getOptionLabel}
      onChange={onChangeHandler}
      inputValue={
        inputValue ||
        dataSourceQuery?.data?.find((element) => element.id === inputval)?.Name
      }
      onInputChange={onInputChangeHandler}
      disableClearable
      renderOption={(option) =>
        `${option[props.textField] || option[props.valueField] || ''}`
      }
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={`Select ${props.column.colId}`}
          // size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {dataSourceQuery.isFetching ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
})

export default AutoCompleteEditor
