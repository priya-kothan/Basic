import React from 'react'
import {
  Close,
  Close as CloseIcon,
  Edit as EditIcon,
  KeyboardArrowRight,
  KeyboardArrowUp,
} from '@material-ui/icons'
import PropTypes from 'prop-types'
import {
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@material-ui/core'
import { useQuery } from 'react-query'
import _ from 'lodash'
import ReactJson from 'react-json-view'
import queryString from 'query-string'
import { useHistory } from 'react-router-dom'

import getAPIData from '../../../../../models/api/api'
import apiEndpoints from '../../../../../models/api/apiEndpoints'
import FFTextBox from '../../../base/FFTextBox/FFTextBox'
import FFAutocomplete from '../../../base/FFAutocomplete/FFAutocomplete'
import CalculatedFieldsDesigner from '../../CalculatedFieldsDesigner/CalculatedFieldsDesigner'
import SwitchButton from '../../Switch/SwitchButton'
import FFButton from '../../../base/FFButton/FFButton'
import { ItemsList } from './Rolluptype'
import CRUDModal from '../../CRUDModal/CRUDModal'
import FilterDesigner from '../../FilterDesigner/FilterDesigner'
import './AddField.css'

const AddField = ({
  CancelFieldHandler,
  CreateEntityFieldHandler,
  OptionsetDatasource,
  RequiredDatasource,
  DataTypeDatasource,
  editData,
  LookupData,
  EntityFields,
  EntityName,
  EntityId,
  RelatedEntities,
  RelatedEntitiesField,
  RollupFieldlist,
  RollupTypelist,
}) => {
  const iniState = {
    Id: '',
    Name: '',
    DisplayName: '',
    RequiredId: '',
    Description: '',
    Filters: '',
    DataTypeId: 0,
    MaxLength: '',
    ValidationRule: '',
    OptionSetId: '',
    LookupId: '',
    LookupTextField: '',
    EntityId: '',
    IsVisibleInUI: null,
    IsUniqueKey: null,
    IsGlobalSearch: null,
    IsDisplayName: null,
    CascadingEntityColumn: '',
    CascadingParentEntityField: '',
    IsRollupField: null,
    IsImmediateCalculation: null,
    RelatedEntity: '',
    RelatedField: '',
    Criteria: '',
    RollupType: '',
    RollupField: '',
    LookupFilter: '',
  }
  const history = useHistory()
  const [values, setValues] = React.useState(editData || iniState)
  // const [lookupFields, setLookupFields] = React.useState(EntityFields)
  const [lookupFields, setLookupFields] = React.useState([
    { Name: 'Select', id: 'Select' },
  ])

  const [EntityData, setEntityData] = React.useState(RelatedEntities)
  const [EntityFieldData, setEntityFieldData] = React.useState(
    RelatedEntitiesField || []
  )
  const [EntityNumberFieldData, setEntityNumberFieldData] = React.useState(
    RollupFieldlist || []
  )
  const Activitylistitem = ItemsList
  const [showModal, setshowModal] = React.useState(false)
  const [showCalculatedFieldsPopup, setShowCalculatedFieldsPopup] =
    React.useState(false)
  const [showLookupFilterPopup, setshowLookupFilterPopup] =
    React.useState(false)
  const LookupFilterentity =
    LookupData &&
    values.LookupId &&
    LookupData.find((item) => item.Id === values.LookupId)
  const [showLookupFilterentity, setshowLookupFilterentity] = React.useState(
    LookupFilterentity?.Name || ''
  )
  const [enittydataval, setenittydataval] = React.useState(
    editData.RelatedEntity || ''
  )
  const queryParams = queryString.parse(history.location.search)

  const [RollupType, setRollupType] = React.useState(RollupTypelist || '')
  // const [RollupFieldvalue, setRollupFieldvalue] = React.useState(
  //   RollupTypelist || ''
  // )
  let lookupDataTypeName = null

  lookupDataTypeName = DataTypeDatasource.reduce((acc, cur) => {
    return { ...acc, [cur.Id]: cur }
  }, {})

  const cascadingEntityColumnQuery = useQuery({
    queryKey: ['cascadingEntityColumn'],
    queryFn: () =>
      getAPIData(
        apiEndpoints.GetEntity.method,
        `${apiEndpoints.GetEntityFields.url}?$filter=EntityId eq ${EntityId} and contains(EntityFieldDataType/Name,'LookUp')&$expand=EntityFieldDataType`
      ).then((response) => {
        if (editData.Id)
          return response.data.value.filter((item) => item.Id !== editData.Id)

        return response.data.value
      }),
    enabled: !!EntityId,
    placeholderData: [],
  })

  const cascadingParentEntityFieldQuery = useQuery({
    queryKey: [`cascadingParentEntityFieldQuery`, values.LookupId],
    queryFn: () => {
      const lookupId = cascadingEntityColumnQuery.data.find(
        (entityField) => entityField.Id === values.CascadingEntityColumn
      )

      return getAPIData(
        apiEndpoints.GetEntityFields.method,
        `${apiEndpoints.GetEntityFields.url}?$expand=EntityFieldDataType&$filter=EntityId eq ${values.LookupId} and EntityFieldDataType/Name eq 'LookUp' and Lookup eq '${lookupId.Lookup}'`
      ).then((response) => response.data.value)
    },
    enabled:
      cascadingEntityColumnQuery.isFetched &&
      !!values.CascadingEntityColumn &&
      !!values.LookupId,
    placeholderData: [],
  })

  const handleInputChanged = (e, params) => {
    const re = /^[0-9\b]+$/
    const { name, value } = e?.target ?? params
    if (
      e?.target &&
      !re.test(e.target?.value) &&
      e.target.name === 'MaxLength'
    ) {
      setValues({
        ...values,
        [name]: '',
      })
    } else {
      setValues({
        ...values,
        [name]: value,
      })
    }
  }

  const dropdownhandleInputChanged = (event, params) => {
    const { name, value } = params

    if (name === 'CascadingEntityColumn') {
      setValues({
        ...values,
        [name]: value,
        CascadingParentEntityField: null,
      })
    } else if (name === 'RollupType') {
      setValues({
        ...values,
        [name]: value,
        RollupField: '',
      })
      if (value === 'COUNT') {
        setEntityNumberFieldData(RollupType.EntityField)
      } else {
        const Filterentity = fielddatatype(RollupType)
        setEntityNumberFieldData(Filterentity)
      }
    } else if (name === 'LookupId') {
      setshowLookupFilterentity(params.text)
      setValues({
        ...values,
        [name]: value,
        LookupFilter: '',
        LookupTextField: null,
      })
    } else {
      setValues({
        ...values,
        [name]: value,
      })
    }

    if (lookupDataTypeName[value]?.Name !== 'Lookup' && name === 'DataTypeId') {
      setValues({
        ...values,
        [name]: value,
        CascadingParentEntityField: null,
        CascadingEntityColumn: null,
      })
    }
  }

  const dropdownRelatedEntityChanged = (event, params) => {
    const Lookupiddata = []
    const { name, value } = params
    setValues({
      ...values,
      [name]: value,
      RollupField: '',
      RelatedField: '',
    })

    if (event.target.innerText !== values.RelatedEntity) {
      setValues({
        ...values,
        [name]: value,
        RollupField: '',
        RelatedField: '',
        Criteria: '',
      })
    }
    setenittydataval(event.target.innerText)
    const fieldsData = EntityData.find((f) => f.Name === value)
    setRollupType(fieldsData)
    const entityFielddata = getlookupdata(fieldsData, Lookupiddata)
    setEntityFieldData(entityFielddata)
  }

  function getlookupdata(entityList, Lookupiddata) {
    entityList.length !== 0 &&
      entityList.EntityField.forEach((entityField) => {
        if (entityField.EntityFieldDataType.Name === 'Lookup') {
          if (entityField.Lookup === EntityId) {
            Lookupiddata.push(entityField)
          }
        }
      })
    const uniqueNames = Array.from(new Set(Lookupiddata))
    return uniqueNames
  }
  const onCriteriaAdd = () => {
    setshowModal(true)
  }

  function fielddatatype(fieldsData) {
    const lookupentitesid = []
    fieldsData.EntityField.map((entityField) => {
      if (
        entityField.EntityFieldDataType.Name === 'DecimalNumber' ||
        entityField.EntityFieldDataType.Name === 'WholeNumber' ||
        entityField.EntityFieldDataType.Name === 'AutoNumber'
      ) {
        lookupentitesid.push(entityField)
      }
    })

    return lookupentitesid
  }

  const onSwitchhandler = (event, value) => {
    setValues({
      ...values,
      [event.target.name]: value,
    })
  }
  const SaveFieldHandler = (event) => {
    let isVisibleInUI = values.IsVisibleInUI

    if (isVisibleInUI === undefined) {
      isVisibleInUI = false
    } else {
      isVisibleInUI = values.IsVisibleInUI
    }

    let { IsUniqueKey } = values
    if (IsUniqueKey === undefined) {
      IsUniqueKey = false
    } else {
      IsUniqueKey = values.IsUniqueKey
    }
    let globalsearch = values.IsGlobalSearch

    if (globalsearch === undefined) {
      globalsearch = false
    } else {
      globalsearch = values.IsGlobalSearch
    }
    let { IsDisplayName } = values
    if (IsDisplayName === undefined) {
      IsDisplayName = false
    } else {
      IsDisplayName = values.IsDisplayName
    }
    let { IsRollupField } = values
    if (IsRollupField === undefined) {
      IsRollupField = false
    } else {
      IsRollupField = values.IsRollupField
    }
    let { IsImmediateCalculation } = values
    if (IsImmediateCalculation === undefined) {
      IsImmediateCalculation = false
    } else {
      IsImmediateCalculation = values.IsImmediateCalculation
    }
    const {
      Id,
      Name,
      DisplayName,
      Description,
      Filters,
      DataTypeId,
      ValidationRule,
      OptionSetId,
      RequiredId,
      LookupId,
      LookupTextField,
      CascadingEntityColumn,
      CascadingParentEntityField,
      RelatedEntity,
      RelatedField,
      Criteria,
      RollupType,
      RollupField,
      LookupFilter,
    } = values
    const MaxLength = parseInt(values.MaxLength, 10)

    CreateEntityFieldHandler(
      event,
      Name,
      DisplayName,
      // Required,
      Description,
      Filters,
      DataTypeId,
      MaxLength,
      ValidationRule,
      OptionSetId,
      RequiredId,
      LookupId,
      LookupTextField,
      Id,
      isVisibleInUI,
      IsUniqueKey,
      IsDisplayName,
      globalsearch,
      CascadingEntityColumn,
      CascadingParentEntityField,
      IsRollupField,
      IsImmediateCalculation,
      RelatedEntity,
      RelatedField,
      Criteria,
      RollupType,
      RollupField,
      LookupFilter
    )
  }

  const setDefaultValues = () => {
    if (!values.RequiredId)
      setValues({
        ...values,
        RequiredId:
          RequiredDatasource?.find(function (item) {
            if (item.Name === 'Optional') return item
          })?.Id || '0',
      })
    if (!values.DataTypeId)
      setValues({
        ...values,
        DataTypeId:
          DataTypeDatasource?.find(function (item) {
            if (item.Name === 'Text') return item
          })?.Id || '',
        CascadingParentEntityField: null,
        CascadingEntityColumn: null,
      })
  }

  setDefaultValues()

  React.useEffect(() => {
    // ToDo: Have to filter instead of making API call
    if (values.LookupId && values.LookupId != 'Select') {
      async function fetchData() {
        await getAPIData(
          apiEndpoints.GetEntityFields.method,
          `${apiEndpoints.GetEntityFields.url}?$filter=EntityId eq ${values.LookupId}`
        )
          .then((reponse) => {
            setLookupFields(reponse.data.value)
          })
          .catch((err) => null)
      }
      fetchData()
    } else {
      setLookupFields([{ Name: 'Select', id: 'Select' }])
    }
  }, [values.LookupId])

  const onhandleClick = (query) => {
    const filterdatavalue = { name: 'Criteria', value: query }
    const { name, value } = filterdatavalue
    setValues({
      ...values,
      [name]: value,
    })
    setshowModal(false)
  }
  const CloseFieldHandler = () => {
    setshowModal(false)
  }
  const onhandleLookupFilterClick = (query) => {
    const filterdatavalue = { name: 'LookupFilter', value: query }
    const { name, value } = filterdatavalue
    setValues({
      ...values,
      [name]: value,
    })
    setshowLookupFilterPopup(false)
  }

  function onCalculatedFieldChangeHandler(calculatedFieldsOutput) {
    handleInputChanged(null, {
      name: 'Filters',
      value: JSON.stringify(calculatedFieldsOutput),
    })
  }
  const [openAdvanced, setOpenAdvanced] = React.useState(false)
  const [openRollup, setOpenRollup] = React.useState(false)
  const resetOpenAdvanced = () => {
    setOpenAdvanced(!openAdvanced)
  }
  const onRollupChange = (event, expanded) => {
    setOpenRollup(expanded)
  }

  return (
    <>
      <div className="addAddFieldmodal">
        <div className="addAddFieldmodal__header">
          <span className="header-title">
            {values && values.Id === undefined ? 'New Field' : 'Edit Field'}
          </span>
          <span className="header-close">
            <Close onClick={CancelFieldHandler} />
          </span>
        </div>
        <div className="addAddFieldmodal__content">
          <FFTextBox
            name="DisplayName"
            label="Display Name"
            value={values.DisplayName}
            onChange={handleInputChanged}
            // error={errors.Name}
            className="AddField"
            Field={{
              FieldValue: 'DisplayName',
              FieldLabel: 'Display Name',
              Validation: { IsRequired: 'False' },
            }}
            Screen="AddField"
          />

          <FFTextBox
            name="Name"
            label="Name"
            value={values.Name}
            onChange={handleInputChanged}
            disabled={!(values && values.Id === undefined)}
            // error={errors.Name}
            className="AddField"
            Field={{
              FieldValue: 'Name',
              FieldLabel: 'Name',
              Validation: { IsRequired: 'False' },
            }}
            Screen="AddField"
          />

          <FFAutocomplete
            id="DataTypeId"
            name="DataTypeId"
            Field={{
              FieldValue: 'DataTypeId',
              FieldLabel: 'Data Type',
              Datasource: DataTypeDatasource,
              ValueField: 'Id',
              TextField: 'Name',
              Disabled: !(values && values.Id === undefined),
            }}
            value={values.DataTypeId}
            onChangeHandler={dropdownhandleInputChanged}
          />

          <FFAutocomplete
            id="RequiredId"
            name="RequiredId"
            Field={{
              FieldValue: 'RequiredId',
              FieldLabel: 'Required',
              Datasource: RequiredDatasource,
              ValueField: 'Id',
              TextField: 'Name',
            }}
            value={values.RequiredId}
            onChangeHandler={dropdownhandleInputChanged}
          />

          {/* <FFMultilineTextbox
            id="Description"
            name="Description"
            label="Description"
            onChangeHandler={handleInputChanged}
            className="AddFieldM"
            value={values.Description}
            Field={{
              FieldValue: 'Description',
              FieldLabel: 'Description',
              Rows: '2',
              Variant: 'outlined',
              Placeholder: 'Enter Description.',
              Validation: {
                IsRequired: 'False',
                ValidationCondition: '',
              },
            }}
            Screen="AddField"
          /> */}
          <FFTextBox
            name="Description"
            label="Description"
            className="EntityAddM"
            Field={{
              FieldValue: 'Description',
              FieldLabel: `Description`,
              IsEnableHelpText: false,
              Placeholder: `Description Message here`,
              Multiline: true,
              Rows: 3,
            }}
            Screen="EntityAdd"
            value={values.Description}
            onChangeHandler={handleInputChanged}
          />

          {values?.DataTypeId &&
          lookupDataTypeName[values.DataTypeId].Name === 'OptionSet' ? (
            <FFAutocomplete
              id="OptionSetId"
              name="OptionSetId"
              Field={{
                FieldValue: 'OptionSetId',
                FieldLabel: 'Option Set',
                Datasource: OptionsetDatasource,
                ValueField: 'Id',
                TextField: 'Name',
              }}
              value={values.OptionSetId}
              onChangeHandler={dropdownhandleInputChanged}
            />
          ) : null}

          {values.DataTypeId &&
          lookupDataTypeName[values.DataTypeId].Name === 'Lookup' ? (
            <>
              <FFAutocomplete
                id="LookupId"
                name="LookupId"
                Field={{
                  FieldValue: 'LookupId',
                  FieldLabel: 'Related Entity',
                  Datasource: LookupData,
                  ValueField: 'Id',
                  TextField: 'Name',
                }}
                value={values.LookupId}
                onChangeHandler={dropdownhandleInputChanged}
              />
              <FFAutocomplete
                id="LookupTextField"
                name="LookupTextField"
                Field={{
                  FieldValue: 'LookupTextField',
                  FieldLabel: 'Related Entity Display Value',
                  Datasource: lookupFields,
                  ValueField: 'Id',
                  TextField: 'Name',
                }}
                value={values.LookupTextField}
                onChangeHandler={dropdownhandleInputChanged}
              />

              <div className="calculated-field">
                <div className="calculated-field">
                  <span className="calculated-field__data_title">
                    Related Entity Filter
                  </span>
                  <div className="calculated-field__data">
                    <ReactJson
                      name={false}
                      iconStyle="square"
                      collapsed={1}
                      enableClipboard={false}
                      displayObjectSize={false}
                      displayDataTypes={false}
                      src={JSON.parse(values?.LookupFilter || '{}')}
                    />
                    <IconButton
                      aria-label="edit"
                      disabled={!showLookupFilterentity}
                      onClick={() => setshowLookupFilterPopup(true)}
                    >
                      <EditIcon fontSize="default" />
                    </IconButton>
                  </div>
                </div>
              </div>

              <div className="Div-Group">
                <div className="Group-header">Related Field</div>
                {cascadingEntityColumnQuery.isFetched && (
                  <FFAutocomplete
                    id="CascadingEntityColumn"
                    name="CascadingEntityColumn"
                    Field={{
                      FieldValue: 'CascadingEntityColumn',
                      FieldLabel: 'Cascading EntityColumn',
                      Datasource: cascadingEntityColumnQuery.data || [],
                      ValueField: 'Id',
                      TextField: 'Name',
                    }}
                    value={values.CascadingEntityColumn}
                    onChangeHandler={dropdownhandleInputChanged}
                  />
                )}
                {cascadingParentEntityFieldQuery.isFetched ? (
                  <FFAutocomplete
                    id="CascadingParentEntityField"
                    name="CascadingParentEntityField"
                    Field={{
                      FieldValue: 'CascadingParentEntityField',
                      FieldLabel: 'Cascading ParentEntityField',
                      DefaultValue: '',
                      Datasource: cascadingParentEntityFieldQuery.data || [],

                      ValueField: 'Id',
                      TextField: 'Name',
                    }}
                    value={values.CascadingParentEntityField}
                    onChangeHandler={dropdownhandleInputChanged}
                  />
                ) : null}
              </div>
            </>
          ) : null}

          <div className="calculated-field">
            <span className="calculated-field__data_title">
              Calculated Field Criteria
            </span>
            <div className="calculated-field__data">
              <ReactJson
                name={false}
                iconStyle="square"
                collapsed={1}
                enableClipboard={false}
                displayObjectSize={false}
                displayDataTypes={false}
                src={JSON.parse(values?.Filters || '{}')}
              />
              <IconButton
                disabled={values.IsRollupField}
                aria-label="edit"
                onClick={() => setShowCalculatedFieldsPopup(true)}
              >
                <EditIcon fontSize="default" />
              </IconButton>
            </div>
          </div>
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={
                  !openAdvanced ? <KeyboardArrowRight /> : <KeyboardArrowUp />
                }
                onClick={resetOpenAdvanced}
              >
                <Typography>Advanced</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div className="collapseControls">
                    <FFTextBox
                      name="ValidationRule"
                      label="Validation Rule"
                      value={values.ValidationRule}
                      onChange={handleInputChanged}
                      className="AddField"
                      // error={errors.Name}
                      Field={{
                        FieldValue: 'ValidationRule',
                        FieldLabel: 'Validation Rule',
                        Validation: { IsRequired: 'False' },
                      }}
                      Screen="AddField"
                    />

                    {values?.DataTypeId &&
                    [
                      'Attachment',
                      'Boolean',
                      'Time',
                      'DateAndTime',
                      'GUID',
                      'Lookup',
                      'URL',
                      'TwoOptions',
                      'Image',
                      'Date',
                      'File',
                    ].indexOf(lookupDataTypeName[values.DataTypeId].Name) <
                      0 ? (
                      <FFTextBox
                        name="MaxLength"
                        label="MaxLength"
                        value={values.MaxLength}
                        onChange={handleInputChanged}
                        className="AddField"
                        Field={{
                          FieldValue: 'MaxLength',
                          FieldLabel: 'MaxLength',
                          Validation: { IsRequired: 'False' },
                        }}
                        Screen="AddField"
                      />
                    ) : null}

                    <div className="divKey FFSwitchbutton">
                      <span className="isKey">Key</span>
                      <SwitchButton
                        name="IsUniqueKey"
                        label="IsUniqueKey"
                        id="IsUniqueKey"
                        value={values.IsUniqueKey}
                        checked={values.IsUniqueKey}
                        onSwitchhandler={onSwitchhandler}
                      />
                    </div>

                    <div className="divHasIsVisibleInUI FFSwitchbutton">
                      <span className="isHasIsVisibleInUI">IsVisibleInUI</span>
                      <SwitchButton
                        name="IsVisibleInUI"
                        label="IsVisibleInUI"
                        id="IsVisibleInUI"
                        value={values.IsVisibleInUI}
                        checked={values.IsVisibleInUI}
                        onSwitchhandler={onSwitchhandler}
                      />
                    </div>

                    {/* <div className="Group-header">Global Search</div> */}
                    <div className="divEnableCaching FFSwitchbutton">
                      <span className="IsGlobalSearch">Searchable</span>
                      <SwitchButton
                        name="IsGlobalSearch"
                        label="IsGlobalSearch"
                        id="IsGlobalSearch"
                        value={values.IsGlobalSearch}
                        checked={values.IsGlobalSearch}
                        onSwitchhandler={onSwitchhandler}
                      />
                    </div>
                    <div className="divEnableCaching FFSwitchbutton">
                      <span className="IsDisplayName">Recommend In Search</span>
                      <SwitchButton
                        name="IsDisplayName"
                        label="IsDisplayName"
                        id="IsDisplayName"
                        value={values.IsDisplayName}
                        checked={values.IsDisplayName}
                        onSwitchhandler={onSwitchhandler}
                      />
                    </div>
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>
            {values?.DataTypeId &&
            (lookupDataTypeName[values.DataTypeId].Name === 'WholeNumber' ||
              lookupDataTypeName[values.DataTypeId].Name === 'DecimalNumber' ||
              lookupDataTypeName[values.DataTypeId].Name === 'AutoNumber') ? (
              <Accordion onChange={onRollupChange} expanded={openRollup}>
                <AccordionSummary
                  expandIcon={
                    openRollup ? <KeyboardArrowUp /> : <KeyboardArrowRight />
                  }
                >
                  <Typography>Rollup</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {(_.isEmpty(values?.Filters) ||
                      values?.Filters === '{}') && (
                      <div className="collapseControls">
                        {/* <div className="Group-header">Rollup Fields</div> */}
                        <div className="divEnableCaching FFSwitchbutton">
                          <span className="IsRollupField">IsRollupField</span>
                          <SwitchButton
                            name="IsRollupField"
                            label="IsRollupField"
                            id="IsRollupField"
                            value={values.IsRollupField}
                            checked={values.IsRollupField}
                            onSwitchhandler={onSwitchhandler}
                          />
                        </div>
                        <div className="divEnableCaching FFSwitchbutton">
                          <span className="ImmediateCalculation">
                            IsImmediateCalculation
                          </span>
                          <SwitchButton
                            name="IsImmediateCalculation"
                            label="IsImmediateCalculation"
                            id="IsImmediateCalculation"
                            value={values.IsImmediateCalculation}
                            checked={values.IsImmediateCalculation}
                            onSwitchhandler={onSwitchhandler}
                          />
                        </div>

                        <div className="Div-Group">
                          <FFAutocomplete
                            id="RelatedEntity"
                            name="RelatedEntity"
                            Field={{
                              FieldValue: 'RelatedEntity',
                              FieldLabel: 'RelatedEntity',
                              Datasource: EntityData,
                              ValueField: 'Name',
                              TextField: 'Name',
                            }}
                            value={values.RelatedEntity}
                            onChangeHandler={dropdownRelatedEntityChanged}
                          />
                          <FFAutocomplete
                            id="RelatedField"
                            name="RelatedField"
                            Field={{
                              FieldValue: 'RelatedField',
                              FieldLabel: 'RelatedField',
                              Datasource: EntityFieldData,
                              ValueField: 'Name',
                              TextField: 'Name',
                            }}
                            value={values.RelatedField}
                            onChangeHandler={dropdownhandleInputChanged}
                          />
                          <FFAutocomplete
                            id="RollupType"
                            name="RollupType"
                            Field={{
                              FieldValue: 'RollupType',
                              FieldLabel: 'RollupType',
                              Datasource: Activitylistitem.dataSource,
                              ValueField: 'Name',
                              TextField: 'Name',
                            }}
                            value={values.RollupType}
                            onChangeHandler={dropdownhandleInputChanged}
                          />
                          <FFAutocomplete
                            id="RollupField"
                            name="RollupField"
                            Field={{
                              FieldValue: 'RollupField',
                              FieldLabel: 'RollupField',
                              Datasource: EntityNumberFieldData,
                              ValueField: 'Name',
                              TextField: 'Name',
                            }}
                            value={values.RollupField}
                            onChangeHandler={dropdownhandleInputChanged}
                          />
                        </div>

                        <div>
                          <FFButton
                            Field={{
                              FieldValue: 'EntityAdd_Btn_SaveField',
                              Variant: 'contained',
                              FieldLabel: 'Add Criteria',
                              Type: 'primary',
                              Disabled: !!_.isEmpty(enittydataval),
                            }}
                            className="EntityAdd_Btn_SaveField"
                            onClickHandler={onCriteriaAdd}
                          />
                        </div>
                      </div>
                    )}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ) : null}
          </div>
        </div>
        <div className="addAddFieldmodal__footer">
          <FFButton
            Field={{
              FieldValue: 'AddField_Btn_SaveField',
              Variant: 'contained',
              FieldLabel: 'Done',
              Type: 'primary',
              Disabled:
                (values && values.Name === undefined) ||
                values.Name.trim() === '' ||
                values.DisplayName === undefined ||
                values.DisplayName.trim() === '' ||
                values.RequiredId === undefined ||
                values.DataTypeId === undefined,
            }}
            className="AddField_Btn_SaveField"
            onClickHandler={SaveFieldHandler}
          />
          <FFButton
            Field={{
              FieldValue: 'AddField_Btn_Close',
              Variant: 'contained',
              FieldLabel: 'Cancel',
              Type: 'secondary',
            }}
            className="AddField_Btn_Close"
            onClickHandler={CancelFieldHandler}
          />
        </div>
      </div>
      <CRUDModal open={showModal} width="80%">
        <CRUDModal.Header>
          <CRUDModal.Title>Add Filter</CRUDModal.Title>
          <CRUDModal.Close onClick={CloseFieldHandler}>
            <CloseIcon />
          </CRUDModal.Close>
        </CRUDModal.Header>
        <CRUDModal.Content>
          <FilterDesigner
            EntityData={enittydataval}
            QueryData={values.Criteria && JSON.parse(values.Criteria)}
            handleClick={onhandleClick}
          />
        </CRUDModal.Content>
      </CRUDModal>
      <CRUDModal open={showCalculatedFieldsPopup} width="90%">
        <CRUDModal.Header>
          <CRUDModal.Title>Edit Calculated fields</CRUDModal.Title>
          <CRUDModal.Close onClick={() => setShowCalculatedFieldsPopup(false)}>
            <CloseIcon />
          </CRUDModal.Close>
        </CRUDModal.Header>
        <CRUDModal.Content>
          <CalculatedFieldsDesigner
            entity={{
              id: queryParams.entityId,
              Name: queryParams.Name,
            }}
            onChange={onCalculatedFieldChangeHandler}
            src={JSON.parse(values?.Filters || '{}')}
          />
        </CRUDModal.Content>
      </CRUDModal>
      <CRUDModal open={showLookupFilterPopup} width="80%">
        <CRUDModal.Header>
          <CRUDModal.Title>Lookup Fields Filters </CRUDModal.Title>
          <CRUDModal.Close onClick={() => setshowLookupFilterPopup(false)}>
            <CloseIcon />
          </CRUDModal.Close>
        </CRUDModal.Header>
        <CRUDModal.Content>
          <FilterDesigner
            EntityData={showLookupFilterentity}
            QueryData={values.LookupFilter && JSON.parse(values.LookupFilter)}
            handleClick={onhandleLookupFilterClick}
          />
        </CRUDModal.Content>
      </CRUDModal>
    </>
  )
}

AddField.propTypes = {
  CancelFieldHandler: PropTypes.func,
  CreateEntityFieldHandler: PropTypes.func,
  OptionsetDatasource: PropTypes.arrayOf(PropTypes.array),
  RequiredDatasource: PropTypes.arrayOf(PropTypes.array),
  DataTypeDatasource: PropTypes.arrayOf(PropTypes.array),
  editData: PropTypes.arrayOf(PropTypes.array),
}

AddField.defaultProps = {
  CancelFieldHandler: () => null,
  CreateEntityFieldHandler: () => null,
  OptionsetDatasource: [],
  RequiredDatasource: [],
  DataTypeDatasource: [],
  editData: [],
}

export default AddField
