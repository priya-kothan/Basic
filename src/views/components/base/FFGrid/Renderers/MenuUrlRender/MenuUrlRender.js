import React from 'react'
import _ from 'lodash'

const MenuUrlRender = ({ data, sysListItems }) => {
  let redirectURL = ''
  if (
    data?.List &&
    !_.isEmpty(data.List) &&
    data.DisplayType?.toLowerCase() === 'list'
  ) {
    let parentmenuurlid = ''
    //when binding menu url in listing grid condition checked when type 'string' and sysListItems undefined because avoid the error of find array
    if (sysListItems !== undefined && typeof data?.List == 'string') {
      parentmenuurlid = sysListItems?.find((list) => list.id === data.List)
    }
    const { SysEntity, id } =
      typeof data?.List !== 'string' ? data.List[0] : parentmenuurlid ?? {}

    if (SysEntity !== undefined || id !== undefined) {
      redirectURL = `/list/${SysEntity}?listId=${id}`
    }
  }

  return redirectURL || data?.MenuURL || ''
}

export default MenuUrlRender
