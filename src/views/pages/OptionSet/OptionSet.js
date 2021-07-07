/* eslint no-param-reassign: 0 */
import React, { Fragment, useState, useEffect } from 'react'
import { Add } from '@material-ui/icons'
import { useConfirm } from 'material-ui-confirm'
import OptionSetGrid from '../../components/custom/OptionSet/OptionSetGrid'
import useActionFields from '../../components/hooks/useActionsFields'
import componentLookup from '../../../utils/componentLookup'
import useAppContext from '../../components/hooks/useToast'
import usePageTitle from '../../components/hooks/usePageTitle'
import getAPIData from '../../../models/api/api'
import APIEndPoints from '../../../models/api/apiEndpoints'
import AddOptionSet from '../../components/custom/OptionSet/AddOptionSet/AddOptionSet'
import { DatatypeIconData } from '../../../utils/DatatypeIconData'
import './OptionSet.css'

const OptionSet = () => {
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)
  const [ItemForEdit, setItemForEdit] = useState(null)
  const [ChildItemForEdit, setChildItemForEdit] = useState(null)
  const [searchData, setSearchData] = useState(null)
  const [IsRecord, setIsRecord] = useState(false)
  const { setActionFields } = useActionFields()
  const { showToastMessage, showLoading } = useAppContext()
  const [DropdownItems, setDropdownItems] = React.useState([])
  const OptionSetModal = document.getElementById('OptionSetPopup')
  const confirm = useConfirm()
  const { setPageTitle } = usePageTitle()
  setPageTitle('Option Sets')
  function mergeDataTypeObjects(arr1) {
    return arr1.map((item) => {
      const Icon = { Icon: DatatypeIconData(item.Id) }
      return { ...item, ...Icon }
    })
  }

  function mergeArrayObjects(arr1) {
    return arr1.map((item) => {
      const obj = {
        Id: item.Id,
        Name: item.Name,
        DisplayName: item.DisplayName,
        Description: item.Description,
        DataTypeId: item.DataTypeId,
      }
      if (
        item.EntityFieldDataType &&
        item.DataTypeId === item.EntityFieldDataType.Id
      ) {
        obj.DataType = item.EntityFieldDataType.DisplayName
        obj.DataTypeIcon = DatatypeIconData(item.DataTypeId)
      }
      return obj
    })
  }

  useEffect(() => {
    async function fetchdata() {
      showLoading(true)
      const entitygetdata = await getAPIData(
        APIEndPoints.GetOptionSet.method,
        APIEndPoints.GetOptionSet.url,
        APIEndPoints.GetOptionSet.methodname
      )
      setSearchData(mergeArrayObjects(entitygetdata.data.value))
      showLoading(false)
      return entitygetdata.data
    }
    fetchdata()
  }, [IsRecord])

  const OptionSetGridData = {
    columnDefs: [
      {
        cellRenderer: 'FFMoreVertIcon',
        width: 50,
        suppressMenu: false,
        suppressMovable: true,
        sortable: false,
        filter: false,
        resizable: false,
        lockVisible: true,
      },
      {
        headerName: 'Name',
        field: 'Name',
        width: 250,
      },
      {
        headerName: 'Display Name',
        field: 'DisplayName',
        width: 250,
      },
      {
        headerName: 'Display Type',
        field: 'DataType',
        width: 200,
        cellRenderer: 'FFIconText',
        suppressMenu: true,
      },
      {
        headerName: 'Description',
        field: 'Description',
        width: 550,
      },
    ],
    rowData: searchData,
  }
  const createAddOptionSetButtonClick = () => {
    setItemForEdit(null)
    setChildItemForEdit(null)
    setIsCreatePopupOpen(true)
    OptionSetModal.style.display = 'block'
  }
  useEffect(() => {
    showLoading(true)
    if (DropdownItems.length !== 0) {
      const actionFields = [
        {
          actionComponent: componentLookup.ActionButton,
          componentProps: {
            Icon: Add,
            Label: 'New Option Set',
            CSSName: '',
            onClick: createAddOptionSetButtonClick,
          },
        },
      ]
      setActionFields({ actionFields })
    }
    showLoading(false)
  }, [DropdownItems])
  const cancelAddOptionSetHandler = () => {
    setItemForEdit(null)
    setChildItemForEdit(null)
    setIsCreatePopupOpen(false)
    OptionSetModal.style.display = 'none'
  }

  useEffect(() => {
    async function fetchdata() {
      showLoading(true)
      const datatypeList = await getAPIData(
        APIEndPoints.GetEntityFieldDataType.method,
        APIEndPoints.GetEntityFieldDataType.url,
        APIEndPoints.GetEntityFieldDataType.methodname
      )
      const finalDataTypegetdata = mergeDataTypeObjects(datatypeList.data.value)

      setDropdownItems(finalDataTypegetdata)
      showLoading(false)
    }
    fetchdata()
  }, [])

  function OptionSetProperties(obj) {
    const entries = Object.entries(obj)
    return entries.reduce((acc, [key, value]) => {
      acc = { ...acc, [key]: value == 'Select' ? null : value }
      return acc
    }, {})
  }

  const CreateAddOptionSetHandler = async (
    event,
    value,
    OptionSetOptionItems,
    ChildOptionSetOptiondelItems = [],
    resetForm
  ) => {
    showLoading(true)
    const Properties = OptionSetProperties(value)
    let Isvalid = true
    if (Properties.Id === 0 || Properties.Id === undefined) {
      delete Properties.Id
      const InsertOptionSet = await getAPIData(
        APIEndPoints.InsertOptionSet.method,
        APIEndPoints.InsertOptionSet.url,
        Properties,
        APIEndPoints.InsertOptionSet.methodname
      )
      if (InsertOptionSet.statusText === 'OK') {
        if (
          InsertOptionSet.data.Message === 'Insert-Failed- Given Model is Empty'
        ) {
          Isvalid = false
          showToastMessage("Empty Option Set can't be created", 'error')
        } else if (
          InsertOptionSet.data.Message ===
          'Insert-Failed- Cannot Insert Duplicate Name value'
        ) {
          Isvalid = false
          showToastMessage('Option Name Already Exists', 'error')
        }
        if (Isvalid === true) {
          OptionSetOptionItems.forEach(function GetOptionsetId(obj) {
            obj.OptionSetId = InsertOptionSet.data.Data.Id
          })
          const InsertBulkOptionSetOptions = await getAPIData(
            APIEndPoints.InsertBulkOptionSetOptions.method,
            APIEndPoints.InsertBulkOptionSetOptions.url,
            OptionSetOptionItems,
            APIEndPoints.InsertBulkOptionSetOptions.methodname
          )
          if (InsertBulkOptionSetOptions.statusText === 'OK') {
            setIsRecord(!IsRecord)
            setItemForEdit(null)
            setChildItemForEdit(null)
            resetForm()
            setIsCreatePopupOpen(false)
            if (InsertOptionSet.data.Message === 'Inserted Successfully') {
              showToastMessage(
                'New Option Set Inserted Successfully',
                'success'
              )
            }
            OptionSetModal.style.display = 'none'
          }
        }
      }
    } else {
      delete Properties.DataType
      delete Properties.DataTypeIcon

      if (ChildOptionSetOptiondelItems) {
        ChildOptionSetOptiondelItems.forEach(
          async function DeleteOptionSetOptions(obj) {
            await getAPIData(
              APIEndPoints.DeleteOptionSetOptions.method,
              `${APIEndPoints.DeleteOptionSetOptions.url}(${obj.Id})`,
              APIEndPoints.DeleteOptionSetOptions.methodname
            )
          }
        )
      }
      const UpdateOptionSet = await getAPIData(
        APIEndPoints.UpdateOptionSet.method,
        `${APIEndPoints.UpdateOptionSet.url}(${Properties.Id})`,
        Properties,
        APIEndPoints.UpdateOptionSet.methodname
      )

      if (UpdateOptionSet.statusText === 'OK') {
        if (
          UpdateOptionSet.data.Data == null &&
          UpdateOptionSet.data.Message ===
            'Update-Failed- Cannot Update Empty/Null'
        ) {
          Isvalid = false
          showToastMessage("Empty Option Set can't be Updated", 'error')
        } else if (
          UpdateOptionSet.data.Data == null &&
          UpdateOptionSet.data.Message ===
            'Update-Failed- Cannot Update Duplicate Name value'
        ) {
          Isvalid = false
          showToastMessage('Option Name Already Exists', 'error')
        }
        OptionSetOptionItems.forEach(function GetId(obj) {
          obj.OptionSetId = UpdateOptionSet.data.Data.Id
        })
        if (Isvalid === true) {
          const newOptionSetOptionItems = OptionSetOptionItems.filter((obj) => {
            return obj.Id === undefined
          })
          if (newOptionSetOptionItems.length > 0) {
            await getAPIData(
              APIEndPoints.InsertBulkOptionSetOptions.method,
              APIEndPoints.InsertBulkOptionSetOptions.url,
              newOptionSetOptionItems,
              APIEndPoints.InsertBulkOptionSetOptions.methodname
            )
          }
          setIsRecord(!IsRecord)
          setItemForEdit(null)
          setChildItemForEdit(null)
          resetForm()
          setIsCreatePopupOpen(false)
          if (UpdateOptionSet.data.Message === 'Updated Successfully') {
            showToastMessage('Option Set Updated Sucessfully', 'success')
            OptionSetModal.style.display = 'none'
          }
        }
      }
    }
    showLoading(false)
  }

  const GetOptionSetOptions = async (e) => {
    showLoading(true)
    const List = await getAPIData(
      APIEndPoints.GetOptionSetList.method,
      `${
        APIEndPoints.GetOptionSetList.url
      }?$Filter=Name eq '${e.Name.trim()}'&$Expand=OptionSetOptions`,
      APIEndPoints.GetOptionSetList.methodname
    )
    showLoading(false)
    return List.data.value[0].OptionSetOptions
  }

  const onedit = (e) => {
    setItemForEdit(e)
    GetOptionSetOptions(e).then((result) => {
      setChildItemForEdit(result)
      setIsCreatePopupOpen(true)
    })
    const OptionSetModals = document.getElementById('OptionSetPopup')
    OptionSetModals.style.display = 'block'
  }
  const OptionSetOptionsIds = []

  const deleteOptionSet = async (e) => {
    showLoading(true)
    const deleteOptionSetOptionItems = await getAPIData(
      APIEndPoints.DeleteBulkDataOptionSetOptions.method,
      APIEndPoints.DeleteBulkDataOptionSetOptions.url,
      OptionSetOptionsIds,
      APIEndPoints.DeleteBulkDataOptionSetOptions.methodname
    )
    if (deleteOptionSetOptionItems.statusText === 'OK') {
      const DeleteOptionSet = await getAPIData(
        APIEndPoints.DeleteOptionSet.method,
        `${APIEndPoints.DeleteOptionSet.url}(${e.Id})`,
        APIEndPoints.DeleteOptionSet.methodname
      )
      if (DeleteOptionSet.statusText === 'OK') {
        setIsRecord(!IsRecord)
        showToastMessage('Option Set Deleted sucessfully.', 'success')
        window.location.reload()
      }
    }
    showLoading(false)
  }

  const OptionsetDelete = (e) => {
    GetOptionSetOptions(e).then((result) => {
      result.forEach(function resultfunc(obj) {
        OptionSetOptionsIds.push(obj.Id)
      })
      deleteOptionSet(e)
    })
  }

  const onDelete = (e) => {
    confirm({
      description: 'Want to remove Option Set and Options?',
    }).then(() => OptionsetDelete(e))
  }

  return (
    <>
      <div className="optionset">
        <OptionSetGrid
          DataSource={OptionSetGridData}
          onEdit={onedit}
          onDelete={onDelete}
        />
      </div>
      <div id="OptionSetPopup" className="OptionSetPopup">
        {isCreatePopupOpen && (
          <AddOptionSet
            CreateAddOptionSetHandler={CreateAddOptionSetHandler}
            CancelAddOptionSetHandler={cancelAddOptionSetHandler}
            ItemForEdit={ItemForEdit}
            ChildItemForEdit={ChildItemForEdit}
            data={DropdownItems}
          />
        )}
      </div>
    </>
  )
}

export default OptionSet
