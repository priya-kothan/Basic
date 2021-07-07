import React from 'react'
import { useQueries, useQueryClient } from 'react-query'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import {
  Apps as AppsIcon,
  Reorder as ReorderIcon,
  Add,
  Delete,
  Backup,
  Close as CloseIcon,
  DeleteRounded as DeleteRoundedIcon,
  PictureAsPdfRounded as PictureAsPdfRoundedIcon,
  MovieCreationRounded as MovieCreationRoundedIcon,
  ImageRounded as ImageRoundedIcon,
  DescriptionRounded as DescriptionRoundedIcon,
  InsertDriveFileRounded as InsertDriveFileRoundedIcon,
} from '@material-ui/icons'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'
import { useConfirm } from 'material-ui-confirm'
import _ from 'lodash'
import PropTypes from 'prop-types'
import useAppContext from '../../hooks/useToast'
import useActionFields from '../../hooks/useActionsFields'
import getEntityManagerData, { getCoreData } from '../../../../models/api/api'
import apiEndPoints from '../../../../models/api/apiEndpoints'
import FFTreeView from '../../base/FFTreeView/FFTreeView'
import FileViewer from './FileViewer/FileViewer'
import SysListGrid from '../SysListGrid/SysListGrid'
import useEntityLookups from '../../hooks/useEntityLookups'
import utils from '../../../../utils/utils'
import componentLookup from '../../../../utils/componentLookup'
import CRUDModal from '../CRUDModal/CRUDModal'
import FFButton from '../../base/FFButton/FFButton'
import FFTextBox from '../../base/FFTextBox/FFTextBox'
import FFDropZone from '../../base/FFDropZone/FFDropZone'
import './FileManager.css'

function fileManagerReducer(state, action) {
  switch (action.type) {
    case 'VIEW_TYPE_CHANGE':
      return {
        ...state,
        viewType: action.payload,
      }
    case 'SET_TREE_DATASOURCE':
      return {
        ...state,
        treeDataSource: action.payload,
      }
    case 'SET_SELECTED_TREENODE':
      return {
        ...state,
        ...action.payload,
      }
    case 'SET_CHECKBOXSELECTED_DATA':
      return {
        ...state,
        checkboxselectedData: action.payload,
      }
    case 'SHOW_FILEVIEWPOPUP':
      return {
        ...state,
        showFilterPopup: action.payload.popupVisibility,
        popuptitle: action.payload.popuptitle,
        isFileUpload: action.payload.isFileUpload,
        buttonText: action.payload.buttonText,
      }
    case 'SET_UPLOADFILELIST':
      return {
        ...state,
        UploadFileList: action.payload,
      }
    case 'SET_POPUPONCHANGEDATA':
      return {
        ...state,
        popupOnchangeData: action.payload,
      }
    case 'SHOW_DIALOGPOPUP':
      return {
        ...state,
        showDialogPopup: action.payload,
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}
const FileManager = ({
  entityName,
  idField,
  parentIDField,
  folderField,
  folderFieldValue,
}) => {
  const queryClient = useQueryClient()
  const initialState = {
    viewType: 'ListViewOnly',
    treeDataSource: [],
    selectedTreeNode: null,
    checkboxselectedData: [],
    childrens: [],
    showFilterPopup: false,
    popuptitle: '',
    isFileUpload: false,
    UploadFileList: [],
    AttachmentTypeList: {
      AttachmentType: 'All',
      FileCount: '3',
      FileSize: '5mb',
      Format: '.pdf,.jpg,.jpeg,.png,.svg,.doc,.docx,.xls,.xlsx,.csv',
      FileBytes: 5242880,
    },
    popupOnchangeData: {},
    showDialogPopup: false,
  }
  const [state, dispatch] = React.useReducer(fileManagerReducer, initialState)
  const { setActionFields } = useActionFields()
  const { showToastMessage, showLoading } = useAppContext()
  const confirmalert = useConfirm()
  const entityLookups = useEntityLookups(entityName, {
    includeBaseEntityId: true,
  })

  const [appResourceData, entityListViews, entityMetadata] = useQueries([
    {
      queryKey: ['fileManager', 'appResourceData'],
      queryFn: () =>
        getCoreData(
          apiEndPoints.AppResource.method,
          `${apiEndPoints.AppResource.url}?$expand=${entityLookups.lookupEntityFieldNames}`
        ).then((response) => response.data),
      enabled: !!entityLookups && !!entityLookups.lookupEntityFieldNames,
      placeholderData: [],
    },
    {
      queryKey: ['fileManager', 'entityListViews'],
      queryFn: () =>
        getCoreData(
          apiEndPoints.GetSysList.method,
          `${apiEndPoints.GetSysList.url}?$filter=SysEntity eq '${entityName}'`
        ).then((response) => response.data[0]),
      onSuccess: (responseData) => {
        if (responseData.DisplayMode !== 'EnableLargeIconView')
          dispatch({
            type: 'VIEW_TYPE_CHANGE',
            payload: responseData.DisplayMode,
          })
      },
      placeholderData: [],
    },
    {
      queryKey: ['fileManager', 'entityMetadata'],
      queryFn: () =>
        getEntityManagerData(
          apiEndPoints.GetEntity.method,
          `${apiEndPoints.GetEntity.url}?$filter=Name eq '${entityName}'&$expand=EntityField($expand=entityfielddatatype,optionset($expand=optionsetoptions))`
        ).then((response) => response.data.value[0]),
    },
  ])

  const actionFields = [
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Icon: Add,
        Label: 'New',
        CSSName: '',
        onClick: () => onPopupViewHandler('Add Folder', false, 'AddFolder'),
      },
    },
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Icon: Backup,
        Label: 'Upload',
        CSSName: '',
        onClick: () => onPopupViewHandler('File Upload', true, 'UploadFile'),
      },
    },
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Icon: Delete,
        Label: 'Delete',
        CSSName: '',
        onClick: () => OnItemDeleteHandler(),
      },
    },
  ]
  setActionFields({ actionFields })

  function onToggleChangeHandler(event, viewType) {
    if (viewType) dispatch({ type: 'VIEW_TYPE_CHANGE', payload: viewType })
  }
  function onPopupViewHandler(popuptitle, isFileUploads, buttonTexts) {
    dispatch({
      type: 'SHOW_FILEVIEWPOPUP',
      payload: {
        popupVisibility: true,
        popuptitle,
        isFileUpload: isFileUploads,
        buttonText: buttonTexts,
      },
    })
  }

  function onCheckboxSelectItemChangeHandler(data) {
    let checkboxvalue = state.checkboxselectedData
    const flag = checkboxvalue.some((el) => el.id === data.id)
    if (!flag) checkboxvalue.push({ id: data.id })
    else checkboxvalue = checkboxvalue.filter((item) => item.id !== data.id)
    dispatch({ type: 'SET_CHECKBOXSELECTED_DATA', payload: checkboxvalue })
  }

  function getChildrens(parentID) {
    if (appResourceData.isFetching || !appResourceData.data) return []

    if (!parentID) return appResourceData.data

    const childrens = _.filter(appResourceData.data, (data) => {
      if (_.isArray(data[parentIDField]) && !_.isEmpty(data[parentIDField]))
        return data[parentIDField][0].id === parentID

      return false
    })

    // The below code return all the childrens and it's grand childrens
    // const childrens = utils.getAllChildrens(
    //   appResourceData.data,
    //   parentID,
    //   parentIDField,
    //   idField
    // )

    return childrens
  }

  function onTreeItemChangeHandler(e, params) {
    const childrens = getChildrens(params.value)

    dispatch({
      type: 'SET_SELECTED_TREENODE',
      payload: {
        selectedNode: params.value,
        childrens,
      },
    })
  }

  function getTreeDataSource() {
    if (appResourceData.isFetching || !appResourceData.data) return []

    let treeDataSource = _.cloneDeep(appResourceData.data)

    treeDataSource = treeDataSource.filter(
      (data) => data[folderField] === folderFieldValue
    )

    return treeDataSource
  }

  function getLabelKey() {
    if (!entityMetadata.data) return ''

    let labelKey = ''

    labelKey = entityMetadata.data.EntityField.find(
      (entityField) => entityField.IsDisplayName === true
    )

    return labelKey?.Name || 'Name'
  }

  async function onPopupSaveClickHandler() {
    if (!state.isFileUpload && !_.isEmpty(state.popupOnchangeData)) {
      showLoading(true)
      const PostData = {
        Name: state.popupOnchangeData.Name,
        ParentID: (state.selectedNode && state.selectedNode) || '',
        AppResourceType: 'Folder',
      }

      await getCoreData('post', apiEndPoints.AppResource.url, PostData)
        .then((response) => {
          showToastMessage('Folder Created Sucessfully', 'success')
          showLoading(false)
          // window.location.reload()
          state.selectedNode = null
          dispatch({
            type: 'SHOW_FILEVIEWPOPUP',
            payload: {
              popupVisibility: false,
              popuptitle: '',
              isFileUpload: true,
              buttonText: 'Save',
            },
          })
          queryClient.invalidateQueries(['fileManager', `entityListViews`])
          queryClient.invalidateQueries(['fileManager', `appResourceData`])
        })
        .catch((err) => {
          showToastMessage(JSON.stringify(err?.response?.data), 'error')
          showLoading(false)
        })
        .finally(() => {
          showLoading(false)
        })
    } else if (state.isFileUpload) {
      if (state.selectedNode) {
        showLoading(true)
        const files = state.UploadFileList
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
          formData.append(`file[${i}]`, files[i], files[i].name)
        }

        await getCoreData(
          'post',
          `${apiEndPoints.AppResource.url}(${state.selectedNode})`,
          formData,
          {
            'content-type': 'multipart/form-data',
          }
        )
          .then((response) => {
            showToastMessage('FileUploaded Sucessfully', 'success')
            showLoading(false)
            //window.location.reload()
            dispatch({
              type: 'SHOW_FILEVIEWPOPUP',
              payload: {
                popupVisibility: false,
                popuptitle: '',
                isFileUpload: true,
                buttonText: 'Save',
              },
            })
            queryClient.invalidateQueries(['fileManager', `entityListViews`])
          })
          .catch((err) => {
            showToastMessage(JSON.stringify(err?.response?.data), 'error')
            showLoading(false)
          })
      } else {
        showToastMessage('Select Folder to Upload files.', 'error')
      }
    }
  }

  async function OnItemDeleteHandler() {
    dispatch({ type: 'SHOW_DIALOGPOPUP', payload: true })
  }

  function deleteItem(index) {
    const fileList = state.UploadFileList.filter((_, i) => i !== index)
    dispatch({
      type: 'SET_UPLOADFILELIST',
      payload: fileList,
    })
  }
  function getimagesrc(filename) {
    const extension = filename.name.split('.').pop().toLowerCase()
    if (extension === 'jpg' || extension === 'png' || extension === 'jpeg') {
      return <ImageRoundedIcon />
    }
    if (extension === 'mp4') {
      return <MovieCreationRoundedIcon />
    }
    if (extension === 'pdf') {
      return <PictureAsPdfRoundedIcon />
    }
    if (extension === 'doc' || extension === 'docx') {
      return <DescriptionRoundedIcon />
    }
    return <InsertDriveFileRoundedIcon />
  }
  async function deleteItemfile(event, type) {
    if (!_.isEmpty(state.selectedNode) && type === 'Folder') {
      showLoading(true)
      await getCoreData(
        'delete',
        `${apiEndPoints.AppResource.url}(${state.selectedNode})`
      )
        .then((response) => {
          showToastMessage('Deleted Sucessfully', 'success')
          showLoading(false)
          //window.location.reload()
          state.selectedNode = null
          dispatch({ type: 'SHOW_DIALOGPOPUP', payload: false })
          queryClient.invalidateQueries(['fileManager', `appResourceData`])
          queryClient.invalidateQueries(['fileManager', `entityListViews`])
        })
        .catch((err) => {
          showToastMessage(JSON.stringify(err?.response?.data), 'error')
          showLoading(false)
        })
        .finally(() => {
          showLoading(false)
        })
    } else if (state.checkboxselectedData.length !== 0 && type === 'File') {
      const deleteresponedata = []
      const deleteresponeflag = []
      for (let i = 0; i <= state.checkboxselectedData.length - 1; i++) {
        const filesdata = _.isEmpty(state.childrens)
          ? appResourceData.data || []
          : state.childrens
        const deletefiledata =
          filesdata.length !== 0 &&
          filesdata.find((item) => item.id === state.checkboxselectedData[i].id)
        showLoading(true)
        await getCoreData(
          'delete',
          `${apiEndPoints.AppResource.url}(${state.checkboxselectedData[i].id})`
        )
          .then((response) => {
            deleteresponeflag.push('success')
            deleteresponedata.push(
              ` File - ${deletefiledata?.Filename || ''} - Deleted Sucessfully`
            )
            //  showToastMessage('Deleted Sucessfully', 'success')
            // showLoading(false)
            // window.location.reload()
          })
          .catch((err) => {
            deleteresponeflag.push('error')
            // showToastMessage(JSON.stringify(err?.response?.data), 'error')
            deleteresponedata.push(
              ` File - ${deletefiledata?.Filename || ''} - ${JSON.stringify(
                err?.response?.data
              )}`
            )
            // showLoading(false)
          })
          .finally(() => {
            showLoading(false)
          })
      }
      const toastmessage =
        deleteresponeflag.length !== 0 &&
        deleteresponeflag.find((item) => item === 'error')
      if (toastmessage) {
        showToastMessage(deleteresponedata, 'error')
        dispatch({ type: 'SHOW_DIALOGPOPUP', payload: false })
        queryClient.invalidateQueries(['fileManager', `entityListViews`])
        //window.location.reload()
      } else {
        showToastMessage(deleteresponedata, 'success')
        //window.location.reload()
        dispatch({ type: 'SHOW_DIALOGPOPUP', payload: false })
        queryClient.invalidateQueries(['fileManager', `entityListViews`])
      }
    } else {
      showToastMessage('Select anyone item.', 'error')
    }
  }

  function onDialogCloseChangeHandler(event) {
    dispatch({ type: 'SHOW_DIALOGPOPUP', payload: false })
  }
  async function griddelete(data) {
    showLoading(true)
    await getCoreData('delete', `${apiEndPoints.AppResource.url}(${data.id})`)
      .then((response) => {
        showToastMessage('Deleted Sucessfully', 'success')
        showLoading(false)
        window.location.reload()
      })
      .catch((err) => {
        showToastMessage(JSON.stringify(err?.response?.data), 'error')
        showLoading(false)
      })
      .finally(() => {
        showLoading(false)
      })
  }
  const handleChange = (files) => {
    // const totallength = files.length + state.UploadFileList.length
    // setfiles(files)
    // const size = state.AttachmentTypeList.FileBytes
    const err = ''
    for (let i = 0; i < files.length; i++) {
      // if (files[i].size > size) {
      //   err += `${files[i].type}is too large, please pick a smaller file\n`
      // } else {
      const file = files[i]
      const fileList = state.UploadFileList
      fileList.push(file)
      dispatch({
        type: 'SET_UPLOADFILELIST',
        payload: fileList,
      })
      // }
    }

    if (err !== '') {
      alert(err)
    }
  }

  const handleInputChange = (event, params) => {
    const data = { ...state.popupOnchangeData, [params.id]: params.value }
    dispatch({
      type: 'SET_POPUPONCHANGEDATA',
      payload: data,
    })
  }

  const onDelete = (e) => {
    confirmalert({
      description: 'Are you sure to remove file?',
    }).then(() => griddelete(e))
  }

  const onGridCheckboxSelectionChanged = (event) => {
    const selectedNodedata = event.api.getSelectedNodes()
    const selectdata = []
    if (selectedNodedata.length !== 0) {
      selectedNodedata.forEach((item) => {
        selectdata.push({ id: item.id })
      })
    }
    dispatch({ type: 'SET_CHECKBOXSELECTED_DATA', payload: selectdata })
  }

  return (
    <div className="file-manager">
      <div className="file-manager__foldertree">
        {appResourceData.isFetching || entityMetadata.isFetching ? (
          'Loading'
        ) : (
          <FFTreeView
            id="file-manager-treeview"
            src={getTreeDataSource()}
            // dataSourceURL="api/AppResource?$filter=AppResourceType eq 'Folder'"
            uniqueIDKey={idField}
            parentIDKey={parentIDField}
            labelKey={getLabelKey()}
            onChangeHandler={onTreeItemChangeHandler}
          />
        )}
      </div>
      <div className="file-manager__viewicons">
        <ToggleButtonGroup
          size="small"
          value={state.viewType}
          exclusive
          onChange={onToggleChangeHandler}
        >
          <ToggleButton
            value="ListViewOnly"
            disabled={entityListViews.data?.DisplayMode === 'LargeIconViewOnly'}
          >
            <ReorderIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="LargeIconViewOnly"
            disabled={entityListViews.data?.DisplayMode === 'ListViewOnly'}
          >
            <AppsIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="file-manager__listview">
        {entityListViews.isFetching ? (
          'Loading'
        ) : (
          <SysListGrid
            className={state.viewType === 'ListViewOnly' ? '' : 'dispnone'}
            sysListId={entityListViews.data.id}
            sysParentEntityId={null}
            filterQuery={`${folderField} ne '${folderFieldValue}'`}
            useExternalFilters={
              state.selectedNode
                ? { [parentIDField]: [{ id: state.selectedNode }] }
                : null
            }
            onDelete={onDelete}
            isFileManagerDelete
            gridSelectmode="multiple"
            onSelectionChanged={onGridCheckboxSelectionChanged}
          />
        )}
        <FileViewer
          className={state.viewType === 'LargeIconViewOnly' ? '' : 'dispnone'}
          viewDetails={entityListViews.data}
          useCustomData={state.childrens}
          entityDetails={entityMetadata}
          onCheckboxSelectItemChangeHandler={onCheckboxSelectItemChangeHandler}
          checkboxdata={state.checkboxselectedData}
        />
      </div>

      <CRUDModal open={state.showFilterPopup} width="30%">
        <CRUDModal.Header>
          <CRUDModal.Title>{state.popuptitle}</CRUDModal.Title>
          <CRUDModal.Close
            onClick={() =>
              dispatch({
                type: 'SHOW_FILEVIEWPOPUP',
                payload: {
                  popupVisibility: false,
                  popuptitle: '',
                  isFileUpload: true,
                  buttonText: 'Save',
                },
              })
            }
          >
            <CloseIcon />
          </CRUDModal.Close>
        </CRUDModal.Header>
        <CRUDModal.Content>
          {!state.isFileUpload && (
            <div className="fileview_folder__content">
              <FFTextBox
                name="Name"
                label="FolderName"
                value={state.popupOnchangeData.Name || ''}
                onChangeHandler={(event, params) =>
                  handleInputChange(event, params)
                }
                className="fileview_folder"
                Field={{
                  FieldValue: 'Name',
                  FieldLabel: 'FolderName',
                }}
                variant="outlined"
              />
            </div>
          )}
          {state.isFileUpload && (
            <div className="pinnedmodal-controls-sub-File">
              {/* <FFAutocomplete
                id="AppResourceType"
                name="AppResourceType"
                Field={{
                  FieldValue: 'AppResourceType',
                  FieldLabel: 'AppResourceType',
                  DefaultValue: '',
                  Datasource:
                    entityMetadata.data?.EntityField.find(
                      (item) => item.Name === 'AppResourceType'
                    ).OptionSet?.OptionSetOptions || [],
                  ValueField: 'Name',
                  TextField: 'Name',
                }}
                value={state.popupOnchangeData.AppResourceType || ''}
                onChangeHandler={(event, params) =>
                  handleInputChange(event, params)
                }
              /> */}

              <div>File Upload</div>
              <FFDropZone
                text="FullURL"
                color="black"
                variants="outlined"
                Field={{
                  FieldValue: 'FullURL',
                  FieldLabel: 'FullURL',
                  Validation: { IsRequired: 'False' },
                }}
                acceptfile={state.AttachmentTypeList.Format}
                onChange={(files) => {
                  handleChange(files)
                }}
                CSSClass="pinnedmodal-controls-sub-2 TextFiled-Attachement-Description"
                className="pinnedmodal-controls-sub-2"
              />
              {state.UploadFileList && (
                <div className="fileupload-container">
                  {state.UploadFileList.map((item, key) => (
                    <div className="fileupload-view">
                      <div className="fileupload-view-first">
                        {' '}
                        {getimagesrc(item)}
                      </div>
                      <div className="fileupload-view-middle"> {item.name}</div>
                      <div className="fileupload-view-last">
                        <DeleteRoundedIcon
                          id={`image${key}`}
                          onClick={deleteItem.bind(this, key)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CRUDModal.Content>

        <CRUDModal.Footer>
          {' '}
          <div className="footer_fileviewer">
            <FFButton
              variant="contained"
              Field={{
                FieldValue: 'Save',
                FieldLabel: state.buttonText,
                CSSClass: 'savebutton',
                Type: 'primary',
              }}
              disableRipple
              disableElevation
              className="PopupFileView_Btn_Save"
              onClickHandler={onPopupSaveClickHandler}
            />
            <FFButton
              Field={{
                FieldValue: 'Cancel',
                FieldLabel: `Cancel`,
                CSSClass: 'Cancelbutton',
                Type: 'secondary',
              }}
              CSSClass="Cancel"
              variant="contained"
              id="PopupFileViewer_Btn_Close"
              className="PopupFileViewer_Btn_Close"
              onClickHandler={() =>
                dispatch({
                  type: 'SHOW_FILEVIEWPOPUP',
                  payload: {
                    popupVisibility: false,
                    popuptitle: '',
                    isFileUpload: true,
                    buttonText: 'Save',
                  },
                })
              }
            />{' '}
          </div>
        </CRUDModal.Footer>
      </CRUDModal>

      <Dialog
        open={state.showDialogPopup}
        onClose={(event) => onDialogCloseChangeHandler(event)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure to remove?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please Select Which one you have to remove.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => deleteItemfile(event, 'Folder')}
            color="primary"
          >
            Folder
          </Button>
          <Button
            onClick={(event) => deleteItemfile(event, 'File')}
            color="primary"
          >
            File
          </Button>
          <Button
            className="cancelbtn"
            onClick={(event) => onDialogCloseChangeHandler(event)}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

FileManager.propTypes = {
  entityName: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  parentIDField: PropTypes.string.isRequired,
  folderField: PropTypes.string.isRequired,
  folderFieldValue: PropTypes.string.isRequired,
}

export default FileManager
