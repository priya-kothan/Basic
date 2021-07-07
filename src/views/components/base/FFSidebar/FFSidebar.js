/*eslint-disable */
import React, { Suspense, Fragment, useState, useEffect } from 'react'
import {
  Menu as MenuIcon,
  GridOn as GridOnIcon,
  KeyboardArrowDown,
  KeyboardArrowUp,
  List as ListOnIcon,
  Close as CloseIcon,
} from '@material-ui/icons'
import { NavLink } from 'react-router-dom'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'

import Branding from '../../custom/Branding/Branding'
import utils from '../../../../utils/utils'
import APIEndPoints from '../../../../models/api/apiEndpoints'
import getAPIData, { getCoreData } from '../../../../models/api/api'
import useAppContext from '../../hooks/useToast'
import './FFSidebar.css'
import { Icon } from '@material-ui/core'
import _ from 'lodash'

const FFSidebar = ({ RoleData, LevelOut, LevelIn, sidebarStatus }) => {
  const initialState = {
    sidebarOpened: false,
    selectedMainMenuId: null,
    selectedSubMenuId: null,
    menudataList: [],
    entityDefaultImage: '',
  }

  const [state, setState] = useState(() => ({
    ...initialState,
  }))
  const { organisation } = useAppContext()

  useEffect(() => {
    async function fetchdata() {
      const getmenudata = await getCoreData(
        APIEndPoints.GetsysMenuItem.method,
        `${APIEndPoints.GetsysMenuItem.url}?$expand=MenuItem,IconField`,
        APIEndPoints.GetsysMenuItem.methodname
      )

      const entityData = await getAPIData(
        APIEndPoints.GetEntity.method,
        `${APIEndPoints.GetEntity.url}?$filter=Name eq 'MenuItem'`,
        APIEndPoints.GetEntity.methodname
      )

      setState((currentState) => ({
        ...currentState,
        menudataList: getmenudata.data,
        entityDefaultImage: entityData?.data?.value[0]?.IconURL,
      }))
    }
    fetchdata()
  }, [])

  function onSidebarButtonClickHandler() {
    setState((currentState) => ({
      ...currentState,
      sidebarOpened: !currentState.sidebarOpened,
    }))
  }
  function closesidebar() {
    onSidebarButtonClickHandler()
  }

  return (
    <Fragment>
      {state.menudataList && (
        <div
          className={`sidebar  ${
            state.sidebarOpened ? 'sidebar-open' : 'sidebar-close'
          }`}
        >
          <div className="sidebar-brand">
            <Branding />
            {state.sidebarOpened && (
              <>
                <span className="sidebar-brand-title">{organisation}</span>
                <CloseIcon className="sidebar-close" onClick={closesidebar} />
              </>
            )}
          </div>
          <div className="nav-links">
            <ul>
              {state.menudataList &&
                state.menudataList.map((menubarItem, index) => {
                  return (
                    <React.Fragment key={`nav-link-${index}`}>
                      <DynamicmenuItems
                        key={`${menubarItem.Name}${index}`}
                        LevelOut={LevelOut}
                        LevelIn={LevelIn}
                        sidebarStatus={state.sidebarOpened}
                        {...menubarItem}
                      />
                    </React.Fragment>
                  )
                  //}
                })}
            </ul>
          </div>
          <div
            className={'sidebar-button ' + 'MenuExtend'}
            onClick={() => onSidebarButtonClickHandler()}
            id="MenuExtend"
          >
            {state.sidebarOpened ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </div>
        </div>
        // </div>
      )}
    </Fragment>
  )

  function DynamicmenuItems({
    Index,
    sidebarStatus,
    Name,
    MenuType,
    MenuIconName,
    MenuIconURL,
    MenuURL,
    menuURL,
    MenuItem,
    MenuIcon,
    IconField,
    LevelOut = 6,
    LevelIn = 0,
    id,
    DisplayType,
    List,
    ...rest
  }) {
    function getMenuUrl(MenuURL) {
      if (List == undefined) return MenuURL
      else if (
        DisplayType.toLowerCase() == 'list' ||
        (DisplayType.toLowerCase() == 'module' && List != undefined)
      )
        return `${MenuURL}?` + `listId=${List}`
    }

    if (LevelIn === 0) localStorage.setItem('spanheader', Name)
    return (
      <Fragment>
        <li
          className={`${
            LevelIn == 0
              ? `nav-link ${state.selectedMainMenuId === id ? 'active' : ''}`
              : 'sub-nav-link'
          }`}
          id={id}
          onClick={() => {
            setState((currentState) => {
              if (currentState.selectedMainMenuId === id)
                return {
                  ...currentState,
                  selectedMainMenuId: null,
                }
              return {
                ...currentState,
                selectedMainMenuId: id,
              }
            })
          }}
        >
          {Name && (
            <>
              {LevelIn == 0 && (
                <div
                  className="menu-header"
                  style={{ paddingLeft: LevelIn * LevelOut }}
                >
                  <div className="menu-icon">
                    {(() => {
                      if (MenuIconName != '') {
                        switch (MenuIconName) {
                          case 'DataIcon':
                            return <GridOnIcon />
                          case 'ListIcon':
                            return <ListOnIcon />
                          default:
                            return <GridOnIcon />
                        }
                      } else {
                        return <img src={MenuIconURL} className="menuImg" />
                      }
                    })()}
                    <span
                      id={'menu-title_' + Name.replace(/\s/g, '')}
                      className="menu-title"
                    >
                      {Name}
                    </span>

                    {state.sidebarOpened && state.selectedMainMenuId === id ? (
                      <KeyboardArrowUp className="drawer__menukeyup" />
                    ) : (
                      state.sidebarOpened && (
                        <KeyboardArrowDown className="drawer__menukeydown" />
                      )
                    )}
                  </div>
                </div>
              )}
              {MenuURL && (
                <>
                  {LevelIn == 1 && Index == 0 && (
                    <span
                      id={
                        'maintitle_' +
                        localStorage.getItem('spanheader').replace(/\s/g, '')
                      }
                      className="maintitle"
                    >
                      {localStorage.getItem('spanheader')}
                    </span>
                  )}

                  <NavLink
                    style={{
                      paddingLeft: `${sidebarStatus}` ? LevelIn * LevelOut : 0,
                    }}
                    to={getMenuUrl(MenuURL)}
                  >
                    {(() => {
                      if (MenuType.toLowerCase() == 'item') {
                        if (IconField) {
                          return (
                            <img
                              src={IconField ? IconField[0]?.FullURL : ''}
                              className="imageicon"
                            />
                          )
                        } else
                          return (
                            <img
                              src={
                                state.entityDefaultImage
                                  ? state.entityDefaultImage
                                  : ''
                              }
                              className="imageicon"
                            />
                          )
                      }
                    })()}

                    {(() => {
                      if (MenuType.toLowerCase() != 'navgroup') {
                        return Name
                      }
                      return null
                    })()}
                  </NavLink>
                </>
              )}
            </>
          )}
          {Array.isArray(MenuItem) ? (
            <div
              className={`${
                LevelIn == 0
                  ? 'submenuitems'
                  : 'submenuitems submenuitems-nested'
              } `}
            >
              <ul>
                {MenuItem.map((subItem, index) => (
                  <DynamicmenuItems
                    key={`${subItem.Name}${index}`}
                    sidebarStatus={sidebarStatus}
                    LevelIn={LevelIn + 1}
                    LevelOut={LevelOut}
                    Index={index}
                    {...subItem}
                  />
                ))}
              </ul>
            </div>
          ) : null}
        </li>
      </Fragment>
    )
  }
}

export default FFSidebar
