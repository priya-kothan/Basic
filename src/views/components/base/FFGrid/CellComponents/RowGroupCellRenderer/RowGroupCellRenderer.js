import { groupBy } from 'lodash'
import PropTypes from 'prop-types'

const RowGroupCellRenderer = (props) => {
  const groupByItems = groupBy(
    props.node.allLeafChildren,
    (item) => item.data.FileType
  )
  let groupByText = ''

  groupByItems.forEach((item) => {
    groupByText += `${item} : ${groupByItems[item].length} `
  })
  return `${props.value} (${groupByText})`
}

RowGroupCellRenderer.propTypes = {
  props: PropTypes.objectOf(PropTypes.object),
}

RowGroupCellRenderer.defaultProps = {
  props: {},
}

export default RowGroupCellRenderer
