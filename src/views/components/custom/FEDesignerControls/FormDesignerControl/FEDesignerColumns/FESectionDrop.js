/* eslint-disable  */
import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
//import FEElementsDrop from "./FEElementDrop";
import ClearIcon from '@material-ui/icons/Clear'
import FESectionColumnDrop from './FESectionColumnDrop'

const getsectionContainersubStyle = (isDragging, draggableStyle) => ({
  background: isDragging ? 'lightgreen' : 'white',
  ...draggableStyle,
})

const getsectionContainerStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'white',
})

const FESectionDrop = ({
  sections,
  type,
  FESectionOnClick,
  FEElementOnClick,
  colindex,
  FFOnDeleteItem,
}) => {
  const OnClickhandler = (e, data, colindex, sectindex) => {
    e.stopPropagation()
    FESectionOnClick(data, colindex, sectindex)
  }
  const OnDeleteItem = (e, data, colindex, sectindex) => {
    e.stopPropagation()
    FFOnDeleteItem(data, 'Section', '', colindex, sectindex)
  }
  return (
    <Droppable droppableId={type} type={`section`}>
      {(provided, snapshot) => (
        <div
          className="sectionContainer"
          ref={provided.innerRef}
          style={getsectionContainerStyle(snapshot.isDraggingOver)}
        >
          {sections &&
            sections.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    className="sectionContainer-sub"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getsectionContainersubStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                    onClick={(e) => OnClickhandler(e, item, colindex, index)}
                  >
                    <div
                      class="section-close-thik"
                      onClick={(e) => OnDeleteItem(e, item, colindex, index)}
                    >
                      <ClearIcon></ClearIcon>
                    </div>

                    {item.Properties.Name === 'Grid' ||
                    item.Properties.Name === 'Timeline' ||
                    item.Properties.Name === 'Activity' ||
                    item.Properties.Name === 'Payment'
                      ? item.Properties.DisplayName
                      : ''}

                    <FESectionColumnDrop
                      sectionColumns={item.sectionColumns}
                      type={item.id}
                      FEElementOnClick={FEElementOnClick}
                      colindex={colindex}
                      sectindex={index}
                      FFOnDeleteItem={FFOnDeleteItem}
                    />
                  </div>
                )}
              </Draggable>
            ))}
        </div>
      )}
    </Droppable>
  )
}

export default FESectionDrop
