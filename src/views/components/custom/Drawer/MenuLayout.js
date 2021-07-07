import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useQuery, useQueries, useQueryClient, useMutation } from 'react-query'
import {
  Drawer as MUIDrawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
} from '@material-ui/core'
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  AccessTime as AccessTimeIcon,
  ExpandLess,
  ExpandMore,
  UnfoldMore,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@material-ui/icons'
import { useConfirm } from 'material-ui-confirm'
import _ from 'lodash'
import apiEndPoints from '../../../../models/api/apiEndpoints'
import getAPIData, { getCoreData } from '../../../../models/api/api'
import useAppContext from '../../hooks/useToast'
import './MenuLayout.css'
import PinImage from '../../../../assets/DefaultIcons/Pin.png'
import PinDeleteImage from '../../../../assets/DefaultIcons/PinDelete.png'
import broken from '../../../../assets/DefaultIcons/broken.png'
import isDone from '../../../../assets/DefaultIcons/Done.png'

function Reducer(state, action) {
  switch (action.type) {
    case 'Set_navGroup':
      return {
        ...state,
        ...action.payload,
      }

    case 'Set_pinned':
      return {
        ...state,
        ...action.payload,
      }
    case 'Set_selectedNavGroupItem':
      return {
        ...state,
        ...action.payload,
      }

    case 'Set_anchorEl':
      return {
        ...state,
        ...action.payload,
      }

    case 'Set_Drawer':
      return {
        ...state,
        ...action.payload,
      }
    case 'Set_activeItems':
      return {
        ...state,
        ...action.payload,
      }
    case 'Set_MouseHover':
      return {
        ...state,
        ...action.payload,
      }

    case 'Set_menuAnchorEl':
      return {
        ...state,
        ...action.payload,
      }
    case 'Set_RecentItem':
      return {
        ...state,
        ...action.payload,
      }
    case 'Set_userFavourites':
      return {
        ...state,
        ...action.payload,
      }
    case 'Set_Recent':
      return {
        ...state,
        ...action.payload,
      }

    case 'set_Home':
      return {
        ...state,
        ...action.payload,
      }
    case 'set_Refresh':
      return {
        ...state,
        ...action.payload,
      }

    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const MenuLayout = (props, ref = {}) => {
  const { showToastMessage, showLoading, userId, getNavgroup } = useAppContext()
  const location = useLocation()
  if (location.pathname == '/') {
    localStorage.setItem('navItemId', null)
    // if (localStorage.getItem('navgroupId') == 'null')
    // localStorage.setItem('navgroupId', null)
  }
  React.useImperativeHandle(ref, () => ({
    getNavgroup(navgroupId, navItemId) {
      localStorage.setItem('navgroupId', navgroupId)
      localStorage.setItem('navItemId', navItemId)
    },
  }))

  const initialState = {
    openDrawer: false,
    selectedMainMenuId: null,
    selectedSubMenuId: null,
    openHoverMenu: false,
    openNavGroup: false,
    openPinned: false,
    selectedNavGroupId:
      null || localStorage.getItem('navgroupId') == 'null'
        ? null
        : localStorage.getItem('navgroupId'),
    anchorEl: null,
    selectedIndex: 0,
    sectionItemsData: [],
    selectedNavsecItemId:
      null || localStorage.getItem('navItemId') == 'null'
        ? null
        : localStorage.getItem('navItemId'),
    mouseHoverId: null,
    menuAnchorEl: null,
    pinned: [],
    userid: '',
    openRecent: false,
    UpdateRecent: null,
    selectedHomeId:
      localStorage.getItem('navItemId') == 'null' ||
      localStorage.getItem('navItemId') == null,
  }

  const [state, dispatch] = React.useReducer(Reducer, initialState)

  const confirmalert = useConfirm()
  const queryClient = useQueryClient()
  state.userid = userId
  // state.userid = '4a6fabaf-b026-4b60-b28c-21bdf5a27936'

  const navSectionandItemData = useQuery({
    queryKey: ['navSectionandItemData', state.selectedNavGroupId],
    queryFn: () =>
      getCoreData(
        apiEndPoints.GetMenuItem.method,
        `${apiEndPoints.GetMenuItem.url}(${state.selectedNavGroupId})?$expand=MenuItem,MenuItem,IconField`
        // `${apiEndPoints.GetMenuItem.url}?$filter=id eq ${state.selectedNavGroupId}&$expand=MenuItem,MenuItem,IconField`
      ).then((response) => {
        return response?.data[0]
      }),
    enabled: !!state.selectedNavGroupId,
  })

  const mutateListColumns = useMutation(
    (mutationData) => {
      showLoading(true)
      getCoreData(
        apiEndPoints.GetUserFavourites.method,
        `${apiEndPoints.GetUserFavourites.url}?$filter=User eq ${state.userid} and sysParentEntityID eq ${mutationData.requestBody?.EntityId} and UserFavouritesType eq 'Pin'&$orderby=EntityDisplayText`
      ).then((response) => {
        getCoreData(
          apiEndPoints.DeleteUserFavourites.method,
          `${apiEndPoints.DeleteUserFavourites.url}(${response.data[0].id})`,
          apiEndPoints.DeleteUserFavourites.methodname
        )
          .then((deleteResponse) => {
            if (deleteResponse.status === 200) {
              showToastMessage(deleteResponse.data[0]?.Message, 'success')
              queryClient.invalidateQueries('pinnedData')
              queryClient.invalidateQueries('isRecentitem')
            }
          })
          .catch((err) => {
            showLoading(false)
            const errorMessage = JSON.stringify(err?.response?.data)
            showToastMessage(errorMessage, 'error')
          })
      })
      showLoading(false)
    },
    {
      onError: (err) => {},
      onSettled: () => {
        // queryClient.invalidateQueries('pinnedData')
      },
    }
  )

  const mutateListDelete = useMutation(
    (mutationData) => {
      const requestURL =
        mutationData.mutationType === 'Delete'
          ? `${apiEndPoints.UserFavourites.url}(${mutationData.requestBody?.UserFavouritesid})`
          : apiEndPoints.UserFavourites.url
      mutationData.mutationType
      return getCoreData(
        mutationData.mutationType,
        requestURL,
        mutationData.requestBody
      )
    },
    {
      onError: (err) => {
        // showToastMessage(JSON.stringify(err?.response?.data), 'error')
      },
      onSettled: () => {
        // showLoading(false)
        // showToastMessage('Updated successfully')
        queryClient.invalidateQueries('isRecentitem')
        queryClient.invalidateQueries('pinnedData')
      },
    }
  )

  const Recentitem = useQuery({
    queryKey: ['isRecentitem', { type: 'isRecentitem' }],

    queryFn: () =>
      getCoreData(
        'Get',
        `${apiEndPoints.GetUserFavourites.url}?$filter=User eq '${state.userid}' and ( UserFavouritesType eq 'Pin' or UserFavouritesType eq 'History' )&$orderby=CreatedOn desc`
      ).then((response) => {
        return response.data
      }),
    onSuccess: async (responseData) => {
      /*eslint-disable */
      let menuitenarray = []
      const orderuserfavouritem = []
      const getuserFavourites = responseData.reduce((acc, item, index) => {
        if (!acc.includes(item.sysParentEntityType)) {
          acc.push(item.sysParentEntityType)
        }
        return acc
      }, [])

      const Historydata =
        responseData &&
        responseData.filter(
          (item) => item.UserFavouritesType.toLowerCase() === 'history'
        )
      const pindata =
        responseData &&
        responseData.filter(
          (item) => item.UserFavouritesType.toLowerCase() === 'pin'
        )
      const Recentdata = Historydata?.map((item) => {
        const findsourceindex = pindata.find(
          (itemlist) => itemlist.sysParentEntityID === item.sysParentEntityID
        )
        const newitem = { ...item, ...findsourceindex }
        return newitem
      })

      for (let i = 0; i <= getuserFavourites.length - 1; i++) {
        let mult = false
        let listId = ''
        for (let j = 0; j <= Recentdata.length - 1; j++) {
          if (getuserFavourites[i] === Recentdata[j].sysParentEntityType) {
            listId = `${listId} id eq ${Recentdata[j].sysParentEntityID} or`
            mult = true
          }
        }

        if (mult === true) {
          listId = listId.slice(0, -3)
          const entitygetdata = await getCoreData(
            'get',
            `api/${getuserFavourites[i]}?$filter=${listId}`
          )

          const filteredArr = responseData.reduce((acc, current) => {
            const x = acc.find(
              (item) => item.sysParentEntityID === current.sysParentEntityID
            )
            if (!x) {
              return acc.concat([current])
            } else {
              let pinneddata = acc.filter((item) => {
                return item.sysParentEntityID === current.sysParentEntityID
              })

              if (pinneddata.length !== 0) {
                acc.splice(
                  acc.findIndex(
                    (a) => a.sysParentEntityID === current.sysParentEntityID
                  ),
                  1
                )
                let acc1 = { ...current, UserFavouritesType: 'Pin' }
                return acc.concat([acc1])
              } else {
                return acc
              }
              // return acc.concat([acc1])
              // return acc
            }
          }, [])

          entitygetdata &&
            filteredArr.map((item) => {
              let orderuserfavourcheck = entitygetdata?.data.find(
                (itemlist) => itemlist.id === item.sysParentEntityID
              )
              // let orderuserfavourcheck = ''
              // orderuserfavourcheck = entitygetdata?.data.find(
              //   (itemlist) =>
              //     item.UserFavouritesType === 'Pin' &&
              //     item.sysParentEntityID === itemlist.id
              // )
              // if (orderuserfavourcheck === undefined)
              //   orderuserfavourcheck = entitygetdata?.data.find(
              //     (itemlist) => itemlist.id === item.sysParentEntityID
              //   )
              //  if (findsourceindex === undefined)
              //    findsourceindex = responseData.find(
              //      (itemlist) => itemlist.sysParentEntityID === item.id
              //    )

              if (orderuserfavourcheck !== undefined)
                orderuserfavouritem.push(orderuserfavourcheck)
            })
          responseData &&
            orderuserfavouritem.map((item) => {
              let findsourceindex = ''
              findsourceindex = responseData.find(
                (itemlist) =>
                  itemlist.UserFavouritesType === 'Pin' &&
                  itemlist.sysParentEntityID === item.id
              )

              if (findsourceindex === undefined)
                findsourceindex = responseData.find(
                  (itemlist) => itemlist.sysParentEntityID === item.id
                )
              const UserFavouritesdata = {
                EntityDisplayText: findsourceindex.EntityDisplayText,
                UserFavouritesType: findsourceindex.UserFavouritesType,
                sysParentEntityType: findsourceindex.sysParentEntityType,
                UserFavouritesid: findsourceindex.id,
              }
              menuitenarray.push({ ...item, ...UserFavouritesdata })
            })
        }
      }
      dispatch({
        type: 'Set_RecentItem',
        payload: {
          Menuitem: menuitenarray,
        },
      })
    },
    enabled: !!state.userid,
  })

  const [navGroupData, entitymanagerIconField, pinnedData] = useQueries([
    {
      queryKey: ['navGroup', { type: 'navGroupData' }],
      queryFn: () =>
        getCoreData(
          apiEndPoints.GetMenuItem.method,
          `${apiEndPoints.GetMenuItem.url}?$filter=MenuType eq 'NavGroup'&$expand=IconField`
        ).then((response) => {
          if (
            state.selectedNavGroupId == null &&
            localStorage.getItem('navItemId') == 'null' // this is checking for init rendering
          ) {
            dispatch({
              type: 'Set_selectedNavGroupItem',
              payload: {
                anchorEl: 'e',
                selectedNavGroupId: response?.data[state.selectedIndex].id,
                selectedIndex: state.selectedIndex,
              },
            })
          }
          return response?.data
        }),
      //enabled: state.selectedNavGroupId == null,
    },
    {
      queryKey: ['entitymanagerIconField', 'entityIconField'],
      queryFn: () =>
        getAPIData(
          apiEndPoints.GetEntity.method,
          `${apiEndPoints.GetEntity.url}?$filter=Name eq 'MenuItem'`
        ).then((response) => response.data.value[0]?.IconURL || ''),
    },
    {
      queryKey: ['pinnedData', { type: 'pinnedData' }],
      queryFn: () =>
        getCoreData(
          apiEndPoints.GetUserFavourites.method,
          `${apiEndPoints.GetUserFavourites.url}?$filter=User eq ${state.userid} and UserFavouritesType eq 'Pin'&$orderby=EntityDisplayText`
        ).then((response) => {
          const array_value = response?.data.reduce((data, current) => {
            if (
              !data.some(
                (x) => x.sysParentEntityID === current.sysParentEntityID
              )
            ) {
              data.push(current)
            }
            return data
          }, [])

          const array_consolidate = array_value.reduce((item, value) => {
            if (
              !item.some(
                (x) => x.sysParentEntityType === value.sysParentEntityType
              )
            ) {
              item.push(value.sysParentEntityType)
            }
            return item
          }, [])

          let array_names = []
          array_names = array_consolidate.filter(function (elem, indx) {
            return array_consolidate.indexOf(elem) == indx
          })
          /*eslint-disable */
          let array_pinnedData = []
          let entityDisplayText = ''
          if (array_names && array_names.length > 0) {
            Object.entries(array_names).forEach(([key, value]) => {
              let query_string = `api/${value}?$filter=id eq `
              entityDisplayText = ''

              array_value
                .filter((task) => task.sysParentEntityType === value)
                .map((task) => {
                  entityDisplayText = task.EntityDisplayText
                  query_string = `${
                    query_string + task.sysParentEntityID
                  } or id eq `
                })

              getCoreData('get', query_string.slice(0, -9)).then((Response) => {
                if (Response) {
                  Response.data.map((item) => {
                    const findsourceindex = array_value.find(
                      (itemlist) => itemlist.sysParentEntityID === item.id
                    )

                    array_pinnedData.push({
                      id: item.id,
                      [findsourceindex?.EntityDisplayText]:
                        item[findsourceindex?.EntityDisplayText],
                      entityName: value,
                    })
                  })
                }
                dispatch({
                  type: 'Set_pinned',
                  payload: {
                    pinned: array_pinnedData,
                  },
                })
              })
            })
          } else {
            dispatch({
              type: 'Set_pinned',
              payload: {
                pinned: array_pinnedData,
              },
            })
          }
        }),

      enabled: !!state.userid,
    },
  ])

  const handleMenuItemClick = (event, index, id) => {
    dispatch({
      type: 'Set_selectedNavGroupItem',
      payload: {
        openNavGroup: !state.openNavGroup,
        anchorEl: null,
        selectedNavGroupId: id,
      },
    })
    getNavgroup(id, state.selectedNavsecItemId)
  }

  const handleMenuPinnedItemClick = (event, index, id) => {
    dispatch({
      type: 'Set_selectedNavGroupItem',
      payload: {
        anchorEl: null,
        selectedIndex: index,
      },
    })
  }

  const handleMenurecentItemClick = (event, index, id) => {
    dispatch({
      type: 'Set_selectedNavGroupItem',
      payload: {
        anchorEl: null,
        selectedIndex: index,
      },
    })
  }

  const handlepinnedItemDelete = (event, index, id) => {
    const methodType = 'Delete'
    let gettype = {}

    confirmalert({
      description: 'Are you sure you want to remove?',
    })
      .then(() => {
        showLoading(true)
        gettype = {
          EntityId: id,
        }
        mutateListColumns.mutate({
          mutationType: methodType,
          requestBody: gettype,
        })
      })
      .catch((err) => {
        showLoading(false)
      })
      .finally(() => {
        showLoading(false)
      })
  }

  const handleClose = () => {
    dispatch({
      type: 'Set_AnchorEl',
      payload: {
        anchorEl: null,
      },
    })
  }

  const handleDrawerClose = () => {
    dispatch({
      type: 'Set_Drawer',
      payload: {
        openDrawer: !state.openDrawer,
        anchorEl: null,
        openNavGroup: false,
      },
    })
  }

  const handleClickListItem = (event) => {
    dispatch({
      type: 'Set_navGroup',
      payload: {
        openNavGroup: !state.openNavGroup,
        anchorEl: event.currentTarget,
        openPinned: false,
        openHoverMenu: false,
      },
    })
  }

  const navGroupClick = (event, index, id) => {
    dispatch({
      type: 'Set_selectedNavGroupItem',
      payload: {
        openNavGroup: false,
        anchorEl: null,
        selectedNavGroupId: id,
        selectedIndex: index,
      },
    })
    getNavgroup(id, state.selectedNavsecItemId)
  }

  const handleClickPinnedListItem = (event) => {
    dispatch({
      type: 'Set_pinned',
      payload: {
        openPinned: !state.openPinned,
      },
    })
  }
  const handleClickRecentlistimage = (event, index, options) => {
    let gettype = {}
    let methodType = ''
    if (options?.UserFavouritesType?.toLowerCase() === 'pin') {
      gettype = {
        UserFavouritesid: options.UserFavouritesid,
      }
      methodType = 'Delete'
    } else {
      gettype = {
        User: userId,
        sysParentEntityType: options?.sysParentEntityType,
        UserFavouritesType: 'Pin',
        Organisation: options?.Organisation,
        EntityDisplayText: options?.EntityDisplayText || '',
        sysParentEntityID: options.id,
      }
      methodType = 'Post'
    }
    mutateListDelete.mutate({
      mutationType: methodType,
      requestBody: gettype,
    })
  }

  const handleClickRecentListItem = (event) => {
    dispatch({
      type: 'Set_Recent',
      payload: {
        openRecent: !state.openRecent,
      },
    })
  }

  function renderHoverItems(menuItem) {
    if (!menuItem) return null
    return (
      <List className="submenu-items">
        <ListItem
          key={menuItem.Name}
          className={`${menuItem ? 'dropdown' : ''}`}
          button
          component={Link}
          to={menuItem.MenuURL}
        >
          <div className="selected_Items">
            <ListItemIcon style={{ alignSelf: 'center' }}>
              <img
                src={
                  menuItem.IconField?.[0]?.FullURL ||
                  entitymanagerIconField?.data
                }
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = `${broken}`
                }}
                className="imageicon"
              />
            </ListItemIcon>
            <ListItemText>{menuItem.Name} </ListItemText>
          </div>
        </ListItem>
      </List>
    )
  }

  const renderNavItems = (NavItems, parentID, level) => {
    if (!NavItems?.length) return null
    return (
      <List disablePadding className={`drawer__submenu level_${level}`}>
        {NavItems.map((navItems) => (
          <>
            {state.openDrawer ? (
              <ListItem
                className={`drawer__submenu_item ${
                  state.selectedNavsecItemId === navItems.id ? 'active' : ''
                }  ${state.openDrawer === false ? '__padding' : ''} `}
                button
                component={Link}
                to={navItems.MenuURL}
                key={navItems.id}
                id={navItems.id}
                onClick={(e) => {
                  dispatch({
                    type: 'Set_activeItems',
                    payload: {
                      selectedNavsecItemId: navItems.id,
                      openHoverMenu: state.selectedNavsecItemId === navItems.id,
                    },
                  })
                  getNavgroup(state.selectedNavGroupId, navItems.id)
                }}
              >
                <ListItemIcon className="submenu_icon">
                  <img
                    src={
                      navItems.IconField?.[0]?.FullURL ||
                      entitymanagerIconField?.data
                    }
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = `${broken}`
                    }}
                    className="imageicon"
                  />
                </ListItemIcon>
                <ListItemText className="navItem" primary={navItems.Name} />
              </ListItem>
            ) : (
              <ListItem
                className={`drawer__submenu_item ${
                  state.selectedNavsecItemId === navItems.id ? 'active' : ''
                } level_${level}  ${
                  state.openDrawer === false ? '__padding' : ''
                } `}
                button
                component={Link}
                key={navItems.id}
                id={navItems.id}
                onClick={(e) => {
                  dispatch({
                    type: 'Set_activeItems',
                    payload: {
                      selectedNavsecItemId: navItems.id,
                      openHoverMenu: state.selectedNavsecItemId === navItems.id,
                      mouseHoverId: null,
                      menuAnchorEl: e.currentTarget,
                    },
                  })
                  getNavgroup(state.selectedNavGroupId, navItems.id)
                }}
                onMouseEnter={(e) => {
                  !state.openDrawer &&
                    dispatch({
                      type: 'Set_MouseHover',
                      payload: {
                        mouseHoverId: navItems.id,
                        openHoverMenu: state.mouseHoverId === navItems.id,
                        menuAnchorEl: e.currentTarget,
                      },
                    })
                  getNavgroup(state.selectedNavGroupId, navItems.id)
                }}
              >
                <ListItemIcon>
                  <img
                    src={
                      navItems.IconField?.[0]?.FullURL ||
                      entitymanagerIconField?.data
                    }
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = `${broken}`
                    }}
                    className="imageicon"
                  />
                </ListItemIcon>
                <ListItemText className="navItem" primary={navItems.Name} />
                {!state.openDrawer &&
                  state.mouseHoverId &&
                  renderHoverItems(
                    NavItems &&
                      NavItems.find(
                        (menuitems) =>
                          menuitems.id?.toLowerCase() ===
                          state.mouseHoverId?.toLowerCase()
                      )
                  )}
              </ListItem>
            )}
          </>
        ))}
      </List>
    )
  }

  const renderHoverNavGroupMenus = (subMenus) => {
    if (!subMenus) return null

    return (
      <List className="submenu group__Items">
        {subMenus &&
          subMenus.length &&
          subMenus.map((subMenu, index) => {
            return (
              <ListItem
                key={subMenu.Name}
                className={`${subMenu ? 'dropdown' : ''}`}
                onClick={(event) => navGroupClick(event, index, subMenu.id)}
                role="menuitem"
              >
                {state.selectedNavGroupId === subMenu.id ? (
                  <div className="selected_Items">
                    <ListItemIcon style={{ alignSelf: 'center' }}>
                      <img
                        src={isDone}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = `${broken}`
                        }}
                        className="imageicon"
                      />
                    </ListItemIcon>
                    <ListItemText>{subMenu.Name} </ListItemText>
                  </div>
                ) : (
                  <ListItemText style={{ paddingLeft: '2.3rem' }}>
                    {subMenu.Name}
                  </ListItemText>
                )}
              </ListItem>
            )
          })}
      </List>
    )
  }

  let navGroupDataClone = _.cloneDeep(navGroupData.data && navGroupData?.data)

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
        <div className="drawer_  v-scroll-auto">
          <List disablePadding className="drawer__mainmenu menu">
            <div>
              <ListItem
                button
                component={Link}
                onClick={(event) => {
                  dispatch({
                    type: 'set_Home',
                    payload: {
                      selectedHomeId: true,
                      selectedNavsecItemId: null,
                    },
                  })
                  getNavgroup(state.selectedNavGroupId, null)
                }}
                to={'/'}
                className={`item-height drawer__mainmenu_item ${
                  state.selectedHomeId == true &&
                  state.selectedNavsecItemId == null
                    ? 'active'
                    : ''
                }`}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText className="navsection" primary="Home" />
              </ListItem>
              {state.openDrawer && (
                <>
                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-pinned"
                    className="item-height"
                    onClick={handleClickRecentListItem}
                  >
                    <ListItemIcon>
                      <AccessTimeIcon />
                    </ListItemIcon>
                    <ListItemText className="navsection" primary="Recent" />

                    {state.openRecent === true ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </ListItem>
                  <div
                    // style={({ 'margin-bottom': '-1rem' }, { display: 'block' })}
                    className="divrecent"
                  >
                    <Collapse
                      in={state.openRecent}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List
                        id="lock-recent"
                        anchorEl={state.anchorEl}
                        keepMounted
                        open={Boolean(state.anchorEl)}
                        onClose={handleClose}
                        className="recentList"
                      >
                        {state?.Menuitem &&
                          state.Menuitem?.map((option, index) => {
                            return (
                              <>
                                <ListItem
                                  // selected={index === state.selectedIndex}
                                  className="drawer__submenu_item"
                                  button
                                  // component={Link}
                                  // to={`/formViewer?entityName=${option.sysParentEntityType}&entityId=${option.id}`}
                                  key={option.id}
                                  id={option.id}
                                  // onClick={(event) =>
                                  //   handleMenurecentItemClick(
                                  //     event,
                                  //     index,
                                  //     option.id
                                  //   )
                                  // }
                                >
                                  <ListItemIcon className="submenu_icon">
                                    <img
                                      src={
                                        option?.UserFavouritesType?.toLowerCase() ===
                                        'pin'
                                          ? PinDeleteImage
                                          : PinImage
                                      }
                                      onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = `${broken}`
                                      }}
                                      className="imageicon"
                                      onClick={(event) =>
                                        handleClickRecentlistimage(
                                          event,
                                          index,
                                          option
                                        )
                                      }
                                    />
                                  </ListItemIcon>
                                  <ListItemText
                                    className="navItem"
                                    // primary={option[option.EntityDisplayText]}
                                    // component={Link}
                                    //  to={`/formViewer?entityName=${option.sysParentEntityType}&entityId=${option.id}`}
                                    onClick={(event) =>
                                      handleMenurecentItemClick(
                                        event,
                                        index,
                                        option.id
                                      )
                                    }
                                  >
                                    <Link
                                      //component={Link}
                                      to={`/formViewer?entityName=${option.sysParentEntityType}&entityId=${option.id}`}
                                    >
                                      {option[option.EntityDisplayText]}
                                    </Link>
                                  </ListItemText>
                                </ListItem>
                              </>
                            )
                          })}
                      </List>
                    </Collapse>
                  </div>

                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-pinned"
                    onClick={handleClickPinnedListItem}
                    className="item-height pinnedList"
                  >
                    <ListItemIcon>
                      <img
                        src={PinImage}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = `${broken}`
                        }}
                        className="imageicon"
                      />
                    </ListItemIcon>
                    <ListItemText className="navsection" primary="Pinned" />

                    {state.openPinned === true ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </ListItem>
                  <div
                    // style={{ display: !state.openDrawer ? 'none' : 'block' }}
                    className="divPinned"
                  >
                    <Collapse
                      in={state.openPinned}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List
                        id="lock-pinned"
                        anchorEl={state.anchorEl}
                        keepMounted
                        open={Boolean(state.anchorEl)}
                        onClose={handleClose}
                        className="item-height pinnedList"
                      >
                        {state.pinned &&
                          state.pinned.map((option, index) => {
                            const keydata = Object.keys(option).filter(
                              (item) => item !== 'id'
                            )
                            const pinnedMenuURL = `/formViewer?entityName=${
                              option[keydata[1]]
                            }&entityId=${option.id}`

                            return (
                              <>
                                <ListItem
                                  className="drawer__submenu_item"
                                  button
                                  key={option.id}
                                  id={option.id}
                                >
                                  <ListItemIcon className="submenu_icon">
                                    <img
                                      src={PinDeleteImage}
                                      onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = `${broken}`
                                      }}
                                      className="imageicon"
                                      onClick={(event) =>
                                        handlepinnedItemDelete(
                                          event,
                                          index,
                                          option.id
                                        )
                                      }
                                    />
                                  </ListItemIcon>
                                  <ListItemText
                                    className="navItem"
                                    //primary={option[keydata[0]]}
                                    // component={Link}
                                    // to={pinnedMenuURL}
                                    onClick={(event) =>
                                      handleMenuPinnedItemClick(
                                        event,
                                        index,
                                        option.id
                                      )
                                    }
                                  >
                                    <Link to={pinnedMenuURL}>
                                      {option[keydata[0]]}
                                    </Link>
                                  </ListItemText>
                                </ListItem>
                              </>
                            )
                          })}
                      </List>
                    </Collapse>
                  </div>
                </>
              )}
            </div>
            {navSectionandItemData.data &&
              navSectionandItemData?.data.MenuItem.map((menuItem) => {
                return (
                  <div>
                    {state.openDrawer &&
                      menuItem.MenuType.toLowerCase() === 'navsection' && (
                        <ListItem
                          className={`drawer__mainmenu_item item-height ${
                            state.selectedMainMenuId === menuItem.id
                              ? 'active'
                              : ''
                          }`}
                          button
                          // component={Link}
                          key={menuItem.id}
                          id={menuItem.id}
                        >
                          <ListItemText
                            className="navsection dynamic"
                            primary={menuItem.Name}
                          />
                        </ListItem>
                      )}
                    {!state.openDrawer && menuItem.MenuItem.length > 0 && (
                      <Divider />
                    )}
                    {menuItem.MenuItem.length > 0 &&
                      renderNavItems(menuItem.MenuItem, menuItem.id, 1)}
                  </div>
                )
              })}
          </List>
        </div>
        <Divider />
        {state.selectedNavGroupId ? (
          <div style={{ 'margin-bottom': '3rem' }}>
            <List
              disablePadding
              className="drawer__mainmenu menu hover"
              style={{ cursor: 'pointer' }}
            >
              <ListItem
                className="drawer__mainmenu_item"
                button
                aria-haspopup="true"
                aria-controls="lock-menu"
                onClick={state.openDrawer && handleClickListItem}
                onMouseEnter={(e) => {
                  !state.openDrawer &&
                    dispatch({
                      type: 'Set_MouseHover',
                      payload: {
                        openHoverMenu: true,
                      },
                    })
                }}
              >
                <ListItemIcon>
                  <img
                    src={
                      (navGroupDataClone &&
                        navGroupDataClone.length &&
                        navGroupDataClone.find((item) => {
                          return item.id == state.selectedNavGroupId
                        })?.IconField?.[0]?.FullURL) ||
                      entitymanagerIconField?.data
                    }
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = `${broken}`
                    }}
                    className="imageicon"
                  />
                </ListItemIcon>

                <ListItemText
                  className="navGroup"
                  primary={
                    navGroupDataClone &&
                    navGroupDataClone.length &&
                    navGroupDataClone.find((item) => {
                      return item.id == state.selectedNavGroupId
                    })?.Name
                  }
                />

                {!state.openNavGroup ? <UnfoldMore /> : <ExpandLess />}
                {!state.openDrawer &&
                  state.openHoverMenu &&
                  renderHoverNavGroupMenus(
                    navGroupDataClone && navGroupDataClone
                  )}
              </ListItem>
            </List>
            <Collapse in={state.openNavGroup} timeout="auto" unmountOnExit>
              <List
                id="lock-menu"
                anchorEl={state.anchorEl}
                keepMounted
                open={Boolean(state.anchorEl)}
                onClose={handleClose}
              >
                {navGroupDataClone &&
                  navGroupDataClone.length &&
                  navGroupDataClone
                    .filter((item, index) => {
                      return item.id != state.selectedNavGroupId
                    })
                    .map((option, index) => (
                      <>
                        <ListItem
                          key={option.id}
                          //selected={option.id === state.selectedIndex}
                          onClick={(event) =>
                            handleMenuItemClick(event, index, option.id)
                          }
                        >
                          <ListItemIcon>
                            <img
                              src={
                                option.IconField?.[0]?.FullURL ||
                                entitymanagerIconField?.data
                              }
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = `${broken}`
                              }}
                              className="imageicon"
                            />
                          </ListItemIcon>
                          <ListItemText
                            className="navGroup"
                            primary={option.Name}
                          />

                          {navGroupDataClone.length - 1 === index &&
                          state.openNavGroup ? (
                            <ExpandMore />
                          ) : null}
                        </ListItem>
                      </>
                    ))}
              </List>
            </Collapse>
          </div>
        ) : null}
      </MUIDrawer>
    </div>
  )
}

export default React.forwardRef(MenuLayout)
