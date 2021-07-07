import React, { useState, useEffect } from 'react'
import {
  Add,
  ViewModule as ViewModuleIcon,
  List as ListIcon,
} from '@material-ui/icons'

import { useConfirm } from 'material-ui-confirm'
import queryString from 'query-string'
import { useQuery } from 'react-query'
import FieldGrid from '../../components/custom/EntityField/FieldGrid'
import componentLookup from '../../../utils/componentLookup'
import useActionFields from '../../components/hooks/useActionsFields'
import AddField from '../../components/custom/EntityField/AddField/AddField'
import './Fields.css'
import APIEndPoints from '../../../models/api/apiEndpoints'
import getAPIData from '../../../models/api/api'
import { DatatypeIconData } from '../../../utils/DatatypeIconData'
import useAppContext from '../../components/hooks/useToast'
import usePageTitle from '../../components/hooks/usePageTitle'

const Fields = ({ history }) => {
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false)
  const [editData, seteditData] = useState([])
  const [Mode, setmode] = useState(null)

  const { setActionFields } = useActionFields()
  const { showToastMessage, showLoading } = useAppContext()
  const confirmalert = useConfirm()

  const Queryvalues = queryString.parse(location.search)
  const EntityId = Queryvalues.entityId
  const EntityName = Queryvalues.Name ? Queryvalues.Name : ''
  const EntityFieldModal = document.getElementById('EntityFieldPopup')
  const { setPageTitle } = usePageTitle()
  let relatedEntities = []
  const [RelatedEntitiesField, setrelatedEntitiesField] = React.useState([])
  const [EntityData, setEntityData] = React.useState([])
  const [RollupField, setRollupField] = React.useState([])
  const [RollupTypelist, setRollupTypelist] = React.useState([])
  const pageTitle = `Entity - ${Queryvalues.Name}`
  setPageTitle(pageTitle)

  const initialState = {
    OptionsetData: [],
    RequiredData: [],
    DataTypeData: [],
    Lookupdata: [],
    EntityFieldGridData: [],
  }
  const [Statevalue, setStatevalue] = useState(initialState)
  const createFieldButtonClick = () => {
    setmode('New')
    seteditData([])
    setIsCreatePopupOpen(true)
    EntityFieldModal.style.display = 'block'
  }
  const cancelFieldHandler = () => {
    setIsCreatePopupOpen(false)
    seteditData([])
    EntityFieldModal.style.display = 'none'
  }

  function mergeArrayObjects(arr1) {
    return arr1.map((item) => {
      const IconData = DatatypeIconData(item.Id)
      return { ...item, ...{ Icon: IconData } } // Object.values(IconData)[0] } }
    })
  }

  function GetLookupName(LookupId, LookupData) {
    const LookupItems =
      LookupData && LookupData.find((lookup) => lookup.Id === LookupId)
    return LookupItems?.Name ?? ''
  }

  function mergeGridArrayObjects(arr1, LookupData) {
    return arr1.map((item) => {
      const obj = {
        Id: item.Id,
        Name: item.Name,
        DisplayName: item.DisplayName,
        Description: item.Description,
        Filters: item.Filters,
        MaxLength: item.MaxLength,
        ValidationRule: item.ValidationRule,
        RequiredId: item.RequiredId,
        DataTypeId: item.DataTypeId,
        OptionSetId: item.OptionSetId,
        LookupId: item.Lookup,
        LookupTextField: item.LookupTextField,
        IsVisibleInUI: item.IsVisibleInUI,
        IsUniqueKey: item.IsUniqueKey,
        IsGlobalSearch: item.IsGlobalSearch,
        IsDisplayName: item.IsDisplayName,
        CascadingEntityColumn: item.CascadingEntityColumn,
        CascadingParentEntityField: item.CascadingParentEntityField,
        IsRollupField: item.IsRollupField,
        IsImmediateCalculation: item.IsImmediateCalculation,
        RelatedEntity: item.RelatedEntity,
        RelatedField: item.RelatedField,
        Criteria: item.Criteria,
        RollupType: item.RollupType,
        RollupField: item.RollupField,
        LookupFilter: item.LookupFilter,
      }

      if (item.OptionSet && item.OptionSetId === item.OptionSet.Id) {
        obj.OptionSet = item.OptionSet.DisplayName
      }

      if (
        item.EntityFieldRequired &&
        item.RequiredId === item.EntityFieldRequired.Id
      ) {
        obj.Required = item.EntityFieldRequired.DisplayName
      }

      if (item.Lookup) {
        obj.Lookup = GetLookupName(item.Lookup, LookupData)
      }

      if (
        item.EntityFieldDataType &&
        item.DataTypeId === item.EntityFieldDataType.Id
      ) {
        obj.DataType = item.EntityFieldDataType.DisplayName
        const IconData = DatatypeIconData(item.DataTypeId)
        obj.DataTypeIcon = IconData // Object.values(IconData)[0]
      }

      return obj
    })
  }

  useEffect(() => {
    async function fetchdata() {
      showLoading(true)
      relatedEntities = await EntityLookupbind(EntityName)
      setEntityData(relatedEntities)
      const Optionsetgetdata = await getAPIData(
        APIEndPoints.GetEntityFieldOptionset.method,
        APIEndPoints.GetEntityFieldOptionset.url,
        APIEndPoints.GetEntityFieldOptionset.methodname
      )

      const Requiredgetdata = await getAPIData(
        APIEndPoints.GetEntityFieldRequired.method,
        APIEndPoints.GetEntityFieldRequired.url,
        APIEndPoints.GetEntityFieldRequired.methodname
      )

      const DataTypegetdata = await getAPIData(
        APIEndPoints.GetEntityFieldDataType.method,
        APIEndPoints.GetEntityFieldDataType.url,
        APIEndPoints.GetEntityFieldDataType.methodname
      )
      const finalDataTypegetdata = mergeArrayObjects(DataTypegetdata.data.value)

      const EntityField = await getAPIData(
        APIEndPoints.GetEntityField.method,
        `${APIEndPoints.GetEntityField.url + EntityId}&$orderby=Name`,
        APIEndPoints.GetEntityField.methodname
      )

      const AllEntityField = await getAPIData(
        APIEndPoints.GetEntityField.method,
        // `${APIEndPoints.GetinputEntityField.url}?$filter=Id ne ${EntityId}`,
        `${APIEndPoints.GetinputEntityField.url}`,
        APIEndPoints.GetEntityField.methodname
      )

      const allEntityFields = await getAPIData(
        APIEndPoints.GetEntityFields.method,
        APIEndPoints.GetEntityFields.url
      )

      setStatevalue(() => ({
        OptionsetData: Optionsetgetdata.data.value,
        RequiredData: Requiredgetdata.data.value,
        DataTypeData: finalDataTypegetdata,
        Lookupdata: AllEntityField.data.value,
        EntityFieldGridData: mergeGridArrayObjects(
          EntityField.data.value,
          AllEntityField.data.value
        ),
        EntityFields: allEntityFields.data.value,
      }))
      showLoading(false)
    }
    fetchdata()
  }, Statevalue)

  useEffect(() => {
    showLoading(true)
    if (
      Statevalue.OptionsetData.length !== 0 &&
      Statevalue.RequiredData.length !== 0 &&
      Statevalue.DataTypeData.length !== 0
    ) {
      const actionFields = [
        {
          actionComponent: componentLookup.ActionButton,
          componentProps: {
            Icon: Add,
            Label: 'New Field',
            CSSName: '',
            onClick: createFieldButtonClick,
          },
        },
        {
          actionComponent: componentLookup.ActionButton,
          componentProps: {
            Icon: ListIcon,
            Label: 'List',
            CSSName: '',
            onClick: () => {
              history.push({
                pathname: '/listViews',
                state: { entity: EntityName },
              })
            },
          },
        },
        {
          actionComponent: componentLookup.ActionButton,
          componentProps: {
            Icon: ViewModuleIcon,
            Label: 'Form',
            CSSName: '',
            onClick: () => {
              history.push({
                pathname: '/FormDesigner',
                state: { entity: EntityName },
              })
            },
          },
        },
      ]
      setActionFields({ actionFields, showBackButton: true })
      showLoading(false)
    }
  }, [Statevalue])

  const CreateEntityFieldHandler = async (
    event,
    Name,
    DisplayName,
    Description,
    Filters,
    DataTypeId,
    MaxLength,
    ValidationRule,
    OptionSetId,
    RequiredId,
    Lookup,
    LookupTextField,
    Id,
    IsVisibleInUI,
    IsUniqueKey,
    IsDisplayName,
    IsGlobalSearch,
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
  ) => {
    showLoading(true)
    let postdata
    if (Filters === '{}' || Filters === undefined || Filters === null) {
    } else {
      RelatedEntity = null
      RelatedField = null
      Criteria = null
      RollupType = null
      RollupField = null
    }
    if (Mode === 'New') {
      postdata = {
        Name,
        DisplayName,
        Description,
        Filters,
        DataTypeId,
        MaxLength,
        ValidationRule,
        OptionSetId,
        EntityId,
        RequiredId,
        Lookup,
        LookupTextField,
        IsVisibleInUI,
        IsUniqueKey,
        IsDisplayName,
        IsGlobalSearch,
        CascadingEntityColumn,
        CascadingParentEntityField,
        IsRollupField,
        IsImmediateCalculation,
        RelatedEntity,
        RelatedField,
        Criteria,
        RollupType,
        RollupField,
        LookupFilter,
      }

      const createdEntityField = await getAPIData(
        APIEndPoints.InsertEntityField.method,
        APIEndPoints.InsertEntityField.url,
        postdata,
        APIEndPoints.InsertEntityField.methodname
      )
        .then((createdEntityField) => {
          if (createdEntityField.statusText === 'OK') {
            if (createdEntityField.data.Message === 'Inserted Successfully') {
              showToastMessage(
                'New EntityField Inserted Successfully',
                'success'
              )
            } else if (
              createdEntityField.data.Message ===
              'Insert-Failed- Cannot Insert Duplicate Name value'
            ) {
              showToastMessage('EntityField Name Already Exists', 'success')
            } else if (
              createdEntityField.data.Message ===
              'Insert-Failed- Cannot Insert Empty/Null'
            ) {
              showToastMessage("Empty EntityField can't be created", 'error')
            }
            setIsCreatePopupOpen(false)
            EntityFieldModal.style.display = 'none'
          }
        })
        .catch((err) => {
          showLoading(false)
          showToastMessage(JSON.stringify(err?.response?.data.value), 'error')
          return false
        })
        .finally(() => {
          showLoading(false)
        })

      const EntityField = await getAPIData(
        APIEndPoints.GetEntityField.method,
        APIEndPoints.GetEntityField.url + EntityId,
        APIEndPoints.GetEntityField.methodname
      )

      setStatevalue((currentState) => {
        const assigncurrentState = currentState
        assigncurrentState.EntityFieldGridData = mergeGridArrayObjects(
          EntityField.data.value,
          currentState.Lookupdata
        )
        return assigncurrentState
      })
      // setIsCreatePopupOpen(false)
      // EntityFieldModal.style.display = 'none'
    } else if (Mode === 'Edit') {
      postdata = {
        Id,
        Name,
        DisplayName,
        Description,
        Filters,
        DataTypeId,
        MaxLength,
        ValidationRule,
        OptionSetId,
        EntityId,
        RequiredId,
        Lookup,
        LookupTextField,
        IsVisibleInUI,
        IsUniqueKey,
        IsDisplayName,
        IsGlobalSearch,
        CascadingEntityColumn,
        CascadingParentEntityField,
        IsRollupField,
        IsImmediateCalculation,
        RelatedEntity,
        RelatedField,
        Criteria,
        RollupType,
        RollupField,
        LookupFilter,
      }

      const createdEntityField = await getAPIData(
        APIEndPoints.UpdateEntityField.method,
        `${APIEndPoints.UpdateEntityField.url}(${postdata.Id})`,
        postdata,
        APIEndPoints.UpdateEntityField.methodname
      )
        .then((createdEntityField) => {
          if (createdEntityField.statusText === 'OK') {
            if (createdEntityField.data.Message === 'Updated Successfully') {
              showToastMessage('EntityField Updated Successfully', 'success')
            } else if (
              createdEntityField.data.Message ===
              'Update-Failed- Cannot Update Empty/Null'
            ) {
              showToastMessage("Empty EntityField can't be updated", 'error')
            } else if (
              createdEntityField.data.Message ===
              'Update-Failed- Cannot Update Duplicate Name value'
            ) {
              showToastMessage('EntityField Name Already Exists', 'error')
            } else {
              showToastMessage(createdEntityField?.data?.message, 'error')
            }
          }
          setIsCreatePopupOpen(false)
          EntityFieldModal.style.display = 'none'
        })
        .catch((err) => {
          showLoading(false)
          showToastMessage(JSON.stringify(err?.response?.data.value), 'error')
          return false
        })
        .finally(() => {
          showLoading(false)
        })

      const EntityField = await getAPIData(
        APIEndPoints.GetEntityField.method,
        APIEndPoints.GetEntityField.url + EntityId,
        APIEndPoints.GetEntityField.methodname
      )

      setStatevalue((currentState) => {
        const assigncurrentState = currentState
        assigncurrentState.EntityFieldGridData = mergeGridArrayObjects(
          EntityField.data.value,
          currentState.Lookupdata
        )
        return assigncurrentState
      })
    }
  }
  async function EntityLookupbind(entityname) {
    const entityList = await getAPIData(
      APIEndPoints.GetEntity.method,
      `${APIEndPoints.GetEntity.url}?$expand=EntityField($expand=EntityFieldDataType,OptionSet($expand=OptionSetOptions))`
    ).then((response) => response.data.value)
    const baseEntitydata = entityList.find(
      (entity) => entity.Name === entityname
    )
    const Lookupiddata = []
    const lookupdata = getlookupdatalist(
      baseEntitydata,
      entityList,
      Lookupiddata
    )
    const Entitydata = []
    lookupdata.length !== 0 &&
      lookupdata.forEach((entityField) => {
        const data = entityList.find((entity) => entity.Id === entityField)
        if (data) Entitydata.push(data)
      })
    return Entitydata
  }
  function getlookupdatalist(baseEntitydata, entityList, Lookupiddata) {
    entityList.length !== 0 &&
      baseEntitydata.EntityField.forEach((entityField) => {
        if (entityField.EntityFieldDataType.Name === 'Lookup') {
          Lookupiddata.push(entityField.Lookup)
        }
      })
    const uniqueNames = Array.from(new Set(Lookupiddata))
    return uniqueNames
  }
  function getlookupdata(entityList, Lookupiddata) {
    entityList &&
      entityList.EntityField &&
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

  const onedit = (e) => {
    const Lookupiddata = []
    setmode('Edit')
    seteditData(e)
    setIsCreatePopupOpen(true)
    const EntityFieldModals = document.getElementById('EntityFieldPopup')
    EntityFieldModals.style.display = 'block'
    const fieldsData = relatedEntities.find((f) => f.Name === e.RelatedEntity)
    setRollupTypelist(fieldsData)
    const entityFielddata = getlookupdata(fieldsData, Lookupiddata)
    setrelatedEntitiesField(entityFielddata || [])
    if (e.RollupType === 'COUNT') {
      setRollupField(fieldsData && fieldsData.EntityField)
    } else {
      const Filterentity = fielddatatype(fieldsData)
      setRollupField(Filterentity)
    }
  }

  function fielddatatype(fieldsData) {
    const lookupentitesid = []
    fieldsData &&
      fieldsData.EntityField &&
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

  const deleterecord = async (id) => {
    showLoading(true)
    const deleteEntityField = await getAPIData(
      APIEndPoints.DeleteEntityField.method,
      `${APIEndPoints.DeleteEntityField.url}(${id})`,
      APIEndPoints.DeleteEntityField.methodname
    )
    if (deleteEntityField.statusText === 'OK') {
      if (deleteEntityField.data.value === 'Deleted Successfully') {
        showToastMessage('EntityField Deleted Successfully', 'success')
        window.location.reload()
      }
    }
    showLoading(false)
  }

  const onDelete = (e) => {
    confirmalert({
      description: 'Are you sure to delete EntityField?',
    }).then(() => deleterecord(e.Id))
  }

  return (
    <>
      <div className="Fields">
        <FieldGrid
          onEdit={onedit}
          onDelete={onDelete}
          EntityFieldGridData={Statevalue.EntityFieldGridData} // {Griddata}
          EntityId={EntityId}
        />
      </div>
      <div id="EntityFieldPopup" className="EntityFieldPopup">
        {isCreatePopupOpen && (
          <AddField
            CreateEntityFieldHandler={CreateEntityFieldHandler}
            CancelFieldHandler={cancelFieldHandler}
            OptionsetDatasource={Statevalue.OptionsetData}
            RequiredDatasource={Statevalue.RequiredData}
            DataTypeDatasource={Statevalue.DataTypeData}
            editData={editData}
            LookupData={Statevalue.Lookupdata}
            EntityFields={Statevalue.EntityFields}
            EntityName={EntityName}
            EntityId={EntityId}
            RelatedEntities={EntityData}
            RelatedEntitiesField={RelatedEntitiesField}
            RollupFieldlist={RollupField}
            RollupTypelist={RollupTypelist}
          />
        )}
      </div>
    </>
  )
}

export default Fields
