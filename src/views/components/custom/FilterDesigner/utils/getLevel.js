import isRuleGroup from './isRuleGroup'

const getLevel = (id, index, query) => {
  let foundAtIndex = -1

  if (query.id === id) {
    foundAtIndex = index
  } else if (isRuleGroup(query)) {
    query.filters.forEach((rule) => {
      if (foundAtIndex === -1) {
        let indexForRule = index

        if (isRuleGroup(rule)) indexForRule++

        foundAtIndex = getLevel(id, indexForRule, rule)
      }
    })
  }

  return foundAtIndex
}

export default getLevel
