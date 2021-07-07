/* eslint-disable  */
import React, { memo } from 'react'

import FEDesignerColumns from '../FEDesignerColumns/FEDesignerColumns'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import ClearIcon from '@material-ui/icons/Clear'
import './FEDesignerTab.css'

const grid = 8

const getTabDesignerStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  padding: grid,
})

const FEDesignerTab = ({
  FETabOnClick,
  coreData,
  FEColumnOnClick,
  FESectionOnClick,
  FEElementOnClick,
  FFOnDeleteItem,
}) => {
  const OnClickhandler = (e, tab, index) => {
    e.stopPropagation()
    FETabOnClick(tab, index)
  }
  const OnDeleteItem = (e, data, tabindex) => {
    e.stopPropagation()
    FFOnDeleteItem(data, 'Tab', tabindex)
  }
  const currentTabdata = coreData && coreData.currentTab
  const currentTabbid = coreData && coreData.currentTab.id.toString()
  const createTabdatas = () => {
    const allTabs =
      coreData.tabs &&
      coreData.tabs.map((tab, index) => {
        return (
          <li>
            <button
              className={
                coreData.currentTab.id === tab.id
                  ? 'tab active' + ' FormDesignertab'
                  : 'tab' + ' FormDesignertab'
              }
              onClick={(e) => OnClickhandler(e, tab, index)}
            >
              <div
                class="tab-close-thik"
                onClick={(e) => OnDeleteItem(e, tab, index)}
              >
                <ClearIcon></ClearIcon>
              </div>

              {tab.Properties.DisplayName && tab.Properties.DisplayName}
            </button>
          </li>
        )
      })

    return <ul className="nav nav-tabs">{allTabs}</ul>
  }

  return (
    <div className="container">
      <Droppable droppableId={currentTabbid} type="tab" direction="horizontal">
        {(provided, snapshot) => (
          <div
            className="TabDesigner"
            ref={provided.innerRef}
            style={getTabDesignerStyle(snapshot.isDraggingOver)}
          >
            {coreData && createTabdatas()}
            {currentTabdata && (
              <div>
                <FEDesignerColumns
                  coreData={currentTabdata}
                  FEColumnOnClick={FEColumnOnClick}
                  FESectionOnClick={FESectionOnClick}
                  FEElementOnClick={FEElementOnClick}
                  FFOnDeleteItem={FFOnDeleteItem}
                />
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default memo(FEDesignerTab)
