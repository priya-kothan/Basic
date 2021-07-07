import React from 'react'
import { TreeView, TreeItem } from '@material-ui/lab'
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  FolderOpen as FolderOpenIcon,
} from '@material-ui/icons'
import { useQuery } from 'react-query'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { getCoreData } from '../../../../models/api/api'
import utils from '../../../../utils/utils'
import './FFTreeView.css'

const FFTreeView = ({
  id,
  className,
  src,
  dataSourceURL,
  uniqueIDKey,
  parentIDKey,
  labelKey,
  onChangeHandler,
}) => {
  const treeviewData = useQuery(
    ['treeview', dataSourceURL],
    () => getCoreData('get', dataSourceURL).then((response) => response.data),
    {
      enabled: !!dataSourceURL,
    }
  )

  function onNodeSelectHandler(event, selectedValue) {
    const params = {
      id,
      value: selectedValue,
      parentID: parentIDKey,
    }
    if (onChangeHandler) onChangeHandler(event, params)
  }

  function getTreeItems(treeItems) {
    return treeItems.map((treeItem) => {
      return (
        <TreeItem
          className="treeview__treeitem"
          nodeId={treeItem[uniqueIDKey]}
          key={treeItem[uniqueIDKey]}
          label={
            <div className="treeview__treeitem_label">
              <FolderOpenIcon color="inherit" />
              <span className="treeviewText">{treeItem[labelKey]}</span>
            </div>
          }
        >
          {treeItem?.children &&
            treeItem.children.length > 0 &&
            getTreeItems(treeItem.children)}
        </TreeItem>
      )
    })
  }

  function renderTreeItems() {
    let treeDataSource = null

    if (dataSourceURL) treeDataSource = _.cloneDeep(treeviewData.data)
    else if (!_.isEmpty(src)) treeDataSource = _.cloneDeep(src)
    else return 'No records found'

    treeDataSource = utils.transformJSONToTree(
      treeDataSource,
      uniqueIDKey,
      parentIDKey
    )

    return getTreeItems(treeDataSource)
  }

  if (dataSourceURL && treeviewData.isFetching) return 'Loading'

  return (
    <TreeView
      id={id}
      className={`treeview ${className}`}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={onNodeSelectHandler}
    >
      {renderTreeItems()}
    </TreeView>
  )
}

FFTreeView.defaultProps = {
  className: '',
  onChangeHandler: () => null,
  dataSourceURL: null,
}

FFTreeView.propTypes = {
  id: PropTypes.string.isRequired,
  src: PropTypes.arrayOf(PropTypes.object).isRequired,
  className: PropTypes.string,
  onChangeHandler: PropTypes.func,
  dataSourceURL: PropTypes.string,
  uniqueIDKey: PropTypes.string.isRequired,
  parentIDKey: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
}

export default FFTreeView
