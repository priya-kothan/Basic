import React from 'react'

import './FormTabs.css'

const FormTabList = ({ activeIndex, onActiveTab, children }) => {
  return (
    <div className="formtab__tablist">
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          isActive: index === activeIndex,
          onActivate: () => onActiveTab(index),
        })
      })}
    </div>
  )
}

const FormTab = ({ isDisabled, isActive, onActivate, children }) => {
  return (
    <div
      role="presentation"
      className={`formtab__tab${isActive ? ' active' : ''}`}
      onClick={onActivate}
    >
      {children}
    </div>
  )
}

const FormTabPanel = ({ children }) => {
  return <div className="formtab__tabpanel active">{children} </div>
}

const FormTabPanels = ({ activeIndex, children }) => {
  return (
    <div className="formtab__tabpanels">
      {React.Children.map(children, (child, index) =>
        index === activeIndex ? child : null
      )}
    </div>
  )
}

const FormTabs = ({ className, selectedIndex = 0, children }) => {
  const [activeIndex, setActiveIndex] = React.useState(selectedIndex)

  return (
    <div className={`formtab ${className || ''}`}>
      {React.Children.map(children, (child) => {
        if (child.type === FormTabPanels)
          return React.cloneElement(child, { activeIndex })
        if (child.type === FormTabList)
          return React.cloneElement(child, {
            activeIndex,
            onActiveTab: (index) => setActiveIndex(index),
          })
        return child
      })}
    </div>
  )
}

FormTabs.FormTabList = FormTabList
FormTabs.FormTab = FormTab
FormTabs.FormTabPanel = FormTabPanel
FormTabs.FormTabPanels = FormTabPanels

export default FormTabs
