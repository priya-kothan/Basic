import React from 'react'
import { Grid } from '@material-ui/core'
import { isValid, format, parse, parseISO } from 'date-fns'
import {
  useQueries,
  useMutation,
  useIsFetching,
  useQueryClient,
} from 'react-query'
import { arrayOf } from 'prop-types'

import FFTextBox from '../../base/FFTextBox/FFTextBox'
import componentLookUp from '../../../../utils/componentLookup'
import getAPIData, { getCoreData } from '../../../../models/api/api'
import APIEndPoints from '../../../../models/api/apiEndpoints'
import useAppContext from '../../hooks/useToast'
import FFDatepicker from '../../base/FFDatePicker/FFDatePicker'
import MultiLineText from '../../base/FFMultilineTextbox/FFMultilineTextbox'
import FFSelect from '../../base/FFSelect/FFSelect'
import FFDropdown from '../../base/FFDropdown/FFDropdown'
import FFButton from '../../base/FFButton/FFButton'
import FFAutocomplete from '../../base/FFAutocomplete/FFAutocomplete'

const ActivityManagement = ({
  selectedtab,
  datatypeval,
  tablistid,
  datasource,
  Attachmentdata,
  sysParentEntityId,
  sysParentEntityType,
}) => {
  const componentList = componentLookUp
  // const datasourceval = datasource
  // const [datavalues1, setdatavall] = React.useState(tablistid)

  // const datatypeval11 = datatypeval

  const itemName = String(selectedtab)
  const selectedtabtypeid = tablistid.find(
    (item) => Object.values(item)[2] === String(selectedtab)
  )
  const tabname =
    selectedtabtypeid === undefined ? 'Attachment' : selectedtabtypeid
  let DynamicComponent = null
  const filenames = ''
  const [values, setValues] = React.useState(null)
  const [images, setimage] = React.useState([])
  const [selectedAttachmenttype, setSelectedAttachmenttype] = React.useState(
    'image/*'
  )
  const { showToastMessage, showLoading } = useAppContext()
  const { organisationId } = useAppContext()
  const queryClient = useQueryClient()

  const onChangeHandler = (event, params) => {
    let name
    let value
    if (event) {
      name = event.target ? event.target.name || params.id : event
      if (event == 'DueDate') {
        value = format(new Date(params), 'yyyy-dd-MM HH:mm:ss')
      } else
        value = event.target
          ? event.target.value == 0
            ? params.value
            : event.target.value
          : params
      if (event?.currentTarget?.innerText === 'Image') {
        setSelectedAttachmenttype('image/*')
      } else if (event?.currentTarget?.innerText === 'Document') {
        setSelectedAttachmenttype('.doc,.docx')
      } else if (event?.currentTarget?.innerText === 'Video') {
        setSelectedAttachmenttype('video/*')
      } else {
        value = params.value
      }
    } else {
      name = params.id
      value = params.value
      // format(new Date(params.value), 'dd/MM/yyyy')
    }

    setValues((Prev) => {
      return {
        ...Prev,
        [name]:
          name === 'CallTimestamp'
            ? isNaN(parseInt(value))
              ? ''
              : parseInt(value)
            : name === 'EmailTimestamp'
            ? isNaN(parseInt(value))
              ? ''
              : parseInt(value)
            : name === 'TaskTimestamp'
            ? isNaN(parseInt(value))
              ? ''
              : parseInt(value)
            : value,
      }
    })
  }

  // const ImageFormat = () => {
  function uploadFile(event) {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onloadend = function () {
      const byteArray = []
      const data = reader.result.split(',')[1]
      const binaryBlob = atob(data)
      const rawLength = binaryBlob.length
      const array = new Uint8Array(new ArrayBuffer(rawLength))
      for (let i = 0; i < rawLength; i++) {
        array[i] = binaryBlob.charCodeAt(i)
      }
      byteArray.push(array)
      setimage([file, Array.from(array)])
    }
    reader.readAsDataURL(file)
  }

  const mutateActivity = useMutation(
    (mutationData) => {
      return getCoreData(
        'post',
        APIEndPoints.PostActivity.url,
        mutationData.requestBody
      ).then((response) => response.data)
    },
    {
      onMutate: () => showLoading(true),
      onSuccess: () => {
        showToastMessage('Activity Added Sucessfully', 'success')
        setValues('')
      },
      onError: (err) => {
        showToastMessage(JSON.stringify(err?.response?.data), 'error')
      },
      onSettled: () => {
        showLoading(false)
        queryClient.invalidateQueries('activity')
      },
    }
  )

  const mutateAttachment = useMutation(
    (mutationData) => {
      return getCoreData(
        APIEndPoints.PostAttachment.method,
        APIEndPoints.PostAttachment.url,
        mutationData.requestBody
      ).then((response) => response.data)
    },
    {
      onMutate: () => showLoading(true),
      onSuccess: () => {
        showToastMessage('Attachment Added Sucessfully', 'success')
        setValues('')
        setimage('')
      },
      onError: (err) => {
        showToastMessage(JSON.stringify(err?.response?.data), 'error')
      },
      onSettled: () => {
        showLoading(false)
        queryClient.invalidateQueries('activity')
      },
    }
  )

  const SaveFieldHandler = async (event) => {
    showLoading(true)
    if (tabname !== 'Attachment') {
      const itemName = String(selectedtab)
      const selectedtabtypeid = tablistid.find(
        (item) => Object.values(item)[2] === String(selectedtab)
      )
      const Tabtypeval = selectedtabtypeid.datatypeid
      const ActivityType = Tabtypeval
      const defaultval = {
        ActivityType,
        sysParentEntityType,
        sysParentEntityID: sysParentEntityId,
      }
      const dataSource = {
        ...values,
        ...defaultval,
        ...(organisationId.organisation != '*' && organisationId),
      }

      mutateActivity.mutate({
        requestBody: dataSource,
      })

      // * Refactored to react-query
      // getCoreData('post', APIEndPoints.PostActivity.url, ActivityPostData)
      //   .then((createdEntityField) => {
      //     if (createdEntityField.statusText === 'OK') {
      //       showToastMessage('Activity Added Sucessfully', 'success')
      //       setValues('')
      //     } else {
      //       showToastMessage('Insert-Failed', 'error')
      //     }

      //     setValues('')
      //     showLoading(false)
      //     location.reload()
      //   })
      //   .catch((err) => {
      //     showToastMessage(JSON.stringify(err?.response?.data), 'error')
      //     showLoading(false)
      //   })
      //   .finally(() => {
      //     showLoading(false)
      //   })
    } else if (images.length !== 0) {
      const finaledata = {
        sysParentEntityType,
        sysParentEntityID: sysParentEntityId,
        OriginalFileType: images[0].type,
        OriginalFileName: images[0].name,
        Bytes: images[1],
      }

      const margedata = {
        ...values,
        ...finaledata,
        ...(organisationId.organisation != '*' && organisationId),
      }

      mutateAttachment.mutate({
        requestBody: margedata,
      })

      // getCoreData(
      //   APIEndPoints.PostAttachment.method,
      //   APIEndPoints.PostAttachment.url,
      //   ActivityPostData1
      // )
      //   .then((createdEntityField) => {
      //     if (createdEntityField.statusText === 'OK') {
      //       showToastMessage('Attachment Added Sucessfully', 'success')
      //       setValues('')
      //       setimage('')
      //     } else {
      //       showToastMessage('Insert-Failed', 'error')
      //     }
      //     showLoading(false)
      //     location.reload()
      //   })
      //   .catch((err) => {
      //     showToastMessage(JSON.stringify(err?.response?.data), 'error')
      //     showLoading(false)
      //   })
      //   .finally(() => {
      //     showLoading(false)
      //   })
    } else {
      showToastMessage("Empty Attachment can't be inserted", 'error')
      showLoading(false)
    }
  }

  if (!datasource) return null

  return (
    <Grid container className="Activityitem-container">
      {datasource &&
        datasource.map((item, index) => {
          if (componentList[item.Fielddatatypeid]) {
            DynamicComponent = React.lazy(() =>
              import(`../../${componentList[item.Fielddatatypeid]}`)
            )
            return (
              <Grid item className={`Grid-Activity ${item.Name}`}>
                {item.Fielddatatypeid &&
                  (item.Fielddatatypeid === 'TextBox' ||
                    item.Fielddatatypeid === 'Phone' ||
                    item.Fielddatatypeid === 'eMail' ||
                    item.Fielddatatypeid === 'Text' ||
                    item.Fielddatatypeid === 'WholeNumber' ||
                    item.Fielddatatypeid === 'Duration') && (
                    <FFTextBox
                      name={item.Name}
                      label={item.Name}
                      Field={{
                        FieldValue: 'Name',
                        FieldLabel: 'Name',
                      }}
                      // variant="outlined"
                      onChangeHandler={onChangeHandler}
                      value={values && values[item.Name]}
                    />
                  )}
                {item.Fielddatatypeid &&
                  (item.Fielddatatypeid === 'DateAndTime' ||
                    item.Fielddatatypeid === 'Date') && (
                    <FFDatepicker
                      name={item.Name}
                      label={item.Name}
                      CSSClass="AttactementField"
                      Field={{
                        FieldValue: item.Name,
                        FieldLabel: item.Name,
                        DateFormat: 'MM/dd/yyyy',
                        className: 'filterControl',
                      }}
                      // variant=""
                      onChangeHandler={onChangeHandler}
                      value={values && values[item.Name]}
                    />
                  )}
                {item.Fielddatatypeid &&
                  item.Fielddatatypeid === 'MultiLineText' && (
                    <FFTextBox
                      name={item.Name}
                      label={item.Name}
                      Field={{
                        FieldValue: item.Name,
                        FieldLabel: item.Name,
                        IsEnableHelpText: false,
                        // Placeholder: `Description Message here`,
                        Multiline: true,
                        Rows: 3,
                      }}
                      // variant="outlined"
                      Screen="Activity"
                      onChangeHandler={onChangeHandler}
                      value={values && values[item.Name]}
                    />
                  )}

                {(item.Fielddatatypeid && item.Fielddatatypeid === 'Select') ||
                  (item.Fielddatatypeid === 'Lookup' && (
                    <FFAutocomplete
                      Field={{
                        FieldValue: item.Name,
                        DefaultValue: '',
                        FieldLabel: item.Name,
                        DatasourceURL:
                          item.Name === 'IconField'
                            ? `${APIEndPoints.AppResource.url}?$filter=AppResourceType eq 'SVG'`
                            : `/api/user`,
                        TextField:
                          item.Name === 'IconField' ? 'Name' : 'Firstname',
                        ValueField: 'id',
                        className: 'Activity',
                      }}
                      // variant="outlined"
                      value={values && values[item.Name]}
                      onChangeHandler={onChangeHandler}
                    />
                  ))}
                {item.Fielddatatypeid && item.Fielddatatypeid === 'OptionSet' && (
                  <FFDropdown
                    name={item.Name}
                    label={item.Name}
                    // variant="outlined"
                    Field={{
                      FieldValue: item.Name,
                      DefaultValue: '',
                      FieldLabel: item.Name,
                      Datasource: item.OptionSet.OptionSetOptions,
                      TextField: 'Name',
                      ValueField: 'Value',
                      className: '',
                      // Disabled: mode === 'EDIT',
                    }}
                    value={values && values[item.Name]}
                    // onChangeHandler={(event, properties) =>
                    //   dispatch({ type: 'ADD_NEW', entity: properties.value })
                    // }
                    onChangeHandler={onChangeHandler}
                  />
                )}
                {item.Fielddatatypeid && item.Fielddatatypeid === 'DropZone' && (
                  <div>
                    <div className="upload-btn-wrapper">
                      <button className="btn">Upload a file</button>
                      <input
                        accept={selectedAttachmenttype}
                        type="file"
                        name="myfile"
                        onChange={(event) => uploadFile(event)}
                        // onChange={handleUploadClick}
                      />
                      <br />
                      {images &&
                        images.map((item1, index) => {
                          return <div>{item1.name}</div>
                        })}
                    </div>
                  </div>
                )}
              </Grid>
            )
          }
        })}

      <Grid item className="Activitybutton ">
        <FFButton
          Field={{
            FieldValue: 'ActivityField_Btn_SaveField',
            Variant: 'contained',
            FieldLabel:
              tabname === 'Attachment' ? 'Add Attachment' : 'Add Activity',
            Type: 'primary',
          }}
          className="ActivityField_Btn_SaveField"
          onClickHandler={SaveFieldHandler}
        />
      </Grid>
    </Grid>
  )
}
export default React.memo(ActivityManagement)
