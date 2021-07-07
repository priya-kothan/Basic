/* eslint-disable  */
import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import FESectionDrop from './FESectionDrop'
import ClearIcon from '@material-ui/icons/Clear'
import './FEDesignerColumns.css'

const grid = 8

const getDesignerColumnsubStyle = (isDragging, draggableStyle, Width) => ({
  background: isDragging ? 'red' : 'white',
  width: `${Width}%`,
  ...draggableStyle,
})

const getDesignerColumnStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  padding: grid,
})

const FEDesignerColumns = ({
  coreData,
  FEColumnOnClick,
  FESectionOnClick,
  FEElementOnClick,
  FFOnDeleteItem,
}) => {
  const OnClickhandler = (e, data, colindex) => {
    e.stopPropagation()
    FEColumnOnClick(data, colindex)
  }
  const OnDeleteItem = (e, data, colindex) => {
    e.stopPropagation()
    FFOnDeleteItem(data, 'Column', '', colindex)
  }

  return (
    // <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
    <Droppable droppableId="droppable" type="column" direction="horizontal">
      {(provided, snapshot) => (
        <div
          className="DesignerColumn"
          ref={provided.innerRef}
          style={getDesignerColumnStyle(snapshot.isDraggingOver)}
        >
          {coreData.columns &&
            coreData.columns.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    className="DesignerColumn-sub"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getDesignerColumnsubStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style,
                      item.Properties.Width
                    )}
                    onClick={(e) => OnClickhandler(e, item, index)}
                  >
                    <div
                      class="column-close-thik"
                      onClick={(e) => OnDeleteItem(e, item, index)}
                    >
                      <ClearIcon></ClearIcon>
                    </div>

                    {item.Properties.DisplayName}

                    <FESectionDrop
                      sections={item.sections}
                      type={item.id}
                      FESectionOnClick={FESectionOnClick}
                      FEElementOnClick={FEElementOnClick}
                      colindex={index}
                      FFOnDeleteItem={FFOnDeleteItem}
                    />
                  </div>
                )}
              </Draggable>
            ))}
        </div>
      )}
    </Droppable>
    // </DragDropContext>
  )
}

export default FEDesignerColumns
