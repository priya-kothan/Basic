import React, { useState, useEffect, Fragment, useRef } from 'react'
import { Add } from '@material-ui/icons'
import { useConfirm } from 'material-ui-confirm'
import { useQueryClient } from 'react-query'
import EntitiesGrid from '../../components/custom/Entities/EntitiesGrid'
import useActionFields from '../../components/hooks/useActionsFields'
import componentLookup from '../../../utils/componentLookup'
import APIEndPoints from '../../../models/api/apiEndpoints'
import getAPIData from '../../../models/api/api'
import EntityAdd from '../../components/custom/Entities/EntityAdd/EntityAdd'
import useAppContext from '../../components/hooks/useToast'
import usePageTitle from '../../components/hooks/usePageTitle'
import './Entities.css'

const Entities = () => {
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)
  const [editData, seteditData] = useState([])
  const [searchData, setsearchData] = useState([])
  const { setActionFields } = useActionFields()
  const { showToastMessage, showLoading } = useAppContext()
  const EntityModal = document.getElementById('EntityPopup')
  const confirmalert = useConfirm()
  const { setPageTitle } = usePageTitle()
  const queryClient = useQueryClient()
  const ref = useRef()
  setPageTitle('Entities')
  const createEntityButtonClick = () => {
    seteditData([])
    setIsCreatePopupOpen(true)
    EntityModal.style.display = 'block'
  }
  const cancelEntityHandler = () => {
    setIsCreatePopupOpen(false)
    EntityModal.style.display = 'none'
  }
  const actionFields = [
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Icon: Add,
        Label: 'New Entity',
        CSSName: '',
        onClick: createEntityButtonClick,
      },
    },
  ]

  setActionFields({ actionFields, showBackButton: false })
  // const usePrevious = (value) => {
  //   useEffect(() => {
  //     ref.current = value
  //   })
  //   return ref.current
  // }

  //  const previconURL = usePrevious(iconURL)

  const createEntityHandler = async (
    event,
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
  ) => {
    const postdata = {
      Id: id,
      Name: name,
      DisplayName: displayname,
      DisplayNamePlural: displayNamePlural,
      Description: description,
      HasMultipleAttachments: hasMultipleAttachments,
      IsSupportPayments: isSupportPayments,
      IsSupportActivities: isSupportActivities,
      IsSupportCorrespondences: isSupportCorrespondences,
      IsEnableCaching: isenableCaching,
      IsGlobalSearch: globalsearch,
      TTL: tTL,
      IconURL: iconURL,
      PartitionKey: partitionKey,
      IsSystemEntity: isSystemEntity,
    }

    showLoading(true)
    let createdEntity = ''
    if (postdata.Id === undefined) {
      createdEntity = await getAPIData(
        APIEndPoints.PostEntity.method,
        APIEndPoints.PostEntity.url,
        postdata,
        APIEndPoints.PostEntity.methodname
      )
    } else {
      createdEntity = await getAPIData(
        APIEndPoints.PutEntity.method,
        `${APIEndPoints.PutEntity.url}(${postdata.Id})`,
        postdata,
        APIEndPoints.PutEntity.methodname
      )
    }

    if (createdEntity.statusText === 'OK') {
      if (postdata.Id === undefined) {
        if (createdEntity.data.Message === 'Inserted Successfully') {
          queryClient.invalidateQueries('entitymanagerIconField')
          showToastMessage('New Entity Inserted Successfully', 'success')
          setsearchData((currentState) => {
            currentState[0].value.push(createdEntity.data.Data)
            return currentState
          })
          setIsCreatePopupOpen(false)
          EntityModal.style.display = 'none'
        } else if (
          createdEntity.data.Message ===
          'Insert-Failed- Cannot Insert Duplicate Name value'
        ) {
          showToastMessage('Entity Name Already Exists', 'error')
        } else if (
          createdEntity.data.Message ===
          'Insert-Failed- Cannot Insert Empty/Null'
        ) {
          showToastMessage("Empty Entity can't be created", 'error')
        } else if (
          createdEntity.data.Message === 'PartitionKey value is empty'
        ) {
          showToastMessage(createdEntity.data.Message, 'error')
        } else {
          showToastMessage(createdEntity.data.message, 'error')
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (
          createdEntity.data.Message ===
          'Update-Failed- Cannot Update Empty/Null'
        ) {
          if (postdata.Name === '' || postdata.DisplayName === '') {
            showToastMessage("Empty Entity can't be update", 'error')
          } else {
            showToastMessage('Entity Name Already Exists', 'error')
          }
        } else if (
          createdEntity.data.value ===
          'Update-Failed- Should not change the SupportPayment as False'
        ) {
          showToastMessage(createdEntity.data.value, 'error')
        } else if (
          createdEntity.data.value ===
          'Update-Failed For SupportsActivities column Cannot Update from True to False'
        ) {
          showToastMessage(createdEntity.data.value, 'error')
        } else if (
          createdEntity.data.value ===
          'Entity Name or PartitionKey cannot be changed'
        ) {
          showToastMessage(createdEntity.data.value, 'error')
        } else if (createdEntity.data.value === 'PartitionKey value is empty') {
          showToastMessage(createdEntity.data.value, 'error')
        } else if (createdEntity.data.Message === 'Updated Successfully') {
          queryClient.invalidateQueries('entitymanagerIconField')

          showToastMessage('Entity Updated Sucessfully', 'success')

          const dataIndex = searchData[0].value.findIndex(
            (item) => item.Id === createdEntity.data.Data.Id
          )

          setsearchData((currentState) => {
            const assigncurrentState = currentState
            assigncurrentState[0].value[dataIndex] = createdEntity.data.Data
            return assigncurrentState
          })
          setIsCreatePopupOpen(false)
          EntityModal.style.display = 'none'
        }
      }
      showLoading(false)
    }
  }
  const onedit = (e) => {
    seteditData(e)
    setIsCreatePopupOpen(true)
    const EntityModals = document.getElementById('EntityPopup')
    EntityModals.style.display = 'block'
  }

  const deleterecord = async (id) => {
    showLoading(true)
    /* Get Field Details based on Entity Id */
    const EntityField = await getAPIData(
      APIEndPoints.GetEntityField.method,
      APIEndPoints.GetEntityField.url + id,
      APIEndPoints.GetEntityField.methodname
    )

    /* Delete fields based on Entity Id */

    EntityField.data.value.forEach((dataItem) => {
      getAPIData(
        APIEndPoints.DeleteEntityField.method,
        `${APIEndPoints.DeleteEntityField.url}(${dataItem.Id})`,
        APIEndPoints.DeleteEntityField.methodname
      )
    })

    await getAPIData(
      APIEndPoints.DeleteEntity.method,
      `${APIEndPoints.DeleteEntity.url}(${id})`
    )
      .then(() => showToastMessage('Entity Deleted Sucessfully'))
      .catch((err) => showToastMessage(err?.response?.data?.value, 'error'))
    showLoading(false)
  }
  const onDelete = (e) => {
    confirmalert({
      description: 'Are you sure to remove Entity and EntityField?',
    }).then(() => deleterecord(e.Id))
  }
  useEffect(() => {
    async function fetchdata() {
      showLoading(true)
      const entitygetdata = await getAPIData(
        APIEndPoints.GetEntityOrderby.method,
        APIEndPoints.GetEntityOrderby.url,
        APIEndPoints.GetEntityOrderby.methodname
      )
      setsearchData([entitygetdata.data])
      showLoading(false)
    }
    fetchdata()
  }, [])

  return (
    <>
      <div className="entities">
        <EntitiesGrid
          onEdit={onedit}
          onDelete={onDelete}
          searchData={{ ...searchData }}
        />
      </div>
      <div id="EntityPopup" className="EntityPopup">
        <div className="entities_popup">
          {isCreatePopupOpen && (
            <EntityAdd
              CreateEntityHandler={createEntityHandler}
              CancelEntityHandler={cancelEntityHandler}
              editData={editData}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Entities
