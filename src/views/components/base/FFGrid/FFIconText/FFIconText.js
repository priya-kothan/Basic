import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'

import { MaterialIconAsync } from '../../../../../utils/DatatypeIconData'
import './FFIconText.css'

const FFIconText = ({ data }) => {
  if (data && data.DataTypeId !== null) {
    return (
      <div id="long-menu" className="GridIconMenu">
        <Grid container className="GridIconSelect">
          <Grid item xs={1.5} className="GridIcon">
            <MaterialIconAsync icon={data.DataTypeIcon} />
          </Grid>
          <Grid item xs={6} className="GridIcon">
            &nbsp; {data.DataType}
          </Grid>
        </Grid>
      </div>
    )
  }
  return (
    <>
      <div />
    </>
  )
}

FFIconText.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
}

FFIconText.defaultProps = { data: {} }

export default FFIconText
