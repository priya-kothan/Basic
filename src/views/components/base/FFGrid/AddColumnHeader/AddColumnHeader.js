import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { IconButton, InputBase, Popper } from '@material-ui/core'
import {
  Close as CloseIcon,
  Search as SearchIcon,
  ViewWeekSharp as ViewWeekSharpIcon,
} from '@material-ui/icons'

import FFCheckbox from '../../FFCheckbox/FFCheckbox'
import FFAutocomplete from '../../FFAutocomplete/FFAutocomplete'
import './AddColumnHeader.css'

const AddColumnHeader = ({
  displayName,
  columnLists,
  columnApi,
  dispatch,
  showPopup,
  onGridDropdownChangeHandler,
  dropdownData,
  dropdownSelectedData,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [columnListsData, setColumnListsData] = React.useState(columnLists)

  const filtereddata =
    dropdownSelectedData &&
    dropdownData.find((element) => element.id === dropdownSelectedData)

  function onRelatedEntityChangeHandler(e, params) {
    onGridDropdownChangeHandler(e, params)
  }

  function onSearchHandler(searchText) {
    setColumnListsData(() => {
      if (!searchText) return columnLists

      return columnLists.filter((column) =>
        column.DisplayName.toLowerCase().includes(searchText.toLowerCase())
      )
    })
  }

  function onNewColumnAddedHandler(column) {
    columnApi.setColumnVisible(
      column.Name,
      !columnApi.getColumn(column.Name).visible
    )
    const gridViewportRef = document.getElementsByClassName(
      'ag-center-cols-viewport'
    )[0]
    gridViewportRef.scrollLeft = gridViewportRef.scrollWidth
  }

  return (
    <>
      <div className="addcolumnheader">
        <button
          type="button"
          className="addcolumnheader__column"
          onClick={(event) => {
            setAnchorEl(event.currentTarget)
            dispatch({ type: 'SHOW_ADDCOLUMN', showAddColumn: true })
          }}
          onKeyDown={(event) => {
            setAnchorEl(event.currentTarget)
            dispatch({ type: 'SHOW_ADDCOLUMN', showAddColumn: true })
          }}
        >
          <span className="listviewdesigner-header__text">{displayName}</span>
          <span className="listviewdesigner-header__icon">
            <ViewWeekSharpIcon />
          </span>
        </button>
      </div>
      <Popper
        id="designergrid-header-add-column"
        open={showPopup}
        anchorEl={document.getElementsByClassName('ag-header-viewport')[0]}
        placement="bottom-end"
        transition
        // anchorOrigin={{
        //   vertical: 'bottom',
        //   horizontal: 'center',
        // }}
        // transformOrigin={{
        //   vertical: 'top',
        //   horizontal: 'center',
        // }}
      >
        <div className="view-column">
          <div className="view-column__header">
            <div className="view-column__title">View Column</div>
            <div className="view-column__close">
              <IconButton
                disableRipple
                onClick={() => {
                  setAnchorEl(null)
                  dispatch({ type: 'SHOW_ADDCOLUMN', showAddColumn: false })
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className="view-column__autoComplete">
            <FFAutocomplete
              id="relatedentities"
              name="relatedentities"
              className="entitygrid-designer__relatedentities"
              Field={{
                FieldValue: 'RelatedEntity',
                FieldLabel: 'Related Entity',
                Datasource: dropdownData,
                ValueField: 'id',
                TextField: 'Name',
              }}
              value={dropdownSelectedData && dropdownSelectedData}
              onChangeHandler={onRelatedEntityChangeHandler}
            />
          </div>
          <div className="view-column__search">
            <div className="view-column__searchicon">
              <SearchIcon />
            </div>
            <InputBase
              className="view-column__searchinput"
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={({ target }) => onSearchHandler(target.value)}
            />
          </div>
          <hr className="view-column__seperator" />
          <ul className="view-column__columns">
            {columnListsData &&
              columnListsData.map((column) => {
                if (
                  dropdownSelectedData &&
                  dropdownSelectedData === column.EntityId
                ) {
                  return (
                    <li key={column.Name} className="view-column__columnitem">
                      <FFCheckbox
                        Field={{
                          FieldLabel:
                            dropdownData &&
                            dropdownData[0].Name === filtereddata.Name
                              ? column.DisplayName
                              : `${column.DisplayName} (${filtereddata.Name})`,
                          Checked: columnApi.getColumn(column.Name)?.visible,
                          FieldValue: column.Name,
                        }}
                        onChangeHandler={() => onNewColumnAddedHandler(column)}
                      />
                    </li>
                  )
                }

                return null
              })}
          </ul>
        </div>
      </Popper>
    </>
  )
}

AddColumnHeader.defaultProps = {
  column: {},
}

AddColumnHeader.propTypes = {
  displayName: PropTypes.string.isRequired,
  column: PropTypes.shape({ colDef: PropTypes.shape({}) }),
}

export default AddColumnHeader
