import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Drawer as MUIDrawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import {
  Menu as MenuIcon,
  GridOn as GridOnIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@material-ui/icons'

import utils from '../../../../utils/utils'
import './Drawer.css'

const drawerSchema = [
  {
    MenuIcon: 'DataIcon',
    MenuLabel: 'Data',
    MenuURL: '/',
    SubMenus: [
      {
        MenuIcon: '',
        MenuLabel: 'Entities',
        MenuURL: '/Entities',
      },
      {
        MenuIcon: '',
        MenuLabel: 'Option Sets',
        MenuURL: '/OptionSet',
      },
      {
        MenuIcon: '',
        MenuLabel: 'Audit Record',
        MenuURL: '/auditrecord',
      },
    ],
  },
]

const generateMenuID = (menuSchema) => {
  if (!menuSchema?.length) return null

  menuSchema.map((menuItem) => {
    const menuItemObj = menuItem
    menuItemObj.id = utils.generateGUID()
    generateMenuID(menuItemObj.SubMenus)
    return menuSchema
  })

  return menuSchema
}

const Drawer = () => {
  const initialState = {
    openDrawer: false,
    selectedMainMenuId: null,
    selectedSubMenuId: null,
    openHoverMenu: false,
  }

  const [state, setState] = useState(() => ({
    ...initialState,
    drawerSchema: generateMenuID(drawerSchema),
  }))

  const handleDrawerClose = () => {
    setState((currentState) => ({
      ...currentState,
      openDrawer: !currentState.openDrawer,
    }))
  }

  const renderSubMenus = (subMenus, parentID, level) => {
    if (!subMenus?.length) return null

    return (
      <List disablePadding className={`drawer__submenu level_${level}`}>
        {subMenus.map((subMenuItem) => (
          <>
            <ListItem
              className={`drawer__submenu_item ${
                state.selectedSubMenuId === subMenuItem.id ? 'active' : ''
              } level_${level}`}
              style={{ paddingLeft: `${+level + 2.5}rem` }}
              button
              component={Link}
              to={subMenuItem.MenuURL}
              key={subMenuItem.id}
              id={subMenuItem.id}
              onClick={() => {
                setState((currentState) => ({
                  ...currentState,
                  selectedSubMenuId: subMenuItem.id,
                  openHoverMenu: false,
                }))
              }}
            >
              <ListItemText primary={subMenuItem.MenuLabel} />
            </ListItem>
            {renderSubMenus(subMenuItem.SubMenus, subMenuItem.id, level + 1)}
          </>
        ))}
      </List>
    )
  }

  const renderHoverMenus = (subMenus) => {
    if (!subMenus?.SubMenus?.length > 0) return null

    return (
      <ul className="submenu">
        <li key={subMenus.MenuLabel} className="submenu__header">
          {subMenus.MenuLabel}
        </li>
        {subMenus.SubMenus.map((subMenu) => {
          return (
            <li
              key={subMenu.MenuLabel}
              className={`${subMenu.SubMenus ? 'dropdown' : ''}`}
              onClick={() => {
                setState((currentState) => ({
                  ...currentState,
                  selectedSubMenuId: subMenu.id,
                }))
              }}
              role="menuitem"
              onKeyDown={() => {}}
            >
              <Link to={subMenu.MenuURL}>{subMenu.MenuLabel}</Link>
              {renderHoverMenus(subMenu)}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className={`drawer drawer_${state.openDrawer ? 'open' : 'close'}`}>
      <MUIDrawer
        variant="permanent"
        className={`muidrawer_${state.openDrawer ? 'open' : 'close'}`}
      >
        <div className="drawer__toggle">
          <IconButton disableRipple onClick={handleDrawerClose}>
            <MenuIcon />
          </IconButton>
        </div>
        <List disablePadding className="drawer__mainmenu menu">
          {state.drawerSchema.map((menuItem) => {
            return (
              <>
                <ListItem
                  className={`drawer__mainmenu_item ${
                    state.selectedMainMenuId === menuItem.id ? 'active' : ''
                  }`}
                  button
                  component={Link}
                  key={menuItem.id}
                  id={menuItem.id}
                  onClick={() => {
                    setState((currentState) => {
                      if (currentState.selectedMainMenuId === menuItem.id)
                        return {
                          ...currentState,
                          selectedMainMenuId: null,
                          openHoverMenu: !currentState.openHoverMenu,
                        }

                      return {
                        ...currentState,
                        selectedMainMenuId: menuItem.id,
                        openHoverMenu: !currentState.openHoverMenu,
                      }
                    })
                  }}
                >
                  <ListItemIcon>
                    {menuItem.MenuIcon && <GridOnIcon />}
                  </ListItemIcon>
                  <ListItemText primary={menuItem.MenuLabel} />
                  {state.selectedMainMenuId === menuItem.id ? (
                    <KeyboardArrowUp className="drawer__menukeyup" />
                  ) : (
                    <KeyboardArrowDown className="drawer__menukeydown" />
                  )}
                  {!state.openDrawer &&
                    state.openHoverMenu &&
                    renderHoverMenus(menuItem)}
                </ListItem>
                {state.selectedMainMenuId === menuItem.id &&
                  state.openDrawer &&
                  renderSubMenus(menuItem.SubMenus, menuItem.id, 1)}
              </>
            )
          })}
        </List>
      </MUIDrawer>
    </div>
  )
}

export default React.memo(Drawer)
