import React, { useState, Fragment, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Activity from '../../components/custom/Attachments/Activity'
import Payments from '../../components/custom/Payments/Payments'
import './Attachment.css'

const Attachment = () => {
  // const mergedatatypes = (arr1) => {
  //   return arr1.map((item1) => {
  //     return item1.ItemContent.map((datatype) => {
  //       let itemName = datatype.Filed.Label
  //       const datatypeidlist = Fielddatatype.find(
  //         (item) => Object.values(item)[1] === itemName
  //       )
  //       const datatypename = {
  //         datatypeid: datatypeidlist.EntityFieldDataType.Name,
  //       }
  //       return { ...datatype.Filed, ...datatypename }
  //     })
  //   })
  // }

  return (
    <>
      <Grid container spacing={1} className="Grid-container">
        <Grid container item xs={12} spacing={3} className="Grid-panel">
          <>
            {/* <Grid item xs={2} className="Grid-rootleftpanel">
              <Paper className="Main-panel">item</Paper>
            </Grid> */}
            <Grid item xs={12} className="Grid-rootmainpanel">
              <Paper className="Main-panel">
                <Payments />
                <Activity />
              </Paper>
            </Grid>
            {/* <Grid item xs={2} className="Grid-rootrightpanel warpper">
              <Paper className="Main-panel" />
            </Grid> */}
          </>
        </Grid>
      </Grid>
    </>
  )
}

export default Attachment
