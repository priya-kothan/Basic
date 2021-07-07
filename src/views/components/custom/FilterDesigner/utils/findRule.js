import isRuleGroup from './isRuleGroup'

const findRule = (id, parent) => {
  if (parent.id === id) {
    return parent
  }

  for (const rule of parent.filters) {
    if (rule.id === id) {
      return rule
    }

    if (isRuleGroup(rule)) {
      const subRule = findRule(id, rule)
      if (subRule) {
        return subRule
      }
    }
  }

  return undefined
}

export default findRule
