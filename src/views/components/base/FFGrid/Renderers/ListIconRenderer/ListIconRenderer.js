import React from 'react'
import { useQuery } from 'react-query'
import {
  BrokenImageSharp as BrokenImageIcon,
  Description as DescriptionIcon,
} from '@material-ui/icons'
import _ from 'lodash'
import PropTypes from 'prop-types'

import apiEndpoints from '../../../../../../models/api/apiEndpoints'
import { getCoreData } from '../../../../../../models/api/api'
import './ListIconRenderer.css'

const ListIconRenderer = ({ data, entityDetails, iconFieldID, listIcon }) => {
  const [isError, setIsError] = React.useState(false)

  // const appResourceData = useQuery(
  //   ['IconsView', listIcon],
  //   () =>
  //     getCoreData(
  //       apiEndpoints.AppResource.method,
  //       `${apiEndpoints.AppResource.url}(${listIcon})`
  //     ).then((response) => response.data[0]),
  //   {
  //     enabled: !!listIcon,
  //   }
  // )

  function getListIcon() {
    if (listIcon && listIcon.length && listIcon[0].FullURL)
      return listIcon[0].FullURL
    return ''
  }

  function getURLFromCoreData() {
    const iconFieldDetails = entityDetails?.ListColumn.find(
      (entityField) => entityField?.entityField?.Id === iconFieldID
    )
    if (!data) return ''
    if (
      iconFieldDetails?.entityField?.EntityFieldDataType?.Name === 'Lookup' &&
      data[iconFieldDetails?.entityField?.Name] &&
      data[iconFieldDetails?.entityField?.Name].length > 0
    )
      return data[iconFieldDetails?.entityField?.Name][0].FullURL || ''
    return data[iconFieldDetails?.entityField?.Name] || ''
  }

  function getImageURL() {
    const urlFromCoreData = getURLFromCoreData()
    const urlFromSysList = getListIcon()
    const urlFromEntity = entityDetails?.IconURL || ''

    const resultURL = urlFromCoreData || urlFromSysList || urlFromEntity || ''

    if (_.isEmpty(resultURL)) return ''

    return {
      url: resultURL,
      fileName: resultURL.split('/').pop(),
      fileType: resultURL.split('.').pop().toLowerCase(),
    }
  }

  function renderListIcon() {
    const imageData = getImageURL()

    if (_.isEmpty(imageData)) return <BrokenImageIcon />

    switch (imageData.fileType) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'bmp':
      case 'gif':
      case 'svg':
        return (
          <img
            className="listicon-cell"
            src={imageData.url}
            alt={imageData.fileName}
            onError={() => setIsError(true)}
          />
        )
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'xls':
      case 'xlsx':
      case 'txt':
      case 'csv':
        return <DescriptionIcon />
      default:
        return <BrokenImageIcon />
    }
  }

  if (isError) return <BrokenImageIcon />

  return renderListIcon()
}

ListIconRenderer.defaultProps = {
  listIcon: [],
}

ListIconRenderer.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
  entityDetails: PropTypes.shape({
    EntityField: PropTypes.instanceOf(PropTypes.array),
  }).isRequired,
  iconFieldID: PropTypes.string.isRequired,
  listIcon: PropTypes.objectOf(PropTypes.object),
}

export default ListIconRenderer
