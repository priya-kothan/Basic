/* eslint-disable  */
import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import FFdoticon from './FFdoticon'
import { Grid } from '@material-ui/core'
import FFSearchBox from '../../../../../base/SearchBox/SearchBox'
import FFAutocomplete from '../../../../../base/FFAutocomplete/FFAutocomplete'

const FEFieldLeftPanel = ({
  SidebarData,
  onSearchChange,
  onDropdownchange,
  EntityFieldDropdownData,
  EntityFieldDropdownvalues,
}) => {
  const SidebarDatas = SidebarData

  const handleInputChanged = (event, data) => {
    onDropdownchange(event.target.innerText, data)
  }

  return (
    <div className="SideBar">
      <div className="Autocompletepanel">
        <Grid item xs={12} className="FEFieldLeftPanel_Autocomplete">
          <FFAutocomplete
            id="Entity"
            name="Entity"
            Field={{
              FieldValue: 'Entity',
              FieldLabel: 'Entity',
              Datasource: EntityFieldDropdownData,
              ValueField: 'Id',
              TextField: 'Name',
            }}
            value={EntityFieldDropdownvalues}
            onChangeHandler={handleInputChanged}
          />
        </Grid>
      </div>
      <div className="searchboxpanel">
        <Grid item xs={12} className="FEFieldLeftPanel_SearchList">
          <FFSearchBox
            Field="SearchList"
            CSSClass=""
            searchicon={true}
            className="SearchList"
            OnValueChange={onSearchChange}
            placeholder="Search Entity Fields"
          ></FFSearchBox>
        </Grid>
      </div>
      <div className="SideBar_Field">
        {SidebarDatas && (
          <Droppable
            droppableId="newElements"
            direction="vertical"
            isDropDisabled
            type="element"
          >
            {(provided) => (
              <div
                className="SideBarDrop"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {SidebarDatas &&
                  SidebarDatas.map((element, index) => {
                    return (
                      <div className="ToolWrapper">
                        <Draggable
                          key={element.Id}
                          draggableId={element.Name + '~' + element.DataTypeId}
                          index={index}
                          disableInteractiveElementBlocking
                        >
                          {(dragProvided, snapshot) => (
                            <>
                              <Grid
                                container
                                className="iconselect"
                                key={element.Id}
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                              >
                                <Grid item xs={1.5} className="doticon">
                                  {<FFdoticon />} &nbsp;&nbsp;
                                </Grid>
                                <Grid item xs={1.5} className="datatypeicon">
                                  {element.Icon &&
                                    React.createElement(element.Icon)}
                                </Grid>
                                <Grid item xs={6}>
                                  &nbsp; {element.Name}
                                </Grid>
                              </Grid>

                              {snapshot.isDragging && (
                                <Grid container className="iconselect">
                                  <Grid item xs={1.5} className="doticon">
                                    {<FFdoticon />}
                                    &nbsp;&nbsp;
                                  </Grid>
                                  <Grid item xs={1.5} className="datatypeicon">
                                    {element.Icon &&
                                      React.createElement(element.Icon)}
                                  </Grid>
                                  <Grid item xs={6}>
                                    &nbsp;&nbsp;
                                    {element.Name}
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

export default FEFieldLeftPanel
