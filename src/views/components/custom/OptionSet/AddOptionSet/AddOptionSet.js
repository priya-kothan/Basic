import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import './AddOptionSet.css'
import FFTextBox from '../../../base/FFTextBox/FFTextBox'
import FFButton from '../../../base/FFButton/FFButton'
import FFMultilineTextbox from '../../../base/FFMultilineTextbox/FFMultilineTextbox'
import OptionSetOption from '../OptionSetOption/OptionSetOption'
import useAppContext from '../../../hooks/useToast'
import FFAutocomplete from '../../../base/FFAutocomplete/FFAutocomplete'

const AddOptionSet = ({
  data,
  CancelAddOptionSetHandler,
  CreateAddOptionSetHandler,
  ItemForEdit,
  ChildItemForEdit,
}) => {
  const [ChildOptionSetOptiondelItems, setChildOptionSetOptiondelItems] =
    useState(null)

  const initialMValues = {
    Id: 0,
    Name: '',
    DisplayName: '',
    Description: '',
    DataTypeId: '',
  }

  const { showToastMessage } = useAppContext()
  const [values, setValues] = useState(ItemForEdit || initialMValues)

  const handleInputChange = (e, params) => {
    const { name, value } = e?.target ?? params
    setValues({
      ...values,
      [name]: value,
    })
  }

  const dropdownhandleInputChange = (event, params) => {
    const { name, value } = params
    setValues({
      ...values,
      [name]: value,
    })
  }

  const OptionsetHeader = {
    Name: 'Name',
    Value: 'Value',
  }

  const [OptionSetOptionItems, setOptionSetOptionItems] = useState(
    [] || ChildItemForEdit
  )
  const addOptions = (OptionSetOptionvalues, clearHandlechange) => {
    const OptionSetOptionvaluesItm = OptionSetOptionvalues.Name
    if (
      OptionSetOptionvaluesItm &&
      !OptionSetOptionItems.some(
        (item) => item.Name === OptionSetOptionvalues.Name
      )
    ) {
      setOptionSetOptionItems(
        OptionSetOptionItems.concat(OptionSetOptionvalues)
      )
    } else {
      showToastMessage('Options Name Already Exists', 'error')
    }

    clearHandlechange()
  }
  const resetForm = () => {
    setValues(initialMValues)
    setOptionSetOptionItems([])
    setChildOptionSetOptiondelItems(null)
  }
  const onAddOptionSet = (event) => {
    CreateAddOptionSetHandler(
      event,
      values,
      OptionSetOptionItems,
      ChildOptionSetOptiondelItems,
      resetForm
    )
  }
  const onCancelOptionSet = (event) => {
    CancelAddOptionSetHandler(event)
  }

  const deleteItem = (index) => {
    setChildOptionSetOptiondelItems(
      OptionSetOptionItems.filter((_, i) => i === index)
    )
    setOptionSetOptionItems(OptionSetOptionItems.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (ItemForEdit != null) {
      setValues({
        ...ItemForEdit,
      })
    }
    if (ChildItemForEdit != null) {
      setOptionSetOptionItems([...ChildItemForEdit])
    }
  }, [ItemForEdit, ChildItemForEdit])

  return (
    <>
      <div id="EntityPopup" className="addentitymodal">
        <div className="addentitymodal__header">
          <span className="header-title">New Option Set</span>
          <span className="header-close">
            <Close onClick={CancelAddOptionSetHandler} />
          </span>
        </div>
        <div className="addentitymodal__contentmain">
          <div className="addentitymodal__content">
            <FFTextBox
              name="Name"
              label="Name"
              value={values.Name}
              onChange={handleInputChange}
              className="AddOptionSet"
              Field={{
                FieldValue: 'Name',
                FieldLabel: 'Name',
                Validation: { IsRequired: 'False' },
              }}
              Screen="AddOptionSet"
            />
            <FFTextBox
              name="DisplayName"
              label="Display Name"
              value={values.DisplayName}
              onChange={handleInputChange}
              className="AddOptionSet"
              Field={{
                FieldValue: 'DisplayName',
                FieldLabel: 'DisplayName',
                Validation: { IsRequired: 'False' },
              }}
              Screen="AddOptionSet"
            />
            <FFAutocomplete
              id="DataTypeId"
              name="DataTypeId"
              Field={{
                FieldValue: 'DataTypeId',
                FieldLabel: 'Data Type',
                Datasource: data,
                ValueField: 'Id',
                TextField: 'Name',
              }}
              value={values.DataTypeId}
              onChangeHandler={dropdownhandleInputChange}
            />

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
          </div>
          <div className="addentitymodal__content1">
            <div className="addentitymodal__header1">
              <span className="header-title">Options</span>
            </div>
            <OptionSetOption addOptions={addOptions} />
            <div className="Option_table">
              <table id="OptionsetOptions">
                <thead>
                  <tr>
                    <th>{OptionsetHeader.Name}</th>
                    <th>{OptionsetHeader.Value}</th>
                  </tr>
                </thead>
                <tbody>
                  {OptionSetOptionItems &&
                    OptionSetOptionItems.length > 0 &&
                    OptionSetOptionItems.map((option, i) => {
                      return option.Name === '' ? (
                        ''
                      ) : (
                        <tr key={option.Name}>
                          <td> {option.Name}</td>
                          <td>{option.Value}</td>
                          <td>
                            <DeleteRoundedIcon
                              id={`image ${i}`}
                              onClick={() => deleteItem(i)}
                            />
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
            {/* </div>
          </div> */}
          </div>
        </div>
        <div className="addentitymodal__footer">
          <FFButton
            Field={{
              FieldValue: 'AddOptionSet_Btn_SaveField',
              Variant: 'contained',
              FieldLabel: 'Done',
              Type: 'primary',
              Disabled:
                (values && values.Name === undefined) ||
                values.Name.trim() === '' ||
                values.DisplayName === undefined ||
                values.DisplayName.trim() === '' ||
                values.DataTypeId === undefined ||
                values.DataTypeId.trim() === '',
            }}
            className="AddOptionSet_Btn_SaveField"
            onClickHandler={onAddOptionSet}
          />

          <FFButton
            Field={{
              FieldValue: 'AddOptionSet_Btn_Close',
              Variant: 'contained',
              FieldLabel: 'Cancel',
              Type: 'secondary',
            }}
            className="AddOptionSet_Btn_Close"
            onClickHandler={onCancelOptionSet}
          />
        </div>
      </div>
    </>
  )
}

AddOptionSet.propTypes = {
  CancelAddOptionSetHandler: PropTypes.func,
  CreateAddOptionSetHandler: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.string),
  ItemForEdit: PropTypes.objectOf(PropTypes.any),
  ChildItemForEdit: PropTypes.arrayOf(PropTypes.string),
}

AddOptionSet.defaultProps = {
  CancelAddOptionSetHandler: () => null,
  CreateAddOptionSetHandler: () => null,
  data: [],
  ItemForEdit: {},
  ChildItemForEdit: [],
}

export default AddOptionSet
