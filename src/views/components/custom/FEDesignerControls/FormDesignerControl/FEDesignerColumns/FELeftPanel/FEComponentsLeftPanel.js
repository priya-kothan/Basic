/* eslint-disable  */
import React, { useState } from 'react'

import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Grid } from '@material-ui/core'

import FFdoticon from './FFdoticon'
import FFSearchBox from '../../../../../base/SearchBox/SearchBox'

import { Tabcomponentdatalist, componentdatalist, LayoutDatalist } from './data'

const FEComponentsLeftPanel = ({ SupportsActivitie, SupportsPayment }) => {
  let componentsearchValue = ''
  const [Componentlistvalue, setcomponentlistvalue] = useState(
    componentdatalist
  )
  const [Componentlistvalueitem, setcomponentlistvalueitem] = useState(
    componentdatalist
  )

  const [Layoutdatavalue, setlayoutdatavalue] = useState(LayoutDatalist)
  const [Layoutdatavalueitem, setlayoutdatavalueitem] = useState(LayoutDatalist)

  const [Tabcomponentdatavalue, setTabcomponentdatavalue] = useState(
    Tabcomponentdatalist
  )
  const [Tabcomponentdatavalueitem, setTabcomponentdatavalueitem] = useState(
    Tabcomponentdatalist
  )

  const onComponentSearchChange = (event) => {
    componentsearchValue = event.target.value.toLowerCase()
    const resultvalue = Componentlistvalueitem.filter((el) => {
      let searchValue1 = el.Name.toLowerCase()
      return searchValue1.indexOf(componentsearchValue) !== -1
    })
    setcomponentlistvalue(resultvalue)
    const resultvalue1 = Layoutdatavalueitem.filter((el) => {
      let searchdataValue = el.Name.toLowerCase()
      return searchdataValue.indexOf(componentsearchValue) !== -1
    })
    setlayoutdatavalue(resultvalue1)

    const resultvalue3 = Tabcomponentdatavalueitem.filter((el) => {
      let searchdataValue = el.Name.toLowerCase()
      return searchdataValue.indexOf(componentsearchValue) !== -1
    })
    setTabcomponentdatavalue(resultvalue3)
  }

  return (
    <div className="SideBar">
      <div className="searchboxpanel">
        <FFSearchBox
          Field="SearchList"
          CSSClass=""
          searchicon={true}
          className="SearchList"
          OnValueChange={onComponentSearchChange}
          placeholder="Search Components"
        ></FFSearchBox>
      </div>

      <div className="SideBar_Component">
        <div className="inputheader">
          <b>Layout</b>
        </div>

        {Tabcomponentdatavalue && (
          <Droppable
            droppableId="droppable"
            droppableId="newTabs"
            direction="vertical"
            isDropDisabled
            type="tab"
          >
            {(provided) => (
              <div
                className="SideBarDrop"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {Tabcomponentdatavalue &&
                  Tabcomponentdatavalue.map((section, index) => {
                    return (
                      <div className="ToolWrapper">
                        <Draggable
                          key={section.Id}
                          draggableId={section.Id}
                          index={index}
                          disableInteractiveElementBlocking
                        >
                          {(dragProvided, snapshot) => (
                            <>
                              <Grid
                                container
                                className="iconselect"
                                key={section.Id}
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                              >
                                <Grid item xs={1.5} className="doticon">
                                  {<FFdoticon />} &nbsp;&nbsp;
                                </Grid>
                                <Grid item xs={6}>
                                  &nbsp; {section.Name}
                                </Grid>
                              </Grid>
                              {snapshot.isDragging && (
                                <Grid container className="iconselect">
                                  <Grid item xs={1.5} className="doticon">
                                    {<FFdoticon />}
                                    &nbsp;&nbsp;
                                  </Grid>
                                  <Grid item xs={6}>
                                    &nbsp;&nbsp;
                                    {section.Name}
                                  </Grid>
                                </Grid>
                              )}
                            </>
                          )}
                        </Draggable>
                      </div>
                    )
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}

        {Componentlistvalue && (
          <Droppable
            droppableId="droppable"
            droppableId="newSections"
            direction="vertical"
            isDropDisabled
            type="section"
          >
            {(provided) => (
              <div
                className="SideBarDrop"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {Componentlistvalue &&
                  Componentlistvalue.map((section, index) => {
                    return (
                      <div className="ToolWrapper">
                        <Draggable
                          key={section.Id}
                          draggableId={section.Id}
                          index={index}
                          disableInteractiveElementBlocking
                        >
                          {(dragProvided, snapshot) => (
                            <>
                              <Grid
                                container
                                className="iconselect"
                                key={section.Id}
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                              >
                                <Grid item xs={1.5} className="doticon">
                                  {<FFdoticon />} &nbsp;&nbsp;
                                </Grid>
                                <Grid item xs={6}>
                                  &nbsp; {section.Name}
                                </Grid>
                              </Grid>
                              {snapshot.isDragging && (
                                <Grid container className="iconselect">
                                  <Grid item xs={1.5} className="doticon">
                                    {<FFdoticon />}
                                    &nbsp;&nbsp;
                                  </Grid>
                                  <Grid item xs={6}>
                                    &nbsp;&nbsp;
                                    {section.Name}
                                  </Grid>
                                </Grid>
                              )}
                            </>
                          )}
                        </Draggable>
                      </div>
                    )
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}

        <div className="inputheader">
          <b>Related Data</b>
        </div>

        {Layoutdatavalue && (
          <Droppable
            droppableId="droppable"
            droppableId="newSections"
            direction="vertical"
            isDropDisabled
            type="section"
          >
            {(provided) => (
              <div
                className="SideBarDrop"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {Layoutdatavalue &&
                  Layoutdatavalue.map((section, index) => {
                    return (
                      <div
                        className={`ToolWrapper${
                          section.Name === 'Activity'
                            ? SupportsActivitie === false
                              ? ' disable'
                              : ''
                            : section.Name === 'Payment'
                            ? SupportsPayment === false
                              ? ' disable'
                              : ''
                            : ''
                        }`}
                      >
                        <Draggable
                          key={section.Id}
                          draggableId={section.Name}
                          index={index}
                          disableInteractiveElementBlocking
                        >
                          {(dragProvided, snapshot) => (
                            <>
                              <Grid
                                container
                                className="iconselect"
                                key={section.Id}
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                              >
                                <Grid item xs={1.5} className="doticon">
                                  {<FFdoticon />} &nbsp;&nbsp;
                                </Grid>
                                <Grid item xs={6}>
                                  &nbsp; {section.Name}
                                </Grid>
                              </Grid>
                              {snapshot.isDragging && (
                                <Grid container className="iconselect">
                                  <Grid item xs={1.5} className="doticon">
                                    {<FFdoticon />}
                                    &nbsp;&nbsp;
                                  </Grid>
                                  <Grid item xs={6}>
                                    &nbsp;&nbsp;
                                    {section.Name}
                                  </Grid>
                                </Grid>
                              )}
                            </>
                          )}
                        </Draggable>
                      </div>
                    )
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </div>
    </div>
  )
}

export default FEComponentsLeftPanel
