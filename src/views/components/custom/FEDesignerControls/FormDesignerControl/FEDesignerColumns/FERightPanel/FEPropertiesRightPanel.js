/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'

import './FEPropertiesRightPanel.css'

import FFTextBox from '../../../../../base/FFTextBox/FFTextBox'
import FFMultiSelect from '../../../../../base/FFMultiSelect/FFMultiSelect'
import SwitchButton from '../../../../Switch/SwitchButton'
import FFDropdown from '../../../../../base/FFDropdown/FFDropdown'
import FFLabel from '../../../../../base/FFLabel/FFLabel'
import FFButton from '../../../../../base/FFButton/FFButton'

import getAPIData, { getCoreData } from '../../../../../../../models/api/api'
import APIEndPoints from '../../../../../../../models/api/apiEndpoints'
import useAppContext from '../../../../../../components/hooks/useToast'
import {
  onChangeCreation,
  onChangeCreationWidth,
} from '../FEDesignerColumnMethod'

function TabPanel(props) {
  const { children, value, index, className } = props

  return (
    <div
      className={`tab-panel ${className}`}
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
    >
      {children}
    </div>
  )
}

const FEPropertiesRightPanel = ({
  Designdata,
  ItemSelected,
  Data,
  onChangeSaveData,
  EntityData,
  GridListIddata,
  onButtonClick,
}) => {
  const [tabIndex, setTabIndex] = useState(0)
  const [ListIdData, setListIdData] = useState([])
  const [CallAPIDefault, setCallAPIDefault] = useState(true)
  const [isListIdData, setisListIdData] = useState(true)
  const { showLoading } = useAppContext()

  const handleChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  const onChangeHandler = (event, controlType) => {
    if (event.target) {
      const { name, value } = event.target
      if (controlType && controlType === 'FormSettings') {
        const formdata = { [name]: value }
        onChangeSaveData(name, value, controlType)
      } else {
        const tempTabs = { ...Data }
        tempTabs.Properties[name] = value
        let newdata = tempTabs
        if (name === 'Layout') {
          newdata = onChangeCreation(tempTabs, value, ItemSelected)
        }
        if (
          name === 'Column1Width' ||
          name === 'Column2Width' ||
          name === 'Column3Width' ||
          name === 'SectionColumn1Width' ||
          name === 'SectionColumn2Width' ||
          name === 'SectionColumn3Width' ||
          name === 'SectionColumn4Width'
        ) {
          newdata = onChangeCreationWidth(tempTabs, name, value, ItemSelected)
        }
        onChangeSaveData(newdata, ItemSelected, controlType)
      }
    }
  }

  const onSwitchhandler = (event, value, controlType) => {
    const { name } = event.target
    if (controlType && controlType === 'FormSettings') {
      const formdata = { [name]: value }
      onChangeSaveData(name, value, controlType)
    } else {
      const tempTabs = { ...Data }
      tempTabs.Properties[name] = value

      onChangeSaveData(tempTabs, ItemSelected)
    }
  }

  const onSelectChangeHandler = (event, properties) => {
    if (event.target) {
      const { id, value } = properties
      const tempTabs = { ...Data }
      tempTabs.Properties[id] = value

      if (id === 'ListName') {
        showLoading(true)
        onSearchListName_API(value)
        setisListIdData(true)
      }
      if (id === 'ListId') {
        setisListIdData(false)
      }
      onChangeSaveData(tempTabs, ItemSelected)
    }
  }

  const onMultiSelectChangeHandler = (event) => {
    if (event.target) {
      const { name, value } = event.target
      const tempTabs = { ...Data }
      tempTabs.Properties[name] = value
      onChangeSaveData(tempTabs, ItemSelected)
    }
  }

  async function onSearchListName_API(listname, listId) {
    setListIdData([])
    showLoading(true)
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
      showLoading(false)
    }
    setListIdData(ListData)
    setCallAPIDefault(false)
    if (listId !== '' && listId !== undefined) setisListIdData(false)
  }

  return (
    <div className="FERightPanel_Content">
      <div className="FERightPanel_Content_header">
        <span className="FERightPanel_Content_title">New Tab</span>
      </div>

      <div className="FERightPanel_fields">
        <div className="FETabs-root">
          <AppBar position="static" color="default" elevation={false}>
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              // className={cssClass}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {Designdata.tabs &&
                Designdata.tabs.map((item) => {
                  return (
                    <Tab
                      disableRipple
                      key={item.TabTitle}
                      className={`FFTabcontrol ${
                        item.CSSName ? item.CSSName : ''
                      }`}
                      aria-label="left aligned"
                      label={<>{item.TabTitle}</>}
                    />
                  )
                })}
            </Tabs>
          </AppBar>

          {Designdata.tabs &&
            Designdata.tabs.map((tab, tindex) => {
              return (
                <TabPanel
                  value={tabIndex}
                  index={tindex}
                  key={tindex}
                  className="FEContenttext"
                >
                  <div className="FERightPanel_Items_content">
                    {tab.Sections &&
                      tab.Sections.map((section) => {
                        return (
                          <>
                            <div className="FERightPanel_Sub_header">
                              <span className="FERightPanel_Sub_title">
                                {section.SectionTitle}
                              </span>
                            </div>

                            {Data &&
                              section.Fields &&
                              section.Fields.map((field, index) => {
                                if (section.SectionTitle === 'Form Settings') {
                                  return (
                                    <div
                                      className={`${
                                        field.FieldType !== 'Switch'
                                          ? field.ChildField && field.ChildField
                                            ? 'FERightPanel_fields_Items_Child'
                                            : 'FERightPanel_fields_Items'
                                          : 'FERightPanel_Switch'
                                      }`}
                                    >
                                      {field.FieldType &&
                                        field.FieldType === 'Textbox' && (
                                          <div>
                                            <FFTextBox
                                              name={field.FieldName}
                                              label={field.FieldLabel}
                                              key={index}
                                              id={field.FieldLabel}
                                              className="txtLabel"
                                              // CSSClass={
                                              //   field.CSSClass &&
                                              //   field.CSSClass
                                              // }
                                              Placeholder={field.Placeholder}
                                              value={
                                                Data && Data[field.FieldName]
                                                  ? Data[field.FieldName]
                                                  : field.FieldValue
                                              }
                                              onChangeHandler={(event) =>
                                                onChangeHandler(
                                                  event,
                                                  'FormSettings'
                                                )
                                              }
                                              Field={field}
                                              Screen="FEPropertiesRightPanel"
                                            />
                                          </div>
                                        )}

                                      {field.FieldType &&
                                        field.FieldType === 'Button' && (
                                          <div className="FEPropertiesRightPanel_Button">
                                            <FFButton
                                              id={field.FieldName}
                                              CSSClass="btn_addfilter"
                                              className="btn_addfilter"
                                              type="button"
                                              Field={{
                                                FieldValue: field.FieldName,
                                                FieldLabel: field.FieldLabel,
                                                CSSClass: '',
                                              }}
                                              onClickHandler={onButtonClick}
                                            />
                                          </div>
                                        )}
                                      {field.FieldType &&
                                        field.FieldType === 'Switch' && (
                                          <SwitchButton
                                            name={field.FieldName}
                                            label={field.FieldLabel}
                                            key={index}
                                            id={field.FieldValue}
                                            CSSClass={
                                              field.CSSClass && field.CSSClass
                                            }
                                            value={
                                              Data
                                                ? Data[field.FieldName]
                                                : field.FieldValue
                                            }
                                            checked={
                                              Data
                                                ? Data[field.FieldName]
                                                : field.FieldValue
                                            }
                                            Field={field}
                                            Screen="FEPropertiesRightPanel"
                                            onSwitchhandler={(event, value) =>
                                              onSwitchhandler(
                                                event,
                                                value,
                                                'FormSettings'
                                              )
                                            }
                                          />
                                        )}
                                    </div>
                                  )
                                }

                                if (field.FieldName === 'ListName') {
                                  let ListNameData = field.Datasource
                                  ListNameData.forEach((dataItem) => {
                                    if (dataItem.Id === 'Activity') {
                                      dataItem.disabled =
                                        EntityData.IsSupportActivities
                                          ? false
                                          : true
                                    } else if (dataItem.Id === 'Payment') {
                                      dataItem.disabled =
                                        EntityData.IsSupportPayments
                                          ? false
                                          : true
                                    }
                                  })
                                  field.Datasource = ListNameData
                                  field.DefaultValue =
                                    Data.Properties[field.FieldName]
                                } else if (field.FieldName === 'ListId') {
                                  if (
                                    CallAPIDefault &&
                                    Data.Properties[field.FieldName]
                                  ) {
                                    setCallAPIDefault(false)
                                    onSearchListName_API(
                                      Data.Properties.ListName,
                                      Data.Properties.ListId
                                    )
                                  }

                                  field.DefaultValue =
                                    Data.Properties[field.FieldName]
                                  field.Datasource = GridListIddata
                                } else if (
                                  field.FieldName === 'UpComingItems'
                                ) {
                                  field.DefaultValue =
                                    Data.Properties[field.FieldName]
                                  field.Disabled =
                                    Data && Data.Properties.ShowUpComing
                                      ? false
                                      : true
                                } else if (field.FieldName === 'PastItems') {
                                  field.DefaultValue =
                                    Data.Properties[field.FieldName]
                                  field.Disabled =
                                    Data && Data.Properties.ShowPast
                                      ? false
                                      : true
                                }

                                if (section.SectionTitle === 'Formatting') {
                                  let collength = Data.columns
                                    ? Data.columns.length
                                    : 0
                                  if (
                                    ItemSelected.selecteditem === 'Tab' &&
                                    index <= collength
                                  ) {
                                    return (
                                      <div
                                        key={index}
                                        className={`${
                                          field.FieldType !== 'Switch'
                                            ? 'FERightPanel_fields_Items'
                                            : 'FERightPanel_Switch'
                                        }`}
                                      >
                                        {field.FieldType &&
                                          field.FieldType === 'Textbox' && (
                                            <div>
                                              <FFTextBox
                                                name={field.FieldName}
                                                label={field.FieldLabel}
                                                key={index}
                                                id={field.FieldLabel}
                                                className="txtLabel"
                                                // CSSClass={
                                                //   field.CSSClass &&
                                                //   field.CSSClass
                                                // }
                                                Placeholder={field.Placeholder}
                                                value={
                                                  Data &&
                                                  Data.Properties[
                                                    field.FieldName
                                                  ]
                                                    ? Data.Properties[
                                                        field.FieldName
                                                      ]
                                                    : field.FieldValue
                                                }
                                                onChangeHandler={
                                                  onChangeHandler
                                                }
                                                Field={field}
                                                Screen="FEPropertiesRightPanel"
                                              />
                                            </div>
                                          )}

                                        {field.FieldType &&
                                          field.FieldType === 'Switch' && (
                                            <SwitchButton
                                              name={field.FieldName}
                                              label={field.FieldLabel}
                                              key={index}
                                              id={field.FieldValue}
                                              CSSClass={
                                                field.CSSClass && field.CSSClass
                                              }
                                              value={
                                                Data &&
                                                Data.Properties[field.FieldName]
                                                  ? Data.Properties[
                                                      field.FieldName
                                                    ]
                                                  : field.FieldValue
                                              }
                                              checked={
                                                Data &&
                                                Data.Properties[field.FieldName]
                                                  ? Data.Properties[
                                                      field.FieldName
                                                    ] !== ''
                                                    ? Data.Properties[
                                                        field.FieldName
                                                      ]
                                                    : false
                                                  : field.FieldValue !== ''
                                                  ? field.FieldValue
                                                  : false
                                              }
                                              Field={field}
                                              Screen="FEPropertiesRightPanel"
                                              onSwitchhandler={onSwitchhandler}
                                            />
                                          )}
                                      </div>
                                    )
                                  }
                                  let sectcollength = Data.sectionColumns
                                    ? Data.sectionColumns.length
                                    : 0
                                  if (
                                    ItemSelected.selecteditem === 'Section' &&
                                    index <= sectcollength
                                  ) {
                                    return (
                                      <div
                                        className={`${
                                          field.FieldType !== 'Switch'
                                            ? 'FERightPanel_fields_Items'
                                            : 'FERightPanel_Switch'
                                        }`}
                                      >
                                        {field.FieldType &&
                                          field.FieldType === 'Textbox' && (
                                            <div>
                                              <FFTextBox
                                                name={field.FieldName}
                                                label={field.FieldLabel}
                                                key={index}
                                                id={field.FieldLabel}
                                                className="txtLabel"
                                                // CSSClass={
                                                //   field.CSSClass &&
                                                //   field.CSSClass
                                                // }
                                                Placeholder={field.Placeholder}
                                                value={
                                                  Data &&
                                                  Data.Properties[
                                                    field.FieldName
                                                  ]
                                                    ? Data.Properties[
                                                        field.FieldName
                                                      ]
                                                    : field.FieldValue
                                                }
                                                onChangeHandler={
                                                  onChangeHandler
                                                }
                                                Field={field}
                                                Screen="FEPropertiesRightPanel"
                                              />
                                            </div>
                                          )}

                                        {field.FieldType &&
                                          field.FieldType === 'Switch' && (
                                            <SwitchButton
                                              name={field.FieldName}
                                              label={field.FieldLabel}
                                              key={index}
                                              id={field.FieldValue}
                                              CSSClass={
                                                field.CSSClass && field.CSSClass
                                              }
                                              value={
                                                Data &&
                                                Data.Properties[field.FieldName]
                                                  ? Data.Properties[
                                                      field.FieldName
                                                    ]
                                                  : field.FieldValue
                                              }
                                              Field={field}
                                              Screen="FEPropertiesRightPanel"
                                              onSwitchhandler={onSwitchhandler}
                                              checked={
                                                Data &&
                                                Data.Properties[field.FieldName]
                                                  ? Data.Properties[
                                                      field.FieldName
                                                    ] !== ''
                                                    ? Data.Properties[
                                                        field.FieldName
                                                      ]
                                                    : false
                                                  : field.FieldValue !== ''
                                                  ? field.FieldValue
                                                  : false
                                              }
                                            />
                                          )}
                                      </div>
                                    )
                                  }
                                  if (
                                    ItemSelected.selecteditem === 'Column' ||
                                    ItemSelected.selecteditem === 'Element'
                                  ) {
                                    return (
                                      <div
                                        className={`${
                                          field.FieldType !== 'Switch'
                                            ? 'FERightPanel_fields_Items'
                                            : 'FERightPanel_Switch'
                                        }`}
                                      >
                                        {field.FieldType &&
                                          field.FieldType === 'Textbox' && (
                                            <div>
                                              <FFTextBox
                                                name={field.FieldName}
                                                label={field.FieldLabel}
                                                key={index}
                                                id={field.FieldLabel}
                                                className="txtLabel"
                                                // CSSClass={
                                                //   field.CSSClass &&
                                                //   field.CSSClass
                                                // }
                                                Placeholder={field.Placeholder}
                                                value={
                                                  Data &&
                                                  Data.Properties[
                                                    field.FieldName
                                                  ]
                                                    ? Data.Properties[
                                                        field.FieldName
                                                      ]
                                                    : field.FieldValue
                                                }
                                                onChangeHandler={
                                                  onChangeHandler
                                                }
                                                Field={field}
                                                Screen="FEPropertiesRightPanel"
                                              />
                                            </div>
                                          )}

                                        {field.FieldType &&
                                          field.FieldType === 'Switch' && (
                                            <SwitchButton
                                              name={field.FieldName}
                                              label={field.FieldLabel}
                                              key={index}
                                              id={field.FieldValue}
                                              CSSClass={
                                                field.CSSClass && field.CSSClass
                                              }
                                              value={
                                                Data &&
                                                // values &&
                                                Data.Properties[field.FieldName]
                                                  ? //  values.Properties[
                                                    //     field.FieldValue
                                                    //   ]
                                                    Data.Properties[
                                                      field.FieldName
                                                    ]
                                                  : field.FieldValue
                                              }
                                              Field={field}
                                              Screen="FEPropertiesRightPanel"
                                              onSwitchhandler={onSwitchhandler}
                                              checked={
                                                Data &&
                                                Data.Properties[field.FieldName]
                                                  ? Data.Properties[
                                                      field.FieldName
                                                    ] !== ''
                                                    ? Data.Properties[
                                                        field.FieldName
                                                      ]
                                                    : false
                                                  : field.FieldValue !== ''
                                                  ? field.FieldValue
                                                  : false
                                              }
                                            />
                                          )}
                                      </div>
                                    )
                                  }
                                  return null
                                }

                                return (
                                  <div
                                    className={`${
                                      field.FieldType !== 'Switch'
                                        ? field.ChildField && field.ChildField
                                          ? 'FERightPanel_fields_Items_Child'
                                          : 'FERightPanel_fields_Items'
                                        : 'FERightPanel_Switch'
                                    }`}
                                  >
                                    {field.FieldType &&
                                      field.FieldType === 'Textbox' && (
                                        <div>
                                          <FFTextBox
                                            name={field.FieldName}
                                            label={field.FieldLabel}
                                            key={index}
                                            disabled={
                                              field.FieldName === 'Name'
                                            }
                                            id={field.FieldLabel}
                                            className="txtLabel"
                                            // CSSClass={
                                            //   field.CSSClass && field.CSSClass
                                            // }
                                            Placeholder={field.Placeholder}
                                            value={
                                              Data &&
                                              Data.Properties[field.FieldName]
                                                ? Data.Properties[
                                                    field.FieldName
                                                  ].toString()
                                                : field.FieldValue
                                            }
                                            onChangeHandler={onChangeHandler}
                                            Field={field}
                                            Screen="FEPropertiesRightPanel"
                                          />
                                        </div>
                                      )}
                                    {field.FieldType &&
                                      field.FieldType === 'Dropdown' && (
                                        <div>
                                          <FFDropdown
                                            name={field.FieldName}
                                            label={field.FieldLabel}
                                            value={
                                              Data &&
                                              Data.Properties[field.FieldName]
                                                ? Data.Properties[
                                                    field.FieldName
                                                  ]
                                                : field.FieldValue
                                            }
                                            Field={field}
                                            onChangeHandler={
                                              onSelectChangeHandler
                                            }
                                            onChangeHandler={(
                                              event,
                                              properties
                                            ) =>
                                              onSelectChangeHandler(
                                                event,
                                                properties
                                              )
                                            }
                                            // CSSClass="AddFieldD"
                                            Screen="FEPropertiesRightPanel"
                                          />
                                          {field.FieldLabel === 'ListName' &&
                                            isListIdData && (
                                              <div style={{ color: 'red' }}>
                                                <lable>Select ListId</lable>
                                              </div>
                                            )}
                                        </div>
                                      )}
                                    {field.FieldType &&
                                      field.FieldType === 'Switch' && (
                                        <SwitchButton
                                          name={field.FieldName}
                                          label={field.FieldLabel}
                                          key={index}
                                          id={field.FieldValue}
                                          CSSClass={
                                            field.CSSClass && field.CSSClass
                                          }
                                          value={
                                            Data &&
                                            Data.Properties[field.FieldName]
                                              ? Data.Properties[field.FieldName]
                                              : field.FieldValue
                                          }
                                          Field={field}
                                          Screen="FEPropertiesRightPanel"
                                          onSwitchhandler={onSwitchhandler}
                                          checked={
                                            Data &&
                                            Data.Properties[field.FieldName]
                                              ? Data.Properties[
                                                  field.FieldName
                                                ] !== ''
                                                ? Data.Properties[
                                                    field.FieldName
                                                  ]
                                                : false
                                              : field.FieldValue !== ''
                                              ? field.FieldValue
                                              : false
                                          }
                                        />
                                      )}
                                    {field.FieldType &&
                                      field.FieldType === 'MultiSelect' && (
                                        <FFMultiSelect
                                          id={field.FieldName}
                                          name={field.FieldName}
                                          label={field.FieldLabel}
                                          value={
                                            Data &&
                                            Data.Properties[field.FieldName]
                                              ? Data.Properties[field.FieldName]
                                              : field.FieldValue
                                          }
                                          Field={field}
                                          disabled={field.Disabled}
                                          onChangeHandler={
                                            onMultiSelectChangeHandler
                                          }
                                          // CSSClass="AddFieldD"
                                          Screen="FEPropertiesRightPanel"
                                        />
                                      )}
                                    {field.FieldType &&
                                      field.FieldType === 'Label' && (
                                        <div className="FEPropertiesRightPanel_Label">
                                          <FFLabel
                                            text={field.FieldLabel}
                                            value={
                                              Data &&
                                              Data.Properties[field.FieldName]
                                                ? Data.Properties[
                                                    field.FieldName
                                                  ]
                                                : field.FieldValue
                                            }
                                            Screen="FEPropertiesRightPanel"
                                          />
                                        </div>
                                      )}
                                  </div>
                                )
                              })}
                          </>
                        )
                      })}
                  </div>
                </TabPanel>
              )
            })}
        </div>
      </div>
    </div>
  )
}

FEPropertiesRightPanel.propTypes = {}

FEPropertiesRightPanel.defaultProps = {}

export default FEPropertiesRightPanel
