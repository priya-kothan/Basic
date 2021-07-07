import isRuleGroup from './isRuleGroup'

const generateID = () => Math.random().toString()
const generateValidQuery = (query) => {
  if (isRuleGroup(query)) {
    return {
      id: query.id || `g-${generateID()}`,
      entity: query.entity,
      entityType: query.entityType,
      type: query.type,
      groupType: query.groupType,
      parentEntityfield: query.parentEntityfield,
      masterEntityfield: query.masterEntityfield,
      filters: query.filters.map((rule) => generateValidQuery(rule)),
    }
  }
  return { id: query.id || `r-${generateID()}`, ...query }
}

export default generateValidQuery
