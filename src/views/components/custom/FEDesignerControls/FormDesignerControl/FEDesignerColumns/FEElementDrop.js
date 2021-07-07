/* eslint-disable  */
import React from 'react'
import ClearIcon from '@material-ui/icons/Clear'
import { Droppable, Draggable } from 'react-beautiful-dnd'

const getElementContainersubStyle = (isDragging, draggableStyle, Width) => ({
  background: isDragging ? 'lightgreen' : 'white',
  width: `${Width}%`,
  ...draggableStyle,
})

const getElementContainerStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'white',
})

const FEElementDrop = ({
  elements,
  type,
  FEElementOnClick,
  colindex,
  sectindex,
  sectcolindex,
  FFOnDeleteItem,
}) => {
  const OnClickhandler = (
    e,
    data,
    colindex,
    sectindex,
    sectcolindex,
    eleindex
  ) => {
    e.stopPropagation()
    FEElementOnClick(data, colindex, sectindex, sectcolindex, eleindex)
  }

  const OnDeleteItem = (
    e,
    data,
    colindex,
    sectindex,
    sectcolindex,
    eleindex
  ) => {
    e.stopPropagation()
    FFOnDeleteItem(
      data,
      'Element',
      '',
      colindex,
      sectindex,
      sectcolindex,
      eleindex
    )
  }

  return (
    <Droppable droppableId={type} type={`element`}>
      {(provided, snapshot) => (
        <div
          className="ElementContainer"
          ref={provided.innerRef}
          style={getElementContainerStyle(snapshot.isDraggingOver)}
        >
          {elements &&
            elements.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    className="ElementContainer-sub"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getElementContainersubStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style,
                      item.Properties.Width
                    )}
                    onClick={(e) =>
                      OnClickhandler(
                        e,
                        item,
                        colindex,
                        sectindex,
                        sectcolindex,
                        index
                      )
                    }
                    colindex={colindex}
                    sectindex={sectindex}
                    sectcolindex={sectcolindex}
                    eleindex={index}
                  >
                    <div
                      class="element-close-thik"
                      onClick={(e) =>
                        OnDeleteItem(
                          e,
                          item,
                          colindex,
                          sectindex,
                          sectcolindex,
                          index
                        )
                      }
                    >
                      <ClearIcon></ClearIcon>
                    </div>
                    {item.Properties.Name}
                  </div>
                )}
              </Draggable>
            ))}
        </div>
      )}
    </Droppable>
  )
}

export default FEElementDrop
