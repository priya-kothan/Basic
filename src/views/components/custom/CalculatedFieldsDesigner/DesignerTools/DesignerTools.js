import React from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'

import useCalculatedFieldsContext from '../useCalculatedFieldsContext'
import FFAutocomplete from '../../../base/FFAutocomplete/FFAutocomplete'
import useEntityLookups from '../../../hooks/useEntityLookups'
import './DesignerTools.css'

const DesignerTools = () => {
  const { designerData, designerDispatcher } = useCalculatedFieldsContext()
  const entityLookups = useEntityLookups(designerData.baseEntity.Name)

  function onEntityChangeHandler(event, params) {
    designerDispatcher({
      type: 'SET_DESIGNERENTITY',
      payload: { id: params.value, Name: params.text },
    })
  }

  function getFieldTemplate(entityProperties) {
    const fieldTemplate =
      designerData.baseEntity.id === designerData.designerEntity.id
        ? entityProperties.Name
        : `${designerData.designerEntity.Name}.${entityProperties.Name}`

    switch (entityProperties.EntityFieldDataType.Name) {
      case 'Text':
        return `{$${fieldTemplate}}`
      case 'DecimalNumber':
      case 'WholeNumber':
      case 'Phone':
        return `&{$${fieldTemplate}}`
      default:
        return `{$${fieldTemplate}}`
    }
  }

  function onDesignerToolsDragHandler(event, entityProperties) {
    event.dataTransfer.setData(
      'draggedComponent',
      getFieldTemplate(entityProperties)
    )
  }

  return (
    <div className="calculatedfields-designertools">
      <div className="calculatedfields-designertools__header">
        Calculatable Components
      </div>
      <div className="calculatedfields-designertools__calculatablefields_items">
        <div className="calculatedfields-designertools__calculatablefields_item">
          <DragIndicatorIcon />
          <span
            draggable
            onDragStart={(event) =>
              event.dataTransfer.setData('draggedComponent', 'condition')
            }
          >
            Condition
          </span>
        </div>
        <div className="calculatedfields-designertools__calculatablefields_item">
          <DragIndicatorIcon />
          <span
            draggable
            onDragStart={(event) =>
              event.dataTransfer.setData('draggedComponent', 'setvalue')
            }
          >
            Set Value
          </span>
        </div>
      </div>
      <div className="calculatedfields-designertools__header">
        Calculatable Entity Fields
      </div>
      <div className="calculatedfields-designertools__entityfields">
        <FFAutocomplete
          id="selectedentity"
          name="selectedentity"
          className="calculatedfields-designertools__entity"
          Field={{
            FieldValue: 'SelectedEntity',
            FieldLabel: 'Entity',
            Datasource: entityLookups?.optionSets || [designerData.baseEntity],
            ValueField: 'id',
            TextField: 'Name',
            DefaultValue: designerData.designerEntity.id,
          }}
          value={designerData.designerEntity.id}
          onChangeHandler={onEntityChangeHandler}
        />
        <div className="calculatedfields-designertools__entityfields_items">
          {designerData.designerEntityFields.map((designerEntityField) => (
            <div className="calculatedfields-designertools__entityfields_item">
              <DragIndicatorIcon />
              <span
                draggable
                onDragStart={(event) =>
                  onDesignerToolsDragHandler(event, designerEntityField)
                }
              >
                {designerEntityField.Name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DesignerTools
