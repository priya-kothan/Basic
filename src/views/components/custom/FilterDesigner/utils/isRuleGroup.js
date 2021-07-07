const isRuleGroup = (ruleOrGroup) => {
  const rg = ruleOrGroup

  return !!(rg.groupType && rg.filters)
}

export default isRuleGroup
