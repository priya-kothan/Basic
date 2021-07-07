import * as React from 'react'

/*eslint-disable*/

export const Rule = ({
  id,
  parentId,
  field,
  operator,
  property,
  value,
  entity,
  schema: {
    controls,
    getInputType,
    getLevel,
    getOperators,
    getProperties,
    getValueEditorType,
    getValues,
    onPropChange,
    onRuleRemove,
    filterdata,
    stringoperators,
  },
  context,
  currentroot,
}) => {
  const onElementChanged = (property, value, entity, type) => {
    onPropChange(property, value, id, entity, type)
  }

  const onFieldChanged = (value) => {
    onElementChanged('field', value, entity, getInputType(value, '', entity))
  }

  const onOperatorChanged = (value) => {
    onElementChanged('op', value, entity)
  }
  const onPropertyChanged = (value) => {
    onElementChanged('property', value, entity)
  }

  const onValueChanged = (value) => {
    onElementChanged('value', value, entity, getInputType(field, '', entity))
  }

  const removeRule = (event) => {
    event.preventDefault()
    event.stopPropagation()

    onRuleRemove(id, parentId)
  }

  const fieldsData = filterdata.find((f) => f.DisplayName === entity)
  const fieldData =
    fieldsData && fieldsData.EntityField.find((f) => f.Name === field)

  const inputType =
    fieldData?.inputType ?? getInputType(field, operator, entity)
  const ops = fieldData?.ops ?? getOperators(field, entity)
  const properties = fieldData?.properties ?? getProperties(field, entity)
  const valueEditorType =
    fieldData?.valueEditorType ?? getValueEditorType(field, operator, entity)
  const values = fieldData?.values ?? getValues(field, operator, entity)
  const level = getLevel(id)
  return (
    <div className={`rule`} data-rule-id={id} data-level={level}>
      <controls.fieldSelector
        options={(fieldsData && fieldsData.EntityField) || []}
        title={'Fields'}
        value={field}
        operator={operator}
        className={`rule-fields`}
        handleOnChange={onFieldChanged}
        level={level}
        context={context}
      />
      <controls.propertySelector
        field={field}
        fieldData={fieldData}
        title={'Property'}
        options={properties}
        value={property}
        className={`rule-properties`}
        handleOnChange={onPropertyChanged}
        level={level}
        context={context}
      />
      <controls.operatorSelector
        field={field}
        fieldData={fieldData}
        title={'Operators'}
        options={ops}
        value={operator}
        className={`rule-operators`}
        handleOnChange={onOperatorChanged}
        stringoperators={stringoperators}
        type={valueEditorType}
        inputType={inputType}
        currentroot={currentroot}
      />
      <controls.valueEditor
        field={field}
        fieldData={fieldData}
        title={'Value'}
        operator={operator}
        value={value}
        type={valueEditorType}
        inputType={inputType}
        values={values}
        className={`rule-value`}
        handleOnChange={onValueChanged}
        level={level}
        context={context}
        filterdata={filterdata}
      />
      <controls.removeRuleAction
        label={'x'}
        title={'Remove Filter'}
        className={`rule-remove`}
        handleOnClick={removeRule}
        level={level}
        context={context}
      />
    </div>
  )
}

Rule.displayName = 'Rule'
