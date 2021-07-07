import React from 'react'
import {
  Close,
  KeyboardArrowRight,
  KeyboardArrowUp,
  TrendingUpRounded,
} from '@material-ui/icons'
import PropTypes from 'prop-types'
import { useQuery } from 'react-query'
import _ from 'lodash'
import FFTextBox from '../../../base/FFTextBox/FFTextBox'
import FFButton from '../../../base/FFButton/FFButton'
import SwitchButton from '../../Switch/SwitchButton'
import FFAutocomplete from '../../../base/FFAutocomplete/FFAutocomplete'
import apiEndPoints from '../../../../../models/api/apiEndpoints'
import getAPIData, { getCoreData } from '../../../../../models/api/api'
import './EntityAdd.css'
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import { Alert, AlertTitle } from '@material-ui/lab'
import Collapse from '@material-ui/core/Collapse'

const EntityAdd = ({ CancelEntityHandler, CreateEntityHandler, editData }) => {
  const iniState = {
    Id: '',
    Name: '',
    DisplayName: '',
    DisplayNamePlural: '',
    Required: '',
    Description: '',
    Datatype: 0,
    MaxLength: '',
    ValidationRule: '',
    OptionSet: '',
    HasMultipleAttachments: null,
    IsSupportPayments: null,
    IsSupportActivities: null,
    IsSupportCorrespondences: null,
    IsEnableCaching: null,
    IsGlobalSearch: null,
    TTL: '',
    IconURL: '',
    PartitionKey: '',
    IsSystemEntity: null,
  }

  const [values, setValues] = React.useState(iniState)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
  }

  const handleInputChanged = (e, params) => {
    const re = /^[0-9\b]+$/
    const { name, value } = e?.target ?? params
    if (e?.target && !re.test(e.target?.value) && e.target.name === 'TTL') {
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

  const onSwitchhandler = (event, value) => {
    setValues({
      ...values,
      [event.target.name]: value,
    })
  }

  React.useEffect(() => {
    if (editData) setValues(editData)
  }, [editData])
  const [Showalert, setShowalert] = React.useState(false)
  const ParitionInput = React.useRef(null)
  const onEntityAdd = (event) => {
    const currentEvent = event
    // currentEvent.target.disabled = true
    const id = editData.Id
    const name = values.Name
    const displayname = values.DisplayName
    const displayNamePlural = values.DisplayNamePlural
    const description = values.Description
    let hasMultipleAttachments = values.HasMultipleAttachments
    let isSupportPayments = values.IsSupportPayments
    let isSupportActivities = values.IsSupportActivities
    let isSupportCorrespondences = values.IsSupportCorrespondences
    let isenableCaching = values.IsEnableCaching
    let globalsearch = values.IsGlobalSearch
    const tTL = values.TTL
    const iconURL = values.IconURL === 'Select' ? null : values.IconURL || ''
    const partitionKey = values.PartitionKey || ''
    const isSystemEntity = values.IsSystemEntity || false

    if (
      displayname == '' ||
      displayname == undefined ||
      displayNamePlural == '' ||
      displayNamePlural == undefined ||
      name == undefined ||
      name == '' ||
      partitionKey == undefined ||
      partitionKey == ''
    ) {
      setShowalert(true)
      if (partitionKey == undefined || partitionKey == '') {
        setOpenDatastore(true)
        ParitionInput.current.focus()
      }
      return false
    }
    if (hasMultipleAttachments === undefined) {
      hasMultipleAttachments = false
    } else {
      hasMultipleAttachments = values.HasMultipleAttachments
    }
    if (isSupportPayments === undefined) {
      isSupportPayments = false
    } else {
      isSupportPayments = values.IsSupportPayments
    }

    if (isSupportActivities === undefined) {
      isSupportActivities = false
    } else {
      isSupportActivities = values.IsSupportActivities
    }

    if (isSupportCorrespondences === undefined) {
      isSupportCorrespondences = false
    } else {
      isSupportCorrespondences = values.IsSupportCorrespondences
    }

    if (isenableCaching === undefined) {
      isenableCaching = false
    } else {
      isenableCaching = values.IsEnableCaching
    }
    if (globalsearch === undefined) {
      globalsearch = false
    } else {
      globalsearch = values.IsGlobalSearch
    }

    CreateEntityHandler(
      currentEvent,
      id,
      name,
      displayname,
      displayNamePlural,
      description,
      hasMultipleAttachments,
      isSupportPayments,
      isSupportActivities,
      isSupportCorrespondences,
      isenableCaching,
      globalsearch,
      tTL,
      iconURL,
      partitionKey,
      isSystemEntity
    )
  }

  const appResourceData = useQuery({
    queryKey: ['appResource', { type: 'appResourceData' }],
    queryFn: () =>
      getCoreData(
        apiEndPoints.AppResource.method,
        `${apiEndPoints.AppResource.url}?$filter=AppResourceType eq 'SVG'`
      ).then((response) => {
        const { data } = response
        data.unshift({
          Name: 'Select',
          id: 'Select',
        })
        return response.data
      }),
    refetchOnReconnect: false,
  })

  const appResourceEntityData = useQuery({
    queryKey: ['appResourceEntityData', { type: 'appResourceEntityData' }],
    queryFn: () =>
      getAPIData(
        apiEndPoints.GetEntity.method,
        `${apiEndPoints.GetEntity.url}?$filter=Name eq 'AppResource'&$expand=entityField`
      ).then((response) => {
        return response?.data
      }),
    refetchOnReconnect: false,
  })

  const IconDisplayfield =
    appResourceEntityData &&
    appResourceEntityData?.data?.value[0]?.EntityField.find(
      (item) => item.IsDisplayName === true
    )?.DisplayName

  const dropdownhandleInputChanged = (event, params) => {
    const { name, value } = params
    setValues({
      ...values,
      [name]: value,
    })
  }
  const [openAdvanced, setOpenAdvanced] = React.useState(false)
  const [Openmoreinfor, setOpenmoreinfor] = React.useState(false)
  const [OpenDatastore, setOpenDatastore] = React.useState(false)
  const resetOpenAdvanced = () => {
    setOpenAdvanced(!openAdvanced)
  }
  const resetOpenmoreinfor = () => {
    setOpenmoreinfor(!Openmoreinfor)
  }
  const resetOpenDatastore = () => {
    setOpenDatastore(!OpenDatastore)
  }
  return (
    <>
      <div className="addentitymodal">
        <div className="addentitymodal__header">
          <span className="header-title">
            {values && values.Id === undefined ? 'New Entity' : 'Edit Entity'}
          </span>
          <span className="header-close">
            <Close onClick={CancelEntityHandler} />
          </span>
        </div>

        <div className="addentitymodal__content">
          <div>
            {Showalert &&
            (values.DisplayName == '' || values.DisplayName == undefined) ? (
              <Collapse in={true}>
                <Alert severity="error" in={true}>
                  Please enter the mandatory field.
                </Alert>
              </Collapse>
            ) : null}

            <FFTextBox
              name="DisplayName"
              label="Display Name"
              value={values.DisplayName}
              onChange={handleInputChange}
              className="EntityAdd"
              Field={{
                FieldValue: 'DisplayName',
                FieldLabel: 'Display Name',
                Validation: { IsRequired: true },
              }}
              required={true}
              Screen="EntityAdd"
            />
          </div>
          <div>
            {Showalert &&
            (values.DisplayNamePlural == '' ||
              values.DisplayNamePlural == undefined) ? (
              <Collapse in={true}>
                <Alert severity="error" in={true}>
                  Please enter the mandatory field
                </Alert>
              </Collapse>
            ) : null}

            <FFTextBox
              name="DisplayNamePlural"
              label="Display Name Plural"
              value={values.DisplayNamePlural}
              onChange={handleInputChange}
              className="EntityAdd"
              Field={{
                FieldValue: 'DisplayNamePlural',
                FieldLabel: 'DisplayNamePlural',
                Validation: { IsRequired: 'False' },
              }}
              required={true}
              Screen="EntityAdd"
            />
          </div>
          <div>
            {Showalert && (values.Name == '' || values.Name == undefined) ? (
              <Collapse in={true}>
                <Alert severity="error" in={true}>
                  Please enter the mandatory field.
                </Alert>
              </Collapse>
            ) : null}
            <FFTextBox
              name="Name"
              label="Name"
              value={values.Name}
              onChange={handleInputChange}
              disabled={!(values && values.Id === undefined)}
              className="EntityAdd"
              Field={{
                FieldValue: 'Name',
                FieldLabel: 'Name',
                Validation: { IsRequired: 'True' },
              }}
              required={true}
              Screen="EntityAdd"
            />
          </div>
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={
                  !Openmoreinfor ? <KeyboardArrowRight /> : <KeyboardArrowUp />
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
                onClick={resetOpenmoreinfor}
              >
                <Typography className={'entityLabel'}>
                  More Information
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div className="collapseControls">
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
                      onChangeHandler={handleInputChange}
                    />
                    {appResourceData.isFetched ? (
                      <FFAutocomplete
                        id="IconURL"
                        name="IconURL"
                        Field={{
                          FieldValue: 'IconURL',
                          FieldLabel: 'IconURL',
                          DefaultValue: '',
                          Datasource: appResourceData?.data ?? [],
                          ValueField: 'FullURL',
                          TextField: IconDisplayfield || 'FullURL',
                        }}
                        value={values.IconURL}
                        onChangeHandler={dropdownhandleInputChanged}
                      />
                    ) : null}
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={
                  !openAdvanced ? <KeyboardArrowRight /> : <KeyboardArrowUp />
                }
                onClick={resetOpenAdvanced}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography className={'entityLabel'}>Advanced</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div className="collapseControls">
                    <div className="FFSwitchbuttonHasMultipleAttachments">
                      <span className="entityLabel">
                        Has Multiple Attachments
                      </span>
                      <SwitchButton
                        name="HasMultipleAttachments"
                        label="HasMultipleAttachments"
                        id="HasMultipleAttachments"
                        value={values.HasMultipleAttachments}
                        checked={values.HasMultipleAttachments}
                        onSwitchhandler={onSwitchhandler}
                      />
                    </div>
                    <div className="FFSwitchbutton">
                      <span className="entityLabel">Supports Payments</span>
                      <SwitchButton
                        name="IsSupportPayments"
                        label="SupportsPayments"
                        id="IsSupportPayments"
                        value={values.IsSupportPayments}
                        checked={values.IsSupportPayments}
                        onSwitchhandler={onSwitchhandler}
                      />
                    </div>
                    <div className="FFSwitchbutton">
                      <span className="entityLabel">Supports Activities</span>
                      <SwitchButton
                        name="IsSupportActivities"
                        label="SupportsActivities"
                        id="IsSupportActivities"
                        value={values.IsSupportActivities}
                        checked={values.IsSupportActivities}
                        onSwitchhandler={onSwitchhandler}
                      />
                    </div>
                    <div className="FFSwitchbutton">
                      <span className="entityLabel">
                        Supports Correspondence
                      </span>
                      <SwitchButton
                        name="IsSupportCorrespondences"
                        label="SupportsCorrespondence"
                        id="IsSupportCorrespondences"
                        value={values.IsSupportCorrespondences}
                        checked={values.IsSupportCorrespondences}
                        onSwitchhandler={onSwitchhandler}
                      />
                    </div>

                    <div className="FFSwitchbutton">
                      <span className="entityLabel">Searchable</span>
                      <SwitchButton
                        name="IsGlobalSearch"
                        label="IsGlobalSearch"
                        id="IsGlobalSearch"
                        value={values.IsGlobalSearch}
                        checked={values.IsGlobalSearch}
                        onSwitchhandler={onSwitchhandler}
                      />
                    </div>
                    <div className="FFSwitchbuttonIsSystemEntity">
                      <span className="entityLabel">SystemEntity</span>
                      <SwitchButton
                        name="IsSystemEntity"
                        label="IsSystemEntity"
                        id="IsSystemEntity"
                        value={values.IsSystemEntity}
                        checked={values.IsSystemEntity}
                        onSwitchhandler={onSwitchhandler}
                        Disabled={
                          values && values.Id === undefined ? false : true
                        }
                      />
                    </div>
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={OpenDatastore} id="panel1d-header">
              <AccordionSummary
                expandIcon={
                  !OpenDatastore ? <KeyboardArrowRight /> : <KeyboardArrowUp />
                }
                onClick={resetOpenDatastore}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography className={'entityLabel'}>Data Storage</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <div className="collapseControls">
                    <div className="FFSwitchbutton">
                      <span className="entityLabel">Enable Caching</span>
                      <SwitchButton
                        name="IsEnableCaching"
                        label="EnableCaching"
                        id="IsEnableCaching"
                        value={values.IsEnableCaching}
                        checked={values.IsEnableCaching}
                        onSwitchhandler={onSwitchhandler}
                      />
                    </div>
                    <FFTextBox
                      name="TTL"
                      label="TTL"
                      value={values.TTL}
                      onChange={handleInputChanged}
                      className="EntityAdd"
                      Field={{
                        FieldValue: 'TTL',
                        FieldLabel: 'TTL',
                        Validation: { IsRequired: 'False' },
                      }}
                      Screen="EntityAdd"
                    />
                    <div>
                      {Showalert &&
                      (values.PartitionKey == '' ||
                        values.PartitionKey == undefined) ? (
                        <Collapse in={true}>
                          <Alert severity="error" in={true}>
                            Please enter the mandatory field.
                          </Alert>
                        </Collapse>
                      ) : null}
                      <FFTextBox
                        name="PartitionKey"
                        label="Partition Key"
                        value={values.PartitionKey}
                        onChange={handleInputChange}
                        className="EntityAdd"
                        disabled={!(values && values.Id === undefined)}
                        Field={{
                          FieldValue: 'PartitionKey',
                          FieldLabel: 'PartitionKey',
                          Validation: { IsRequired: 'True' },
                        }}
                        ref={ParitionInput}
                        required={true}
                        Screen="EntityAdd"
                      />
                    </div>
                  </div>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>

        <div className="addentitymodal__footer">
          <FFButton
            id="EntityAdd_Btn_SaveField"
            className="EntityAdd_Btn_SaveField"
            type="button"
            Field={{
              FieldValue: 'Done',
              FieldLabel: 'Done',
              // Disabled:
              //   (values && values.Name === undefined) ||
              //   values.Name.trim() === '' ||
              //   values.DisplayName === undefined ||
              //   values.DisplayName.trim() === '' ||
              //   values.PartitionKey === undefined ||
              //   values.PartitionKey.trim() === '',
            }}
            onClickHandler={onEntityAdd}
          />
          <FFButton
            Field={{
              FieldValue: 'EntityAdd_Btn_Close',
              Variant: 'contained',
              FieldLabel: 'Cancel',
              Type: 'secondary',
            }}
            className="EntityAdd_Btn_Close"
            onClickHandler={CancelEntityHandler}
          />
        </div>
      </div>
    </>
  )
}
EntityAdd.defaultProps = {
  CancelEntityHandler: null,
  CreateEntityHandler: null,
  editData: [],
}
EntityAdd.propTypes = {
  CancelEntityHandler: PropTypes.func,
  CreateEntityHandler: PropTypes.func,
  editData: PropTypes.instanceOf(Array),
}

export default EntityAdd
