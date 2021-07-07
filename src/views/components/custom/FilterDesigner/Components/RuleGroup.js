import { Fragment } from 'react'
import * as React from 'react'
import { isEmpty } from 'lodash'

/* eslint-disable */

export const RuleGroup = ({
  id,
  parentId,
  groupType = 'and',
  entity = '',
  filters = [],
  translations,
  schema,
  context,
  parentEntityfield,
  masterEntityfield,
  parentEntitylist = [],
  masterEntitylist = [],
}) => {
  const {
    combinators,
    controls,
    createRule,
    createRuleGroup,
    getLevel,
    isRuleGroup,
    onGroupAdd,
    onGroupRemove,
    onPropChange,
    onRuleAdd,
    showCombinatorsBetweenRules,
    filterdata,
    stringoperators,
  } = schema

  let entitiesdlist = []
  let relatedentitiesdlist = {}

  const entities =
    entity !== '' && entity.split('(')
      ? entity.split('(').forEach((item) => {
          entitiesdlist.push(
            filterdata.find((f) => f.Name === item.replace(')', ''))
          )
        })
      : entitiesdlist.push(entity)

  // const fieldsData =
  //   entity !== '' ? filterdata.find((f) => f.DisplayName === entity) : entity

  entitiesdlist.forEach((item, idx) => {
    if (entitiesdlist.length === 3) {
      if (idx === 1) {
        entitiesdlist[idx].EntityField.map((entityField) => {
          if (entityField.EntityFieldDataType.Name === 'Lookup') {
            if (entitiesdlist[0].Id === entityField.Lookup) {
              parentEntitylist.push(entityField)
            }
          }
        })
      } else if (idx === 2) {
        entitiesdlist[idx].EntityField.map((entityField) => {
          if (entityField.EntityFieldDataType?.Name === 'Lookup') {
            if (entitiesdlist[1].Id === entityField.Lookup) {
              masterEntitylist.push(entityField)
            }
          }
        })
      }
    } else if (entitiesdlist.length === 2) {
      if (idx === 1) {
        entitiesdlist[idx].EntityField.map((entityField) => {
          if (entityField.EntityFieldDataType?.Name === 'Lookup') {
            if (entitiesdlist[0].Id === entityField.Lookup) {
              masterEntitylist.push(entityField)
            }
          }
        })
      }
    }
  })
  const hasParentGroup = () => !!parentId

  const onCombinatorChange = (value) => {
    onPropChange('groupType', value, id, entity)
  }
  const onEntityChange = (value) => {
    onPropChange('entity', value, id, entity)
  }
  const onParentEntityChange = (value) => {
    onPropChange('parentEntityfield', value, id, entity)
  }
  const onCaseEntityChange = (value) => {
    onPropChange('masterEntityfield', value, id, entity)
  }

  const addRule = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (isEmpty(entity)) alert('Select Entity')
    else {
      const newRule = createRule(entity)
      onRuleAdd(newRule, id, entity)
    }
  }

  const addGroup = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const newGroup = createRuleGroup()
    onGroupAdd(newGroup, id)
  }

  const removeGroup = (event) => {
    event.preventDefault()
    event.stopPropagation()

    onGroupRemove(id, parentId || '')
  }

  const level = getLevel(id)
  return (
    <div className={`ruleGroup`} data-rule-group-id={id} data-level={level}>
      <div className={`ruleGroup-header`}>
        {filterdata.length !== 0 ? (
          <controls.entitySelector
            options={filterdata}
            value={entity}
            title={'Entities'}
            className={`ruleGroup-entities`}
            handleOnChange={onEntityChange}
            filters={filters}
            level={level}
            context={context}
          />
        ) : null}
        {showCombinatorsBetweenRules ? null : (
          <controls.combinatorSelector
            options={combinators}
            value={groupType}
            title={'Combinators'}
            className={`ruleGroup-combinators`}
            handleOnChange={onCombinatorChange}
            filters={filters}
            level={level}
            context={context}
          />
        )}

        {parentEntitylist.length === 0 ? null : (
          <controls.parentEntityfield
            options={parentEntitylist}
            value={parentEntityfield}
            title={'Parent Entityfield'}
            className={`ruleGroup-combinators`}
            handleOnChange={onParentEntityChange}
            filters={filters}
            level={level}
            context={context}
          />
        )}
        {masterEntitylist.length === 0 ? null : (
          <controls.masterEntityfield
            options={masterEntitylist}
            value={masterEntityfield}
            title={'Master Entityfield'}
            className={`ruleGroup-combinators`}
            handleOnChange={onCaseEntityChange}
            filters={filters}
            level={level}
            context={context}
          />
        )}
        <controls.addRuleAction
          label={'Add Filter'}
          title={'Add Filter'}
          className={`ruleGroup-addRule`}
          handleOnClick={addRule}
          filters={filters}
          level={level}
          context={context}
        />
        <controls.addGroupAction
          label={'Add Group'}
          title={'Add Group'}
          className={`ruleGroup-addGroup`}
          handleOnClick={addGroup}
          filters={filters}
          level={level}
          context={context}
        />
        {hasParentGroup() ? (
          <controls.removeGroupAction
            label={'x'}
            title={'Remove Group'}
            className={`ruleGroup-remove`}
            handleOnClick={removeGroup}
            filters={filters}
            level={level}
            context={context}
          />
        ) : null}
      </div>
      {filters.map((r, idx) => {
        return (
          <Fragment key={r.id}>
            {idx && showCombinatorsBetweenRules ? (
              <controls.combinatorSelector
                options={combinators}
                value={groupType}
                title={'Combinators'}
                className={`ruleGroup-combinators betweenRules`}
                handleOnChange={onCombinatorChange}
                filters={filters}
                level={level}
                context={context}
              />
            ) : null}
            {isRuleGroup(r) ? (
              <controls.ruleGroup
                id={r.id}
                schema={schema}
                parentId={id}
                groupType={r.groupType}
                filters={r.filters}
                entity={r.entity}
                context={context}
                parentEntityfield={r.parentEntityfield}
                masterEntityfield={r.masterEntityfield}
                // currentroot={r}
              />
            ) : (
              <controls.rule
                id={r.id}
                entity={entity}
                field={r.field}
                value={r.value}
                operator={r.op}
                property={r.property}
                schema={schema}
                parentId={id}
                context={context}
                stringoperators={stringoperators}
                currentroot={r}
              />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

RuleGroup.displayName = 'RuleGroup'
