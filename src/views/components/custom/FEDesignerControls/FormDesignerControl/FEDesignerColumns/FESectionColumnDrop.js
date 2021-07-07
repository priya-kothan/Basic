/* eslint-disable  */
import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import FEElementsDrop from './FEElementDrop'

const getsectioncolumnContainersubStyle = (isDragging, draggableStyle) => ({
  background: isDragging ? 'lightgreen' : 'white',
  ...draggableStyle,
})

const getsectioncolumnContainerStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'white',
})

const FESectionColumnDrop = ({
  sectionColumns,
  type,
  FEElementOnClick,
  colindex,
  sectindex,
  FFOnDeleteItem,
}) => {
  return (
    <Droppable droppableId={type} type={`sectioncolumn`}>
      {(provided, snapshot) => (
        <div
          className="sectioncolumnContainer"
          ref={provided.innerRef}
          style={getsectioncolumnContainerStyle(snapshot.isDraggingOver)}
        >
          {sectionColumns &&
            sectionColumns.map((item, index) => (
              <div
                className="sectioncolumnContainer-sub"
                style={{ width: `${item.Properties.Width}%` }}
              >
                {/* {item.content} */}
                <FEElementsDrop
                  elements={item.elements}
                  type={item.id}
                  FEElementOnClick={FEElementOnClick}
                  colindex={colindex}
                  sectindex={sectindex}
                  sectcolindex={index}
                  FFOnDeleteItem={FFOnDeleteItem}
                />
              </div>
            ))}
        </div>
      )}
    </Droppable>
  )
}

export default FESectionColumnDrop
