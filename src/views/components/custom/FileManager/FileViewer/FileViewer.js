import React from 'react'
import { useQuery } from 'react-query'
import { BrokenImageSharp as BrokenImageIcon } from '@material-ui/icons'
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
} from '@material-ui/core'
import './FileViewer.css'
import _ from 'lodash'
import utils from '../../../../../utils/utils'
import getAPIData from '../../../../../models/api/api'
import apiEndPoints from '../../../../../models/api/apiEndpoints'
import FFCheckbox from '../../../base/FFCheckbox/FFCheckbox'

const FileViewer = ({
  className,
  entityDetails,
  viewDetails,
  useCustomData,
  onCheckboxSelectItemChangeHandler,
  checkboxdata,
}) => {
  const FileViewData = useCustomData.filter(function (item) {
    return item.AppResourceType !== 'Folder'
  })

  let LargeIconName = ''
  if (viewDetails) {
    LargeIconName = useQuery(
      ['LargeIconNameData', viewDetails?.LargeIconName],
      () =>
        getAPIData(
          apiEndPoints.GetEntityFields.method,
          `${apiEndPoints.GetEntityFields.url}(${
            viewDetails.LargeIconName || ''
          })`
        ).then((response) => response.data.value[0])
    )
  }

  function getimageMain(data) {
    const urlFromCoreData = data?.FullURL || ''
    const urlFromSysList = getsysListIcon(viewDetails, FileViewData)
    const urlFromEntity = entityDetails?.IconURL || ''

    const resultURL = urlFromCoreData || urlFromSysList || urlFromEntity || ''

    const Extension = resultURL
      .substring(resultURL.lastIndexOf('.'))
      ?.indexOf('.')
    if (!_.isEmpty(resultURL) && Extension === 0) {
      const imagedata = utils.getFileIcons(resultURL)
      return imagedata
    }

    return <BrokenImageIcon />
  }

  function getsysListIcon(sysListdata, coreServicedata) {
    if (sysListdata.ListIcon) {
      const resultdata = coreServicedata.find(
        (item) => (item.id = sysListdata.ListIcon)
      )
      return (resultdata && resultdata?.FullURL) || ''
    }
    return ''
  }

  function getLargeIconName(Keydata, valuedata) {
    let resultdata = ''
    Object.entries(valuedata).forEach(([key, value]) => {
      if (Keydata === key) {
        if (typeof value === 'object') {
          resultdata =
            value.length !== 0
              ? (value[0]?.Name && value[0]?.Name) ||
                (value?.type && value?.type) ||
                ''
              : ''
        } else resultdata = value
      }
    })
    return resultdata
  }
  return (
    <div className={`fileviewer ${className}`}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          <>
            {FileViewData &&
              FileViewData.map((item) => {
                const checkboxflag =
                  checkboxdata.length !== 0
                    ? !!checkboxdata.find((finddata) => finddata.id === item.id)
                    : false
                return (
                  <Grid item xs={2}>
                    <Card
                    // onClick={() => onSelectItemChanged(item)}
                    >
                      <CardActionArea
                        className={checkboxflag ? 'mediachecked' : ''}
                      >
                        {getimageMain(item)}
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            <FFCheckbox
                              Field={{
                                Checked: checkboxflag,
                                FieldValue: item.id,
                              }}
                              onChangeHandler={(event, params) =>
                                onCheckboxSelectItemChangeHandler(params)
                              }
                            />

                            {LargeIconName &&
                              getLargeIconName(LargeIconName?.data?.Name, item)}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                )
              })}
          </>
        </Grid>
      </Grid>
    </div>
  )
}

export default FileViewer
