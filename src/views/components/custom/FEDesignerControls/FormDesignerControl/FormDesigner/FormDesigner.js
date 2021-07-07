/* eslint-disable  */
import React, { useState, useEffect, memo } from 'react'
import { Grid } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-beautiful-dnd'
import {
  SaveSharp as SaveSharpIcon,
  Publish as PublishIcon,
  Undo as UndoIcon,
  Settings as SettingsIcon,
  Redo as RedoIcon,
} from '@material-ui/icons'
import { Close as CloseIcon } from '@material-ui/icons'
import FEDesignerTab from '../FEDesignerTab/FEDesignerTab'

import getAPIData, { getCoreData } from '../../../../../../models/api/api'
import APIEndPoints from '../../../../../../models/api/apiEndpoints'
import { DatatypeIconData } from '../../../../../../utils/DatatypeIconData'
import useAppContext from '../../../../../components/hooks/useToast'

import './FormDesigner.css'

import FEFieldLeftPanel from '../FEDesignerColumns/FELeftPanel/FEFieldLeftPanel'
import FEComponentsLeftPanel from '../FEDesignerColumns/FELeftPanel/FEComponentsLeftPanel'
import FEPropertiesRightPanel from '../FEDesignerColumns/FERightPanel/FEPropertiesRightPanel'

import {
  FEMElementMethod,
  FESectionMethod,
  FETabCreation,
  FEAddJsonItem,
} from '../FEDesignerColumns/FEDesignerColumnMethod'

import FFToggleButton from '../../../../base/FFToggleButton/FFToggleButton'

import useActionFields from '../../../../../components/hooks/useActionsFields'
import componentLookup from '../../../../../../utils/componentLookup'
import usePageTitle from '../../../../../components/hooks/usePageTitle'

import FilterDesigner from '../../../../custom/FilterDesigner/FilterDesigner'

import {
  //initialData,
  PropertiesPanelDataTablist,
  PropertiesPanelDataColumnlist,
  PropertiesPanelDataSectionlist,
  PropertiesPanelDataElementlist,
  PropertiesPanelDataHeaderlist,
  PropertiesPanelDataGridlist,
  PropertiesPanelDataActivitylist,
  PropertiesPanelDataTimelinelist,
  PropertiesPanelDataPayment,
  RightPanelDefault,
  RightPanelDesignDefault,
  FormSettings,
} from './data'

import utils from '../../../../../../utils/utils'
import CRUDModal from '../../../CRUDModal/CRUDModal'

function designerPropReducer(state, action) {
  switch (action.type) {
    case 'SHOW_POPUP':
      return {
        ...state,
        showModal: true,
      }
    case 'HIDE_POPUP':
      return {
        ...state,
        showModal: false,
      }
    case 'SaveCriteria':
      return {
        ...state,
        Criteria:
          action.Criteria !== ''
            ? JSON.parse(action.Criteria)
            : action.Criteria,
      }
    case 'SaveOrder':
      return {
        ...state,
        Order: action.Order,
      }
    case 'SaveUserSelectable':
      return {
        ...state,
        UserSelectable: action.UserSelectable,
      }
    case 'SaveFilter_Data':
      return {
        ...state,
        showModal: false,
        Criteria: JSON.parse(action.Criteria),
      }
    case 'SaveForm_Data':
      return {
        ...state,
        sysFormData: action.sysFormData,
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const FormDesigner = (history) => {
  const { setActionFields } = useActionFields()
  const { showToastMessage, showLoading } = useAppContext()

  const initialData = {
    header: {
      Properties: {
        HeaderName: 'New Form Name',
        Subtitle: 'New SubTitle Form Name',
      },
    },
    Entities: [],
    tabs: [
      {
        id: 1,
        Properties: {
          Name: 'Tab',
          DisplayName: 'Tab',
          Displayindex: 2,
          ExpandTabDafault: '',
          Hide: false,
          HidePhone: false,
          Layout: '1',
          Column1Width: '100',
          Column2Width: '100',
          Column3Width: '100',
        },
        columns: [
          {
            id: 'Column1',
            Properties: {
              Name: 'Column',
              DisplayName: 'Column',
              Width: 100,
              Hide: false,
              HideLabel: false,
              HidePhone: false,
              Lock: false,
            },
            sections: [
              {
                id: ' section1',
                Properties: {
                  Name: 'Section',
                  DisplayName: 'Section',
                  Layout: '1',
                  SectionColumn1Width: '100',
                  SectionColumn2Width: '100',
                  SectionColumn3Width: '100',
                  SectionColumn4Width: '100',
                },
                sectionColumns: [
                  {
                    id: 'SectionColumn1',
                    Properties: {
                      Name: 'SectionColumn',
                      DisplayName: 'SectionColumn',
                      Width: 100,
                    },
                    elements: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    currentTab: {
      id: 1,
      Properties: {
        Name: 'Tab',
        DisplayName: 'Tab',
        Displayindex: 2,
        ExpandTabDafault: '',
        Hide: false,
        HidePhone: false,
        Layout: '1',
        Column1Width: '100',
        Column2Width: '100',
        Column3Width: '100',
      },
      columns: [
        {
          id: 'Column1',
          Properties: {
            Name: 'Column',
            DisplayName: 'Column',
            Width: 100,
            Hide: false,
            HideLabel: false,
            HidePhone: false,
            Lock: false,
          },
          sections: [
            {
              id: ' Section1',
              Properties: {
                Name: 'Section',
                DisplayName: 'Section',
                Layout: '1',
                SectionColumn1Width: '100',
                SectionColumn2Width: '100',
                SectionColumn3Width: '100',
                SectionColumn4Width: '100',
              },
              sectionColumns: [
                {
                  id: 'sectionColumn1',
                  Properties: {
                    Name: 'sectionColumn',
                    DisplayName: 'sectionColumn',
                    Width: 100,
                  },
                  elements: [],
                },
              ],
            },
          ],
        },
      ],
    },
  }

  const initialState = {
    showModal: false,
    Criteria: '',
    sysFormData: '',
    Order: '',
    UserSelectable: true,
  }

  const [Fieldlistvalue, setfieldlistvalue] = useState([])
  const [Fieldlistvalueitem, setfieldlistvalueitem] = useState([])
  const { setPageTitle } = usePageTitle()

  const [formStatus, setFormStatus] = useState('Components')

  const [PropertiesPanelDesignData, setPropertiesPanelDesignData] = useState(
    PropertiesPanelDataTablist
  )
  const [PropertiesPanelData, setPropertiesPanelData] = useState()

  const [ItemSelected, setItemSelected] = useState({
    selecteditem: 'Tab',
    selectedindex: { tabindex: 0 },
  })

  let fieldsearchValue = ''
  const [recordpresent, setrecordpresent] = useState(false)
  const [SupportsActivities, setsupportsActivities] = useState(false)
  const [SupportsPayments, setSupportsPayments] = useState(false)
  const [EntityData, setEntityData] = useState([])
  const [EntityFieldDropdownData, setEntityFieldDropdownData] = useState([])
  const [GridListIddata, setGridListIddata] = useState([])
  const [mode, setMode] = useState(
    history.location.state?.mode ? history.location.state.mode : 'Add'
  )

  let entityname = history.location.state && history.location.state.entity
  let formId = history.location.state && history.location.state.formId
  const [coreData, setCoreData] = useState(initialData)
  let pageTitle = 'FormDesigner - ' + entityname
  setPageTitle(pageTitle)

  const [EntityFieldDropdownvalues, setEntityFieldDropdownvalues] = useState('')
  const [EntityNamevalue, setEntityNamevalue] = useState('')
  const [IsPublished, setIsPublished] = useState(false)
  const actionFields = [
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Label: 'Undo',
        Icon: UndoIcon,
        //onClick: onSaveClickHandler,
      },
    },

    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Label: 'Redo',
        Icon: RedoIcon,
        //onClick: onSaveClickHandler,
      },
    },
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Label: 'Form Settings',
        Icon: SettingsIcon,
        onClick: onFormSettingsClickHandler,
      },
    },
    {
      actionComponent: componentLookup.ActionButton,
      componentProps: {
        Icon: SaveSharpIcon,
        Label: 'Save',
        CSSName: 'form-designer__save',
        onClick: onSaveClickHandler,
        //disabled: mode === 'Edit' && IsPublished,
      },
    },
    // {
    //   actionComponent: componentLookup.ActionButton,
    //   componentProps: {
    //     Icon: PublishIcon,
    //     Label: 'Publish',
    //     CSSName: 'form-designer__publish',
    //     onClick: onPublishClickHandler,
    //     disabled: mode !== 'Edit',
    //   },
    // },
  ]

  setActionFields({ actionFields, showBackButton: true, hideSearchBox: true })

  const [state, dispatch] = React.useReducer(designerPropReducer, initialState)

  const TogglehandleChange = (event, newTrigger) => {
    const selectedType = $(event.currentTarget).attr('value')
    setFormStatus(selectedType)
  }

  useEffect(() => {
    showLoading(true)
    async function fetchdata() {
      const datatypeList = await utils.EntityLookupbind(entityname)

      setEntityFieldDropdownData(datatypeList)
      setEntityFieldDropdownvalues(datatypeList[0].Id)

      if (datatypeList.length != 0) {
        const finalDataTypegetdata =
          datatypeList[0] && mergeDataTypeObjects(datatypeList[0].EntityField)

        setfieldlistvalue(finalDataTypegetdata)
        setfieldlistvalueitem(finalDataTypegetdata)
        setsupportsActivities(datatypeList[0].IsSupportActivities)
        setSupportsPayments(datatypeList[0].IsSupportPayments)
        setEntityData(datatypeList[0])
        setEntityNamevalue(entityname)
      }
      if (mode === 'Edit') {
        let CoreDatalist = getCoreData(
          APIEndPoints.GetSysForm.method,
          `${APIEndPoints.GetSysForm.url}?$Filter=SysEntity eq '${entityname}' and  id eq '${formId}'`
        )
        const [sysFormData] = await Promise.all([CoreDatalist])

        if (sysFormData.data.length != 0) {
          dispatch({
            type: 'SaveForm_Data',
            sysFormData: sysFormData.data[0],
          })
          dispatch({
            type: 'SaveCriteria',
            Criteria:
              (sysFormData.data[0].Criteria && sysFormData.data[0].Criteria) ||
              '',
          })
          dispatch({
            type: 'SaveOrder',
            Order:
              (sysFormData.data[0].Order && sysFormData.data[0].Order) || '',
          })
          dispatch({
            type: 'SaveUserSelectable',
            UserSelectable:
              (sysFormData.data[0].UserSelectable &&
                sysFormData.data[0].UserSelectable) ||
              false,
          })

          const coredata = IsJsonString(sysFormData.data[0].FormJSON)
            ? JSON.parse(sysFormData.data[0].FormJSON)
            : initialData
          setCoreData(coredata)
          setPropertiesPanelData(coredata.currentTab)
          setrecordpresent(true)
          showLoading(false)
          if (sysFormData.data[0].IsPublished) setIsPublished(true)

          for (let i = 0; i <= coredata.tabs.length - 1; i++) {
            if (coredata.currentTab.id === coredata.tabs[i].id) {
              setItemSelected((currentState) => {
                const tempdata = { ...currentState }
                tempdata.selectedindex = {
                  ...tempdata.selectedindex,
                  ...{ tabindex: i },
                }
                return tempdata
              })
              break
            }
          }
        } else {
          initialData.header.Properties.Subtitle = entityname
          initialData.header.Properties.HeaderName = 'New Form Name'
          setCoreData(initialData)
          setPropertiesPanelData(coreData.currentTab)
          setrecordpresent(false)
          showLoading(false)
        }
      } else {
        initialData.header.Properties.Subtitle = entityname
        initialData.header.Properties.HeaderName = 'New Form Name'
        setCoreData(initialData)
        setPropertiesPanelData(coreData.currentTab)
        setrecordpresent(false)
        showLoading(false)
      }
    }
    fetchdata()
  }, [IsPublished])

  function IsJsonString(str) {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  const mergeDataTypeObjects = (arr1) => {
    return arr1.map((item) => {
      const Icon = { Icon: DatatypeIconData(item.DataTypeId) }
      return { ...item, ...Icon }
    })
  }

  const onFieldSearchChange = (event) => {
    fieldsearchValue = event.target.value.toLowerCase()
    const resultvalue = Fieldlistvalueitem.filter((el) => {
      let searchValue1 = el.Name.toLowerCase()
      return searchValue1.indexOf(fieldsearchValue) !== -1
    })
    setfieldlistvalue(resultvalue)
  }

  async function onLeftPanelDropdownchange(entityName, entitydata) {
    showLoading(true)
    setEntityFieldDropdownvalues(entitydata.value)
    setEntityNamevalue(entityName)
    const fieldData = EntityFieldDropdownData.find(
      (f) => f.Id === entitydata.value
    )
    if (fieldData) {
      const finalDataTypegetdata = mergeDataTypeObjects(fieldData.EntityField)
      setfieldlistvalue(finalDataTypegetdata)
      setfieldlistvalueitem(finalDataTypegetdata)
      showLoading(false)
    }
  }

  async function onSearchListName_API(listname) {
    let Datalist = getCoreData(
      APIEndPoints.GetSysList.method,
      `${APIEndPoints.GetSysList.url}?$Filter=SysEntity eq '${listname}'`
    )
    const [sysListData] = await Promise.all([Datalist])
    let ListData = []
    if (sysListData.data.lenght !== 0) {
      sysListData.data.forEach((dataItem) => {
        ListData.push({ Name: dataItem.Title, Id: dataItem.id })
      })
    }
    setGridListIddata(ListData)
  }

  const FETabOnClick = (tab, tabindex) => {
    const currentTab = { ...tab }
    setCoreData((currentState) => {
      const tempTabs = { ...currentState }
      tempTabs.currentTab = currentTab
      return tempTabs
    })
    setItemSelected({
      selecteditem: 'Tab',
      selectedindex: { tabindex: tabindex },
    })
    setPropertiesPanelDesignData(PropertiesPanelDataTablist)
    setPropertiesPanelData(tab)
  }

  const FEColumnOnClick = (data, colindex) => {
    setItemSelected((currentState) => {
      const tempdata = { ...currentState }
      tempdata.selecteditem = 'Column'
      tempdata.selectedindex = {
        ...tempdata.selectedindex,
        ...{ colindex: colindex },
      }
      return tempdata
    })
    setPropertiesPanelDesignData(PropertiesPanelDataColumnlist)
    setPropertiesPanelData(data)
  }
  const FESectionOnClick = (data, colindex, sectindex) => {
    setItemSelected((currentState) => {
      const tempdata = { ...currentState }
      tempdata.selecteditem = data.Properties.Name //selecteditemdata
      tempdata.selectedindex = {
        ...tempdata.selectedindex,
        ...{ colindex: colindex, sectindex: sectindex },
      }
      return tempdata
    })
    if (data.Properties.Name === 'Section') {
      setPropertiesPanelDesignData(PropertiesPanelDataSectionlist)
    } else if (data.Properties.Name === 'Grid') {
      setPropertiesPanelDesignData(PropertiesPanelDataGridlist)
      if (data.Properties.ListName !== '')
        onSearchListName_API(data.Properties.ListName)
    } else if (data.Properties.Name === 'Activity') {
      setPropertiesPanelDesignData(PropertiesPanelDataActivitylist)
    } else if (data.Properties.Name === 'Timeline') {
      setPropertiesPanelDesignData(PropertiesPanelDataTimelinelist)
    } else if (data.Properties.Name === 'Payment') {
      setPropertiesPanelDesignData(PropertiesPanelDataPayment)
    }

    setPropertiesPanelData(data)
  }
  const FEElementOnClick = (
    data,
    colindex,
    sectindex,
    sectcolindex,
    eleindex
  ) => {
    setItemSelected((currentState) => {
      const tempdata = { ...currentState }
      tempdata.selecteditem = 'Element'
      tempdata.selectedindex = {
        ...tempdata.selectedindex,
        ...{
          colindex: colindex,
          sectindex: sectindex,
          sectcolindex: sectcolindex,
          eleindex: eleindex,
        },
      }
      return tempdata
    })
    setPropertiesPanelDesignData(PropertiesPanelDataElementlist)
    setPropertiesPanelData(data)
  }

  const FEHeaderOnClick = (header) => {
    setItemSelected((currentState) => {
      const tempdata = { ...currentState }
      tempdata.selecteditem = 'Header'
      tempdata.selectedindex = {
        ...tempdata.selectedindex,
      }
      return tempdata
    })
    setPropertiesPanelDesignData(PropertiesPanelDataHeaderlist)
    setPropertiesPanelData(header)
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result
    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    switch (type) {
      case 'element':
        const updateelement = FEMElementMethod(
          coreData.currentTab,
          source,
          destination,
          draggableId,
          EntityNamevalue
        )
        updateCoreData(updateelement, EntityNamevalue)
        return
      case 'section':
        const updatesection = FESectionMethod(
          coreData.currentTab,
          source,
          destination,
          draggableId
        )
        updateCoreData(updatesection, EntityNamevalue)
        return
      case 'tab':
        const updatetab = FETabCreation(
          coreData,
          source,
          destination,
          draggableId
        )
        addCoreData(updatetab)
      default:
    }
  }

  const addCoreData = (adddata) => {
    setCoreData((currentState) => {
      const tempTabs = { ...currentState }
      tempTabs.tabs = [...tempTabs.tabs, adddata]
      tempTabs.currentTab = adddata
      return tempTabs
    })
    setItemSelected({
      selecteditem: 'Tab',
      selectedindex: { tabindex: coreData.tabs.length },
    })
    setPropertiesPanelDesignData(PropertiesPanelDataTablist)
    setPropertiesPanelData(adddata)
  }
  const updateCoreData = (updateddata, EntityNamevalue) => {
    setCoreData((currentState) => {
      const tempTabs = { ...currentState }
      let Entities = tempTabs.Entities ? tempTabs.Entities : []
      Entities && Entities.indexOf(EntityNamevalue) === -1
        ? Entities.push(EntityNamevalue)
        : null
      tempTabs.BaseEntity = entityname
      tempTabs.Entities = Entities
      tempTabs.currentTab = updateddata
      tempTabs.tabs.find(function (item, i) {
        if (item.id === updateddata.id) {
          return tempTabs.tabs.splice(i, 1)
        }
      })
      tempTabs.tabs.push(updateddata)
      tempTabs.tabs.sort(function (a, b) {
        return a.id - b.id
      })
      return tempTabs
    })
  }

  const updateRightPanelData = (data, selecteddata, controlType) => {
    if (controlType && controlType === 'FormSettings') {
      let newdata = {}
      if (data === 'Order') {
        dispatch({
          type: 'SaveOrder',
          Order: selecteddata,
        })
        newdata = {
          Order: selecteddata,
          UserSelectable: state.UserSelectable,
        }
      } else if (data === 'UserSelectable') {
        dispatch({
          type: 'SaveUserSelectable',
          UserSelectable: selecteddata,
        })
        newdata = {
          Order: state.Order,
          UserSelectable: selecteddata,
        }
      }
      setPropertiesPanelData(newdata)
    } else {
      if (selecteddata.selecteditem === 'Tab') {
        setCoreData((currentState) => {
          const tempTabs = { ...currentState }
          tempTabs.tabs.splice(selecteddata.selectedindex.tabindex, 1)
          tempTabs.tabs.splice(selecteddata.selectedindex.tabindex, 0, data)
          tempTabs.currentTab = data
          return tempTabs
        })
      } else if (selecteddata.selecteditem === 'Column') {
        setCoreData((currentState) => {
          const tempTabs = { ...currentState }
          tempTabs.tabs[selecteddata.selectedindex.tabindex].columns.splice(
            selecteddata.selectedindex.colindex,
            1
          )
          tempTabs.tabs[selecteddata.selectedindex.tabindex].columns.splice(
            selecteddata.selectedindex.colindex,
            0,
            data
          )

          tempTabs.currentTab =
            tempTabs.tabs[selecteddata.selectedindex.tabindex]
          return tempTabs
        })
      } else if (
        selecteddata.selecteditem === 'Section' ||
        selecteddata.selecteditem === 'Grid' ||
        selecteddata.selecteditem === 'Timeline' ||
        selecteddata.selecteditem === 'Activity' ||
        selecteddata.selecteditem === 'Payment'
      ) {
        setCoreData((currentState) => {
          const tempTabs = { ...currentState }
          tempTabs.tabs[selecteddata.selectedindex.tabindex].columns[
            selecteddata.selectedindex.colindex
          ].sections.splice(selecteddata.selectedindex.sectindex, 1)

          tempTabs.tabs[selecteddata.selectedindex.tabindex].columns[
            selecteddata.selectedindex.colindex
          ].sections.splice(selecteddata.selectedindex.sectindex, 0, data)

          tempTabs.currentTab =
            tempTabs.tabs[selecteddata.selectedindex.tabindex]
          return tempTabs
        })

        if (selecteddata.selecteditem === 'Grid') {
          if (data.Properties.ListName !== '')
            onSearchListName_API(data.Properties.ListName)
        }
      } else if (selecteddata.selecteditem === 'Element') {
        setCoreData((currentState) => {
          const tempTabs = { ...currentState }
          tempTabs.tabs[selecteddata.selectedindex.tabindex].columns[
            selecteddata.selectedindex.colindex
          ].sections[selecteddata.selectedindex.sectindex].sectionColumns[
            selecteddata.selectedindex.sectcolindex
          ].elements.splice(selecteddata.selectedindex.eleindex, 1)

          tempTabs.tabs[selecteddata.selectedindex.tabindex].columns[
            selecteddata.selectedindex.colindex
          ].sections[selecteddata.selectedindex.sectindex].sectionColumns[
            selecteddata.selectedindex.sectcolindex
          ].elements.splice(selecteddata.selectedindex.eleindex, 0, data)

          tempTabs.currentTab =
            tempTabs.tabs[selecteddata.selectedindex.tabindex]
          return tempTabs
        })
      } else if (selecteddata.selecteditem === 'Header') {
        setCoreData((currentState) => {
          const tempTabs = { ...currentState }
          tempTabs.header.Properties = data.Properties
          return tempTabs
        })
      }
      setPropertiesPanelData(data)
    }
  }

  const FFOnDeleteItem = (
    data,
    selecteditem,
    tabindex,
    colindex,
    sectindex,
    sectcolindex,
    eleindex
  ) => {
    if (selecteditem === 'Tab') {
      setCoreData((currentState) => {
        const tempTabs = { ...currentState }
        tempTabs.tabs.splice(tabindex, 1)
        if (tempTabs.tabs.length === 0) {
          setItemSelected({
            selecteditem: 'Tab',
            selectedindex: { tabindex: 0 },
          })

          data = FEAddJsonItem(selecteditem)
          tempTabs.tabs.push(data)
          tempTabs.currentTab = data

          setPropertiesPanelDesignData(PropertiesPanelDataTablist)
          setPropertiesPanelData(data)
          return tempTabs
        }

        if (tabindex === 0) {
          setItemSelected({
            selecteditem: 'Tab',
            selectedindex: { tabindex: tabindex },
          })

          tempTabs.tabs.map((item, index) => {
            item.id = index
            return item
          })

          tempTabs.currentTab = tempTabs.tabs[tabindex]

          // setPropertiesPanelData(tempTabs.tabs[tabindex])
          setPropertiesPanelDesignData(PropertiesPanelDataTablist)
          setPropertiesPanelData(RightPanelDefault)

          return tempTabs
        } else if (tabindex === tempTabs.tabs.length) {
          setItemSelected({
            selecteditem: 'Tab',
            selectedindex: { tabindex: tabindex - 1 },
          })
          tempTabs.tabs.map((item, index) => {
            item.id = index
            return item
          })
          // setPropertiesPanelData(tempTabs.tabs[tabindex - 1])
          setPropertiesPanelDesignData(PropertiesPanelDataTablist)
          setPropertiesPanelData(RightPanelDefault)
          tempTabs.currentTab = tempTabs.tabs[tabindex - 1]
          return tempTabs
        } else {
          setItemSelected({
            selecteditem: 'Tab',
            selectedindex: { tabindex: tabindex },
          })
          tempTabs.tabs.map((item, index) => {
            item.id = index
            return item
          })
          //   setPropertiesPanelData(tempTabs.tabs[tabindex])
          setPropertiesPanelDesignData(PropertiesPanelDataTablist)
          setPropertiesPanelData(RightPanelDefault)
          tempTabs.currentTab = tempTabs.tabs[tabindex]
          return tempTabs
        }
        return tempTabs
      })
    } else if (selecteditem === 'Column') {
      setCoreData((currentState) => {
        const tempTabs = { ...currentState }
        tempTabs.tabs[ItemSelected.selectedindex.tabindex].columns.splice(
          colindex,
          1
        )
        if (
          tempTabs.tabs[ItemSelected.selectedindex.tabindex].columns.length ===
          0
        ) {
          data = FEAddJsonItem(selecteditem)
          tempTabs.tabs[ItemSelected.selectedindex.tabindex].columns.push(data)
        }

        tempTabs.tabs[ItemSelected.selectedindex.tabindex].Properties.Layout =
          tempTabs.tabs[ItemSelected.selectedindex.tabindex].columns.length

        tempTabs.tabs[
          ItemSelected.selectedindex.tabindex
        ].Properties.Column1Width =
          100 /
          tempTabs.tabs[ItemSelected.selectedindex.tabindex].columns.length

        tempTabs.tabs[
          ItemSelected.selectedindex.tabindex
        ].Properties.Column2Width =
          100 /
          tempTabs.tabs[ItemSelected.selectedindex.tabindex].columns.length

        tempTabs.tabs[
          ItemSelected.selectedindex.tabindex
        ].Properties.Column3Width =
          100 /
          tempTabs.tabs[ItemSelected.selectedindex.tabindex].columns.length

        tempTabs.tabs[ItemSelected.selectedindex.tabindex].columns.forEach(
          (dataItem) => {
            dataItem.Properties.Width = parseInt(
              100 /
                tempTabs.tabs[ItemSelected.selectedindex.tabindex].columns
                  .length
            )
          }
        )

        tempTabs.currentTab = tempTabs.tabs[ItemSelected.selectedindex.tabindex]

        // setPropertiesPanelData(
        //   tempTabs.tabs[ItemSelected.selectedindex.tabindex]
        // )
        setPropertiesPanelData(RightPanelDefault)
        setPropertiesPanelDesignData(RightPanelDesignDefault)
        return tempTabs
      })
    } else if (selecteditem === 'Section') {
      setCoreData((currentState) => {
        const tempTabs = { ...currentState }
        tempTabs.tabs[ItemSelected.selectedindex.tabindex].columns[
          colindex
        ].sections.splice(sectindex, 1)
        if (
          tempTabs.tabs[ItemSelected.selectedindex.tabindex].columns[colindex]
            .sections.length === 0
        ) {
          data = FEAddJsonItem(selecteditem)
          tempTabs.tabs[ItemSelected.selectedindex.tabindex].columns[
            colindex
          ].sections.push(data)
        }
        tempTabs.currentTab = tempTabs.tabs[ItemSelected.selectedindex.tabindex]
        setPropertiesPanelData(RightPanelDefault)
        setPropertiesPanelDesignData(RightPanelDesignDefault)
        return tempTabs
      })
    } else if (selecteditem === 'Element') {
      setCoreData((currentState) => {
        const tempTabs = { ...currentState }
        tempTabs.tabs[ItemSelected.selectedindex.tabindex].columns[
          colindex
        ].sections[sectindex].sectionColumns[sectcolindex].elements.splice(
          eleindex,
          1
        )
        tempTabs.currentTab = tempTabs.tabs[ItemSelected.selectedindex.tabindex]
        setPropertiesPanelData(RightPanelDefault)
        setPropertiesPanelDesignData(RightPanelDesignDefault)
        return tempTabs
      })
    }
  }

  function CurrentTabSwap() {
    setCoreData((currentState) => {
      const tempTabs = { ...currentState }
      let current = tempTabs.currentTab
      tempTabs.tabs.find(function (item, i) {
        if (item.id === current.id) {
          return tempTabs.tabs.splice(i, 1)
        }
      })
      tempTabs.tabs.push(current)
      tempTabs.tabs.sort(function (a, b) {
        return a.id - b.id
      })
      return tempTabs
    })
  }

  function onFormSettingsClickHandler() {
    setPropertiesPanelData(state)
    setPropertiesPanelDesignData(FormSettings)
  }

  const onModalButtonClick = () => {
    dispatch({
      type: 'SHOW_POPUP',
    })
  }

  async function onSaveClickHandler() {
    showLoading(true)
    CurrentTabSwap()
    let sysFormPostData = null
    sysFormPostData = {
      SysEntity: entityname,
      FormName:
        (coreData && coreData.header.Properties.HeaderName) || 'Sample Form',
      IsPublished: false,
      FormJSON: JSON.stringify(coreData),
      Criteria: JSON.stringify(state.Criteria),
      Order: parseInt(state.Order),
      UserSelectable: state.UserSelectable,
    }

    if (recordpresent) {
      Promise.all([
        getCoreData(
          'patch',
          `${APIEndPoints.GetSysForm.url}(${state.sysFormData.id})`,
          sysFormPostData
        ),
      ])
        .then(() => {
          showLoading(false)
          showToastMessage('Saved Successfully', 'success')
        })
        .catch((err) => {
          showLoading(false)
          let errorMessage = JSON.stringify(err?.response?.data)
          showToastMessage(errorMessage, 'error')
        })
        .finally(() => {
          showLoading(false)
        })
    } else {
      Promise.all([
        getCoreData('post', APIEndPoints.GetSysForm.url, sysFormPostData),
      ])
        .then((data) => {
          showLoading(false)
          showToastMessage('Saved Successfully', 'success')
          dispatch({
            type: 'SaveForm_Data',
            sysFormData: data[0].data.responseData[0],
          })
          setrecordpresent(true)
        })
        .catch((err) => {
          showLoading(false)
          let errorMessage = JSON.stringify(err?.response?.data)
          showToastMessage(errorMessage, 'error')
        })
        .finally(() => {
          showLoading(false)
          setMode('Edit')
        })
    }
  }

  // function onPublishClickHandler() {
  //   if (recordpresent) {
  //     showLoading(true)
  //     CurrentTabSwap()
  //     let sysFormPostData = null

  //     sysFormPostData = {
  //       SysEntity: entityname,
  //       FormName: coreData && coreData.header.Properties.HeaderName,
  //       IsPublished: true,
  //       FormJSON: JSON.stringify(coreData),
  //       Criteria: JSON.stringify(state.Criteria),
  //       UserSelectable: state.UserSelectable,
  //       Order: parseInt(state.Order),
  //     }

  //     Promise.all([
  //       getCoreData(
  //         'patch',
  //         `${APIEndPoints.GetSysForm.url}(${state.sysFormData.id})`,
  //         sysFormPostData
  //       ),
  //     ])
  //       .then(() => {
  //         showLoading(false)
  //         showToastMessage('Published Successfully', 'success')
  //       })
  //       .catch((err) => {
  //         showLoading(false)
  //         let errorMessage = JSON.stringify(err?.response?.data)
  //         showToastMessage(errorMessage, 'error')
  //       })
  //       .finally(() => {
  //         showLoading(false)
  //         setIsPublished(true)
  //       })
  //   } else {
  //     showToastMessage('Click Save then Click Publish ', 'error')
  //   }
  // }

  function onClickFilterDesigner(filterdata) {
    if (filterdata && JSON.parse(filterdata).filters.length !== 0) {
      dispatch({
        type: 'SaveFilter_Data',
        Criteria: filterdata,
      })
    } else showToastMessage('Atleast one filter is needed to save.', 'error')
  }

  return (
    <>
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        <Grid container spacing={1} className="Grid-container">
          <Grid container item xs={12} spacing={3} className="Grid-panel">
            <>
              <Grid item xs={3} className="Grid-rootleftpanel">
                <Paper className="Left-panel">
                  <div className="Toggle-menu">
                    <FFToggleButton
                      onChangeHandler={TogglehandleChange}
                      Screen={'Form-desginer'}
                      showtext={false}
                      Field={{
                        DefaultValue: formStatus,
                        DataSource: [
                          { Id: 'Components', Name: 'Components' },
                          { Id: 'Entity Fields', Name: 'Entity Fields' },
                          { Id: 'Details', Name: 'Details' },
                        ],
                      }}
                    />
                  </div>

                  <div className="SideBarDrop-main">
                    {formStatus === 'Components' ? (
                      <FEComponentsLeftPanel
                        SupportsActivitie={SupportsActivities}
                        SupportsPayment={SupportsPayments}
                      />
                    ) : formStatus === 'Entity Fields' ? (
                      <FEFieldLeftPanel
                        SidebarData={Fieldlistvalue}
                        onSearchChange={onFieldSearchChange}
                        onDropdownchange={onLeftPanelDropdownchange}
                        EntityFieldDropdownData={EntityFieldDropdownData}
                        EntityFieldDropdownvalues={EntityFieldDropdownvalues}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={7} className="Grid-rootmainpanel">
                <Paper className="Main-panel">
                  <div class="FormDesigner_Header-root">
                    <div
                      class="FormDesigner_Header"
                      name="title"
                      onClick={() => FEHeaderOnClick(coreData.header)}
                    >
                      {coreData && coreData.header.Properties.HeaderName}
                    </div>
                    <div class="FormDesigner_Header-sub" name="subtitle">
                      {/* {coreData.header && coreData.header.Properties.Subtitle} */}
                      {entityname}
                    </div>
                  </div>
                  <div className="FormDesigner">
                    <FEDesignerTab
                      FETabOnClick={FETabOnClick}
                      coreData={coreData}
                      FEColumnOnClick={FEColumnOnClick}
                      FESectionOnClick={FESectionOnClick}
                      FEElementOnClick={FEElementOnClick}
                      FFOnDeleteItem={FFOnDeleteItem}
                    />
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={2} className="Grid-rootrightpanel">
                <FEPropertiesRightPanel
                  Designdata={PropertiesPanelDesignData}
                  Data={PropertiesPanelData}
                  ItemSelected={ItemSelected}
                  EntityData={EntityData}
                  onChangeSaveData={updateRightPanelData}
                  DropCallAPIDefault={true}
                  GridListIddata={GridListIddata}
                  onButtonClick={onModalButtonClick}
                />
              </Grid>
            </>
          </Grid>
        </Grid>
      </DragDropContext>
      <div id="EntityPopup" className="FormDesigner_Modal">
        <CRUDModal open={state.showModal} width="80%">
          <CRUDModal.Header>
            <CRUDModal.Title>Add Filter</CRUDModal.Title>
            <CRUDModal.Close
              onClick={() =>
                dispatch({
                  type: 'HIDE_POPUP',
                })
              }
            >
              <CloseIcon />
            </CRUDModal.Close>
          </CRUDModal.Header>
          <CRUDModal.Content>
            <FilterDesigner
              EntityData={entityname}
              QueryData={state.Criteria}
              handleClick={onClickFilterDesigner}
            />
          </CRUDModal.Content>
        </CRUDModal>
      </div>
    </>
  )
}

export default memo(FormDesigner)
