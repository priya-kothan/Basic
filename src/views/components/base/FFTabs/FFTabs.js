import React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'
import './FFTabs.css'

function TabPanel(props) {
  const { children, value, index, className } = props

  return (
    <div
      className={`tab-panel ${className}`}
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
    >
      {children}
    </div>
  )
}

export const FFTabs = ({
  cssClass,
  dataSource,
  value,
  id,
  onChangeHandler,
  onChange,
  ...rest
}) => {
  const [tabIndex, setTabIndex] = React.useState(value || 0)

  const handleChange = (event, newValue) => {
    setTabIndex(newValue)
    // changeid = event.target.innerText
    if (onChangeHandler) onChangeHandler(event, newValue)
    if (onChange) onChange(event, newValue)
  }

  return (
    <div className="FFTabs-root">
      <AppBar
        className={`FFTab-Appbar ${cssClass}_app`}
        position="static"
        color="default"
        elevation={false}
      >
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          className={`${cssClass}`}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {dataSource.map((item) => {
            return (
              <Tab
                // id={item.Itemphoneid}
                disableRipple
                disabled={item?.disabled || false}
                key={item.ItemTitle}
                className={`FFTabcontrol ${item.CSSName ? item.CSSName : ''}`}
                aria-label="left aligned"
                label={<>{item.ItemTitle}</>}
              />
            )
          })}
        </Tabs>
      </AppBar>
      {dataSource.map((item, idx) => {
        return (
          <TabPanel
            // id={item.Itemphoneid}
            value={tabIndex}
            index={idx}
            className={`Contenttext ${
              item.ItemCSSName ? item.ItemCSSName : ''
            }`}
          >
            {item.ItemContent}
          </TabPanel>
        )
      })}
    </div>
  )
}

Tab.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  className: PropTypes.any.isRequired,
}

export default FFTabs
