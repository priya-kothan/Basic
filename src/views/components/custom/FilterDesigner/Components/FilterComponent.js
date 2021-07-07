import React, { useEffect, useState } from 'react'
import cloneDeep from 'lodash/cloneDeep'

import ActionElement from '../controls/ActionElement'
import ValueEditor from '../controls/ValueEditor'
import ValueSelector from '../controls/ValueSelector'
import EntitySelector from '../controls/EntitySelector'
import { Rule } from './Rule'
import { RuleGroup } from './RuleGroup'
import { findRule, generateValidQuery, getLevel, isRuleGroup } from '../utils'
import './filterComponent.css'

const defaultControlElements = {
  addGroupAction: ActionElement,
  removeGroupAction: ActionElement,
  addRuleAction: ActionElement,
  removeRuleAction: ActionElement,
  combinatorSelector: ValueSelector,
  fieldSelector: ValueSelector,
  operatorSelector: ValueSelector,
  propertySelector: ValueSelector,
  valueEditor: ValueEditor,
  ruleGroup: RuleGroup,
  rule: Rule,
  entitySelector: EntitySelector,
  masterEntityfield: ValueSelector,
  parentEntityfield: ValueSelector,
}

const FilterComponent = ({
  query,
  operators, //= defaultOperators,
  combinators, //= defaultCombinators,
  properties,
  enableMountQueryChange = true,
  getDefaultField,
  getDefaultValue,
  getOperators,
  getProperties,
  getValueEditorType,
  getInputType,
  getValues,
  onQueryChange,
  showCombinatorsBetweenRules = false,
  resetOnFieldChange = true,
  resetOnOperatorChange = false,
  context,
  filterdata,
  stringoperators,
}) => {
  const getInitialQuery = () => {
    return (query && generateValidQuery(query)) || createRuleGroup()
  }

  const createRule = (entity) => {
    let field = ''
    const fieldsData = filterdata.find((f) => f.DisplayName === entity)
    if (fieldsData && fieldsData.EntityField) {
      field = fieldsData.EntityField[0].Name
    }

    if (getDefaultField) {
      if (typeof getDefaultField === 'string') {
        field = getDefaultField
      } else {
        field = getDefaultField(fieldsData.EntityField)
      }
    }

    const f =
      fieldsData && fieldsData.EntityField.find((item) => item.Name === field)
    const value = f?.defaultValue ?? f.value // ''
    // const propertydata = getPropertyMain(field, entity)
    const generateID = () => Math.random().toString()
    return {
      id: `r-${generateID()}`,
      field,
      value,
      op: getOperatorsMain(field, entity)[0].Name,
      property: '', // propertydata.length !== 0 ? propertydata[0].Name : '',
      // valueType: f.ControlType,
    }
  }

  const createRuleGroup = () => {
    const generateID = () => Math.random().toString()
    return {
      id: `g-${generateID()}`,
      type: 'group',
      filters: [],
      entity: '',
      groupType: combinators[0].Name,
      parentEntityfield: '',
      masterEntityfield: '',
    }
  }

  const getValueEditorTypeMain = (field, op, entity) => {
    if (getValueEditorType) {
      const vet = getValueEditorType(field, op, entity)
      if (vet) return vet
    }
    // return 'text'
    const fieldsData = filterdata.find((f) => f.DisplayName === entity)
    const fieldData =
      fieldsData && fieldsData.EntityField.find((f) => f.Name === field)
    return (fieldData && fieldData.ControlType) || 'text'
  }

  const getInputTypeMain = (field, op, entity) => {
    if (getInputType) {
      const inputType = getInputType(field, op, entity)
      if (inputType) return inputType
    }
    const fieldsData = filterdata.find((f) => f.DisplayName === entity)
    const fieldData =
      fieldsData && fieldsData.EntityField.find((f) => f.Name === field)
    // return 'text'
    return (fieldData && fieldData.ControlType) || 'text'
  }

  const getValuesMain = (field, op, entity) => {
    const fieldsData = filterdata.find((f) => f.DisplayName === entity)
    const fieldData =
      fieldsData && fieldsData.EntityField.find((f) => f.Name === field)

    /* istanbul ignore if */
    if (fieldData?.values) {
      return fieldData.values
    }
    if (getValues) {
      const vals = getValues(field, op, entity)
      if (vals) return vals
    }

    return []
  }

  const getOperatorsMain = (field, entity) => {
    const fieldsData = filterdata.find((f) => f.DisplayName === entity)
    const fieldData =
      fieldsData && fieldsData.EntityField.find((f) => f.Name === field)
    if (fieldData?.operators) {
      return fieldData.operators
    }
    if (getOperators) {
      const ops = getOperators(field, entity)
      if (ops) return ops
    }
    return operators || ''
  }

  const getPropertyMain = (field, entity) => {
    const fieldsData = filterdata.find((f) => f.DisplayName === entity)
    const fieldData =
      fieldsData && fieldsData.EntityField.find((f) => f.Name === field)

    if (fieldData?.properties) {
      return fieldData.properties
    }
    if (getProperties) {
      const ops = getProperties(field, entity)
      if (ops) return ops
    }
    return properties || ''
  }

  const getRuleDefaultValue = (rule, entity) => {
    const fieldsData = filterdata.find((f) => f.DisplayName === entity)
    const fieldData =
      fieldsData &&
      fieldsData.EntityField.find(
        (f) => f.Name === rule.field
      ) /* istanbul ignore next */
    if (
      fieldData?.defaultValue !== undefined &&
      fieldData.defaultValue !== null
    ) {
      return fieldData.defaultValue
    }
    if (getDefaultValue) {
      return getDefaultValue(rule, entity)
    }

    let value = ''

    const values = getValuesMain(rule.field, rule.op, entity)

    if (values.length) {
      value = values[0].name
    } else {
      const editorType = getValueEditorTypeMain(rule.field, rule.op, entity)

      if (editorType === 'Checkbox') {
        value = false
      }
    }

    return value
  }

  const onRuleAdd = (rule, parentId, entity) => {
    const rootCopy = cloneDeep(root)
    const parent = findRule(parentId, rootCopy)

    const fieldsData = filterdata.find((f) => f.DisplayName === entity)
    const fieldData =
      fieldsData && fieldsData.EntityField.find((f) => f.Name === rule.field)
    const value = fieldData?.defaultValue ?? getRuleDefaultValue(rule, entity)
    /* istanbul ignore else */
    if (parent) {
      parent.filters.push({ ...rule, value })
      setRoot(rootCopy)
      notifyQueryChange(rootCopy)
    }
  }

  const onGroupAdd = (group, parentId) => {
    const rootCopy = cloneDeep(root)
    const parent = findRule(parentId, rootCopy)
    if (parent) {
      parent.filters.push(group)
      setRoot(rootCopy)
      notifyQueryChange(rootCopy)
    }
  }
  const onremoveRulesdata = (rule) => {
    const temprule = rule
    const tempfilterlist = []
    rule.filters.forEach((item) => {
      if (item.id.includes('g-')) tempfilterlist.push(item)
    })
    temprule.filters = tempfilterlist
    return temprule
  }

  const onPropChange = (prop, value, ruleId, entity, type) => {
    const rootCopy = cloneDeep(root)
    const rule = findRule(ruleId, rootCopy)
    if (rule) {
      if (prop === 'entity') {
        if (rule.filters && rule.filters.length === 0) {
          Object.assign(rule, {
            [prop]: value,
            entityType:
              filterdata[0].Name !== value ? 'RelatedEntity' : 'BaseEntity',
            parentEntityfield: '',
            masterEntityfield: '',
          })
        } else {
          const ruledata = onremoveRulesdata(rule)
          Object.assign(ruledata, {
            [prop]: value,
            entityType:
              filterdata[0].Name !== value ? 'RelatedEntity' : 'BaseEntity',
            parentEntityfield: '',
            masterEntityfield: '',
          })
        }
      } else if (prop === 'masterEntityfield' || prop === 'parentEntityfield') {
        if (rule.filters && rule.filters.length === 0) {
          Object.assign(rule, {
            [prop]: value,
            entityType:
              filterdata[0].Name !== value ? 'RelatedEntity' : 'BaseEntity',
          })
        } else {
          const ruledata = onremoveRulesdata(rule)
          Object.assign(ruledata, {
            [prop]: value,
            entityType:
              filterdata[0].Name !== value ? 'RelatedEntity' : 'BaseEntity',
          })
        }
      } else if (prop === 'value') {
        Object.assign(rule, {
          [prop]: value,
        })
      } else if (prop === 'property') {
        Object.assign(rule, {
          [prop]: value,
          op: '',
        })
      } else {
        Object.assign(rule, {
          [prop]: value,
          // valueType: type,
        })
      }
      // Reset op and set default value for field change
      if (resetOnFieldChange && prop === 'field') {
        Object.assign(rule, {
          op: getOperatorsMain(rule.field, entity)[0].Name,
          value: getRuleDefaultValue(rule, entity),
          property: '',
          // valueType: type,
        })
      }

      if (resetOnOperatorChange && prop === 'op') {
        Object.assign(rule, {
          value: getRuleDefaultValue(rule, entity),
        })
      }
      setRoot(rootCopy)
      notifyQueryChange(rootCopy)
    }
  }

  const onRuleRemove = (ruleId, parentId) => {
    const rootCopy = cloneDeep(root)
    const parent = findRule(parentId, rootCopy)
    if (parent) {
      const index = parent.filters.findIndex((x) => x.id === ruleId)
      parent.filters.splice(index, 1)
      setRoot(rootCopy)
      notifyQueryChange(rootCopy)
    }
  }

  const onGroupRemove = (groupId, parentId) => {
    const rootCopy = cloneDeep(root)
    const parent = findRule(parentId, rootCopy)
    if (parent) {
      const index = parent.filters.findIndex((x) => x.id === groupId)
      parent.filters.splice(index, 1)
      setRoot(rootCopy)
      notifyQueryChange(rootCopy)
    }
  }

  const getLevelFromRoot = (id) => {
    return getLevel(id, 0, root)
  }

  const notifyQueryChange = (newRoot) => {
    if (onQueryChange) {
      const newQuery = cloneDeep(newRoot)
      onQueryChange(newQuery)
    }
  }

  const [root, setRoot] = useState(getInitialQuery())

  const schema = {
    combinators,
    createRule,
    createRuleGroup,
    onRuleAdd,
    onGroupAdd,
    onRuleRemove,
    onGroupRemove,
    onPropChange,
    getLevel: getLevelFromRoot,
    isRuleGroup,
    controls: {
      ...defaultControlElements,
    },
    getOperators: getOperatorsMain,
    getProperties: getPropertyMain,
    getValueEditorType: getValueEditorTypeMain,
    getInputType: getInputTypeMain,
    getValues: getValuesMain,
    showCombinatorsBetweenRules,
    filterdata,
    stringoperators,
  }

  useEffect(() => {
    setRoot(generateValidQuery(query || getInitialQuery()))
  }, [query])

  useEffect(() => {
    if (enableMountQueryChange) {
      notifyQueryChange(root)
    }
  }, [])

  return (
    <div className="FilterComponent">
      <schema.controls.ruleGroup
        filters={root.filters}
        groupType={root.groupType}
        entity={root.entity}
        schema={schema}
        id={root.id}
        context={context}
        parentEntityfield={root.parentEntityfield}
        masterEntityfield={root.masterEntityfield}
      />
    </div>
  )
}

FilterComponent.displayName = 'FilterComponent'
export default FilterComponent
